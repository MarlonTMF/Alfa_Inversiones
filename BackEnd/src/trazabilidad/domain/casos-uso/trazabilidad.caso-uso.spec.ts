import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TrazabilidadCasoUso } from './trazabilidad.caso-uso.js';

describe('TrazabilidadCasoUso.calcularSplit', () => {
  let casoUso: TrazabilidadCasoUso;
  let query: jest.Mock;

  beforeEach(() => {
    query = jest.fn();
    const dataSource = { query } as unknown as DataSource;
    casoUso = new TrazabilidadCasoUso(dataSource);
  });

  it('lanza NotFoundException si la propiedad no existe', async () => {
    query.mockResolvedValue([]);

    await expect(
      casoUso.calcularSplit('propiedad-inexistente', 100000),
    ).rejects.toThrow(NotFoundException);
  });

  it('usa base_price_negotiation como valor de suelo cuando esta definido', async () => {
    query.mockResolvedValue([
      {
        price_per_m2: '500',
        total_area: '200',
        base_price_negotiation: '80000',
      },
    ]);

    const resultado = await casoUso.calcularSplit('prop-1', 200000);

    // 80000 / 200000 * 100 = 40%
    expect(resultado.valor_suelo_extraido).toBe(80000);
    expect(resultado.distribucion_ganancia.propietario_suelo_porcentaje).toBe(
      40,
    );
    expect(resultado.distribucion_ganancia.constructor_porcentaje).toBe(60);
    expect(resultado.estado).toBe('Viable para Joint Venture');
  });

  it('calcula el valor del suelo como price_per_m2 * total_area si no hay base_price_negotiation', async () => {
    query.mockResolvedValue([
      {
        price_per_m2: '300',
        total_area: '100',
        base_price_negotiation: null,
      },
    ]);

    const resultado = await casoUso.calcularSplit('prop-2', 60000);

    // 300 * 100 = 30000 -> 30000 / 60000 * 100 = 50%
    expect(resultado.valor_suelo_extraido).toBe(30000);
    expect(resultado.distribucion_ganancia.propietario_suelo_porcentaje).toBe(
      50,
    );
  });

  it('marca la operacion como riesgo cuando el suelo supera el 40% del split', async () => {
    query.mockResolvedValue([
      {
        price_per_m2: '1000',
        total_area: '100',
        base_price_negotiation: null,
      },
    ]);

    // 1000 * 100 = 100000 -> sobre 150000 en ventas = 66.67%, por encima del umbral
    const resultado = await casoUso.calcularSplit('prop-3', 150000);

    expect(resultado.estado).toBe(
      'Riesgo: Suelo demasiado caro para el split estándar',
    );
  });
});
