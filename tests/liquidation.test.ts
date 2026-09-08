/**
 * Suite de Pruebas Unitarias: Motor de Liquidaciones y Deducciones Financieras
 * Valida la lógica de comisiones comerciales (10%), tarifa de frío ($0.15/caja),
 * retención de flete y cálculo neto al productor.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

interface SettlementItem {
  cajas: number;
  precioUnitarioFOB: number;
  fletePorCaja: number;
  tarifaFrioPorCaja: number;
  porcentajeComision: number;
}

export function calculateSettlement(item: SettlementItem) {
  const ventaBruta = item.cajas * item.precioUnitarioFOB;
  const deduccionComision = ventaBruta * (item.porcentajeComision / 100);
  const deduccionFrio = item.cajas * item.tarifaFrioPorCaja;
  const deduccionFlete = item.cajas * item.fletePorCaja;
  const totalDeducciones = deduccionComision + deduccionFrio + deduccionFlete;
  const liquidacionNeta = ventaBruta - totalDeducciones;
  const retornoPorCaja = liquidacionNeta / item.cajas;

  return {
    ventaBruta,
    deduccionComision,
    deduccionFrio,
    deduccionFlete,
    totalDeducciones,
    liquidacionNeta,
    retornoPorCaja
  };
}

describe('Motor de Liquidaciones Produce First Suite', () => {
  it('debe calcular correctamente la venta bruta de un lote de 1,600 cajas a $14.50 FOB', () => {
    const calc = calculateSettlement({
      cajas: 1600,
      precioUnitarioFOB: 14.50,
      fletePorCaja: 1.20,
      tarifaFrioPorCaja: 0.15,
      porcentajeComision: 10
    });

    assert.equal(calc.ventaBruta, 23200); // 1600 * 14.50
    assert.equal(calc.deduccionComision, 2320); // 10% de 23,200
    assert.equal(calc.deduccionFrio, 240); // 1600 * 0.15
    assert.equal(calc.deduccionFlete, 1920); // 1600 * 1.20
    assert.equal(calc.totalDeducciones, 4480);
    assert.equal(calc.liquidacionNeta, 18720);
    assert.equal(calc.retornoPorCaja, 11.70);
  });

  it('debe proteger contra números negativos o casos de cero cajas', () => {
    const calc = calculateSettlement({
      cajas: 100,
      precioUnitarioFOB: 0,
      fletePorCaja: 1.0,
      tarifaFrioPorCaja: 0.15,
      porcentajeComision: 10
    });

    assert.equal(calc.ventaBruta, 0);
    assert.equal(calc.deduccionComision, 0);
    assert.equal(calc.deduccionFrio, 15);
    assert.equal(calc.deduccionFlete, 100);
    assert.equal(calc.liquidacionNeta, -115);
  });
});
