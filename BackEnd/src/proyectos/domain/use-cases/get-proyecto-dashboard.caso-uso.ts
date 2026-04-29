import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';

type Cashflow = { fecha: string; monto: number };

function safeNumber(value: any): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function npv(rate: number, cashflows: Cashflow[]): number {
  if (!Number.isFinite(rate)) return 0;
  const r = rate;
  return cashflows.reduce((acc, cf, idx) => {
    const amount = safeNumber(cf.monto);
    const t = idx + 1;
    return acc + amount / Math.pow(1 + r, t);
  }, 0);
}

function irr(cashflows: Cashflow[]): number | null {
  // Newton-Raphson sobre NPV. Devuelve tasa por periodo.
  const flows = cashflows.map((c) => safeNumber(c.monto));
  if (flows.length < 2) return null;
  if (!flows.some((v) => v < 0) || !flows.some((v) => v > 0)) return null;

  let guess = 0.1;
  for (let i = 0; i < 50; i++) {
    let f = 0;
    let df = 0;
    for (let t = 0; t < flows.length; t++) {
      const denom = Math.pow(1 + guess, t + 1);
      f += flows[t] / denom;
      df += (-(t + 1) * flows[t]) / (denom * (1 + guess));
    }
    if (Math.abs(df) < 1e-9) break;
    const next = guess - f / df;
    if (!Number.isFinite(next)) break;
    if (Math.abs(next - guess) < 1e-7) return next;
    guess = next;
  }
  return null;
}

@Injectable()
export class GetProyectoDashboardCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(proyectoId: string) {
    const proyecto = await this.proyectoRepositorio.findById(proyectoId);
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');

    const numeroUnidades = safeNumber((proyecto as any).numeroUnidades);
    const precioUnitario = safeNumber((proyecto as any).precioUnitario);
    const precioVentaTotalExplicit = safeNumber(
      (proyecto as any).precioVentaTotal,
    );

    const ingresoProyectado =
      precioVentaTotalExplicit > 0
        ? precioVentaTotalExplicit
        : numeroUnidades > 0 && precioUnitario > 0
          ? numeroUnidades * precioUnitario
          : safeNumber((proyecto as any).precioVentaEstimado);

    const costoTerreno = safeNumber((proyecto as any).costoTerreno);
    const costoConstruccion = safeNumber((proyecto as any).costoConstruccion);
    const costoIndirectos = safeNumber((proyecto as any).costoIndirectos);
    const costoMarketing = safeNumber((proyecto as any).costoMarketing);
    const costoPermisos = safeNumber((proyecto as any).costoPermisos);
    const costoFinanciero = safeNumber((proyecto as any).costoFinanciero);
    const contingencia = safeNumber((proyecto as any).contingencia);

    const costoTotal =
      costoTerreno +
      costoConstruccion +
      costoIndirectos +
      costoMarketing +
      costoPermisos +
      costoFinanciero +
      contingencia;

    const roiProyectado =
      costoTotal > 0
        ? ((ingresoProyectado - costoTotal) / costoTotal) * 100
        : null;

    const breakEvenUnidades =
      precioUnitario > 0 ? Math.ceil(costoTotal / precioUnitario) : null;

    // Margen de seguridad (si hay property asociado)
    const property: any = (proyecto as any).property;
    const valorMercadoTerreno = property
      ? safeNumber(property.basePriceNegotiation) ||
        safeNumber(property.pricePerM2) * safeNumber(property.totalArea)
      : null;
    const margenSeguridad =
      valorMercadoTerreno && costoTerreno
        ? valorMercadoTerreno - costoTerreno
        : null;

    // VAN/TIR (si hay flujoCaja en proyecto)
    const flujoCaja = (proyecto as any).flujoCaja as Cashflow[] | undefined;
    const tasaDescuento = safeNumber((proyecto as any).tasaDescuento) / 100;
    const van = flujoCaja?.length ? npv(tasaDescuento, flujoCaja) : null;
    const tir = flujoCaja?.length ? irr(flujoCaja) : null;

    return {
      proyectoId,
      ingresoProyectado,
      costoTotal,
      roiProyectado,
      breakEvenUnidades,
      margenSeguridad,
      van,
      tir,
    };
  }
}
