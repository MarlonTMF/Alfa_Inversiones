import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CalcularPermutaCasoUso } from './calcular-permuta.caso-uso.js';
import { CalculoPermutaDto } from '../../presentation/dto/calculo-permuta.dto.js';

describe('CalcularPermutaCasoUso', () => {
  let casoUso: CalcularPermutaCasoUso;
  let query: jest.Mock;

  beforeEach(() => {
    query = jest.fn();
    const dataSource = { query } as unknown as DataSource;
    casoUso = new CalcularPermutaCasoUso(dataSource);
  });

  const base: CalculoPermutaDto = {
    costo_suelo: 100_000,
    precio_venta_unidad: 25_000,
    ventas_proyectadas: 500_000,
  };

  it('lanza BadRequestException si no hay costo_suelo ni terreno_id/property_id', async () => {
    await expect(
      casoUso.ejecutar({ ...base, costo_suelo: undefined }),
    ).rejects.toThrow(BadRequestException);
  });

  it('lanza BadRequestException si falta precio_venta_unidad', async () => {
    await expect(
      casoUso.ejecutar({ ...base, precio_venta_unidad: undefined }),
    ).rejects.toThrow(BadRequestException);
  });

  it('lanza BadRequestException si falta ventas_proyectadas', async () => {
    await expect(
      casoUso.ejecutar({ ...base, ventas_proyectadas: undefined }),
    ).rejects.toThrow(BadRequestException);
  });

  it('calcula unidades equivalentes y porcentaje de participacion con costo_suelo explicito', async () => {
    const resultado = await casoUso.ejecutar(base);

    // 100000 / 25000 = 4 unidades
    expect(resultado.opcion_1_fisica.unidades_entregables).toBe(4);
    // 100000 / 500000 * 100 = 20%
    expect(resultado.opcion_2_financiera.porcentaje_participacion).toBe(20);
    expect(resultado.opcion_2_financiera.ingreso_estimado).toBe(100_000);
    expect(query).not.toHaveBeenCalled();
  });

  it('busca el costo del suelo en la base de datos si no se envia costo_suelo', async () => {
    query.mockResolvedValue([
      { price_per_m2: '400', total_area: '300', base_price_negotiation: null },
    ]);

    const resultado = await casoUso.ejecutar({
      terreno_id: '11111111-1111-1111-1111-111111111111',
      precio_venta_unidad: 25_000,
      ventas_proyectadas: 500_000,
    });

    // 400 * 300 = 120000
    expect(resultado.metricas_entregadas.terreno_valorado_en).toBe(120_000);
  });

  it('prioriza base_price_negotiation sobre price_per_m2 * total_area cuando ambos existen', async () => {
    query.mockResolvedValue([
      {
        price_per_m2: '400',
        total_area: '300',
        base_price_negotiation: '90000',
      },
    ]);

    const resultado = await casoUso.ejecutar({
      property_id: '11111111-1111-1111-1111-111111111111',
      precio_venta_unidad: 25_000,
      ventas_proyectadas: 500_000,
    });

    expect(resultado.metricas_entregadas.terreno_valorado_en).toBe(90_000);
  });

  it('lanza NotFoundException si el terreno_id/property_id no existe', async () => {
    query.mockResolvedValue([]);

    await expect(
      casoUso.ejecutar({
        terreno_id: '11111111-1111-1111-1111-111111111111',
        precio_venta_unidad: 25_000,
        ventas_proyectadas: 500_000,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
