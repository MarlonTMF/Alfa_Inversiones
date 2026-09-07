import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CalcularViabilidadCasoUso,
  ResultadoViabilidad,
  ResultadoViabilidadConstructor,
  ResultadoViabilidadInversionista,
} from './calcular-viabilidad.caso-uso.js';
import { CalculoViabilidadDto } from '../../presentation/dto/calculo-viabilidad.dto.js';

/** Angosta el resultado union al caso 'constructor' o falla el test con un mensaje claro. */
function esperarConstructor(
  resultado: ResultadoViabilidad,
): asserts resultado is ResultadoViabilidadConstructor {
  if (resultado.rol !== 'constructor') {
    throw new Error(
      `Se esperaba rol 'constructor', se obtuvo '${resultado.rol}'`,
    );
  }
}

function esperarInversionista(
  resultado: ResultadoViabilidad,
): asserts resultado is ResultadoViabilidadInversionista {
  if (resultado.rol !== 'inversionista') {
    throw new Error(
      `Se esperaba rol 'inversionista', se obtuvo '${resultado.rol}'`,
    );
  }
}

describe('CalcularViabilidadCasoUso', () => {
  let casoUso: CalcularViabilidadCasoUso;
  let query: jest.Mock;

  beforeEach(() => {
    query = jest.fn();
    const dataSource = { query } as unknown as DataSource;
    casoUso = new CalcularViabilidadCasoUso(dataSource);
  });

  describe('rol constructor', () => {
    const base: CalculoViabilidadDto = {
      rol: 'constructor',
      costo_suelo: 100_000,
      ventas_proyectadas: 300_000,
      costo_construccion: 120_000,
    };

    it('lanza BadRequestException si falta ventas_proyectadas', async () => {
      await expect(
        casoUso.ejecutar({ ...base, ventas_proyectadas: undefined }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza BadRequestException si falta costo_construccion', async () => {
      await expect(
        casoUso.ejecutar({ ...base, costo_construccion: undefined }),
      ).rejects.toThrow(BadRequestException);
    });

    it('marca el proyecto como viable cuando la incidencia de suelo y el margen estan en rango', async () => {
      // incidencia = 100000/300000*100 = 33.33% (dentro de 30-40)
      // utilidad = 300000-100000-120000 = 80000 -> margen = 26.67% (dentro de 0-60)
      const resultado = await casoUso.ejecutar(base);
      esperarConstructor(resultado);

      expect(resultado.rol).toBe('constructor');
      expect(resultado.validaciones.suelo_en_rango_optimo).toBe(true);
      expect(resultado.validaciones.utilidad_alcanza_rango).toBe(true);
      expect(resultado.validaciones.es_proyecto_viable).toBe(true);
      expect(resultado.metricas.incidencia_suelo_porcentaje).toBeCloseTo(
        33.33,
        1,
      );
    });

    it('marca el proyecto como no viable si la incidencia de suelo esta fuera del rango 30-40%', async () => {
      // costo_suelo muy bajo respecto a ventas -> incidencia < 30%
      const resultado = await casoUso.ejecutar({
        ...base,
        costo_suelo: 10_000,
      });
      esperarConstructor(resultado);

      expect(resultado.validaciones.suelo_en_rango_optimo).toBe(false);
      expect(resultado.validaciones.es_proyecto_viable).toBe(false);
    });

    it('marca el proyecto como no viable si la utilidad es negativa', async () => {
      const resultado = await casoUso.ejecutar({
        ...base,
        costo_construccion: 250_000, // ventas 300000 - suelo 100000 - construccion 250000 < 0
      });
      esperarConstructor(resultado);

      expect(resultado.validaciones.utilidad_alcanza_rango).toBe(false);
      expect(resultado.validaciones.es_proyecto_viable).toBe(false);
    });

    it('busca el costo del suelo en la base de datos si no se envia costo_suelo', async () => {
      query.mockResolvedValue([
        {
          price_per_m2: '500',
          total_area: '200',
          base_price_negotiation: null,
        },
      ]);

      const resultado = await casoUso.ejecutar({
        rol: 'constructor',
        property_id: '11111111-1111-1111-1111-111111111111',
        ventas_proyectadas: 300_000,
        costo_construccion: 120_000,
      });
      esperarConstructor(resultado);

      // 500 * 200 = 100000
      expect(resultado.metricas.costo_suelo).toBe(100_000);
      expect(query).toHaveBeenCalledTimes(1);
    });

    it('lanza NotFoundException si el property_id no existe en la base de datos', async () => {
      query.mockResolvedValue([]);

      await expect(
        casoUso.ejecutar({
          rol: 'constructor',
          property_id: '11111111-1111-1111-1111-111111111111',
          ventas_proyectadas: 300_000,
          costo_construccion: 120_000,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('rol inversionista', () => {
    it('lanza BadRequestException si falta ticket_inversion', async () => {
      await expect(
        casoUso.ejecutar({
          rol: 'inversionista',
          flujo_anual_proyectado: 12_000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza BadRequestException si falta flujo_anual_proyectado', async () => {
      await expect(
        casoUso.ejecutar({ rol: 'inversionista', ticket_inversion: 60_000 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('calcula el payback en años y meses', async () => {
      const resultado = await casoUso.ejecutar({
        rol: 'inversionista',
        ticket_inversion: 60_000,
        flujo_anual_proyectado: 12_000,
      });
      esperarInversionista(resultado);

      expect(resultado.rol).toBe('inversionista');
      expect(resultado.metricas.payback_years).toBe(5);
      expect(resultado.metricas.payback_months).toBe(60);
    });
  });

  it('lanza BadRequestException si el rol no es constructor ni inversionista', async () => {
    await expect(
      casoUso.ejecutar({
        rol: 'propietario' as CalculoViabilidadDto['rol'],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
