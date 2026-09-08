// src/modules/grower/pl/components/PLTable.tsx
import React, { useMemo } from 'react';
import { Paper, Table, Group, Text, Badge, ScrollArea, Box } from '@mantine/core';
import { IconReceipt, IconChartBar, IconTrendingUp, IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface PLRow {
  concepto: string;
  pronostico: number;
  real: number;
  pct: number;
  isBold?: boolean;
  isHighlight?: boolean;
  isNegative?: boolean;
}

interface PLTableProps {
  summary: any;
  viewMode: 'detallado' | 'resumido';
}

export const PLTable: React.FC<PLTableProps> = ({ summary, viewMode }) => {
  // Calcular datos de la tabla
  const { puenteLiquidacion, costosCampo, filteredCostos } = useMemo(() => {
    if (!summary) {
      return { puenteLiquidacion: [], costosCampo: [], filteredCostos: [] };
    }

    const revenue = summary.totalRevenue || 0;
    const commission = revenue * 0.1;
    const salesExpenses = revenue * 0.3;
    const liquidation = revenue - commission - salesExpenses;

    const puente = [
      { concepto: 'Venta bruta (McAllen)', pronostico: revenue, real: revenue, pct: 100 },
      { concepto: 'Comisión 10%', pronostico: -commission, real: -commission, pct: 100, isNegative: true },
      { concepto: 'Gastos de venta', pronostico: -salesExpenses, real: -salesExpenses, pct: 100, isNegative: true },
      { concepto: 'Liquidación', pronostico: liquidation, real: liquidation, pct: 100, isBold: true, isHighlight: true },
    ];

    const costsByCategory = (summary.costsByCategory || {}) as Record<string, number>;
    const costs: PLRow[] = Object.entries(costsByCategory).map(([key, value]) => ({
      concepto: key,
      pronostico: value,
      real: value,
      pct: 100,
    }));

    const totalCosts = Object.values(costsByCategory).reduce((a, b) => a + b, 0);
    costs.push(
      { concepto: 'Total costo de campo', pronostico: totalCosts, real: totalCosts, pct: 100, isBold: true },
      {
        concepto: 'UTILIDAD NETA',
        pronostico: summary.netProfit,
        real: summary.netProfit,
        pct: 100,
        isBold: true,
        isHighlight: true,
      }
    );

    const filtered = viewMode === 'resumido'
      ? costs.filter(row => row.isBold || row.isHighlight)
      : costs;

    return {
      puenteLiquidacion: puente,
      costosCampo: costs,
      filteredCostos: filtered,
    };
  }, [summary, viewMode]);

  const formatCurrency = (val: number) => {
    if (val === 0) return '$0';
    const sign = val < 0 ? '-' : '';
    return `${sign}$${Math.abs(val).toLocaleString()}`;
  };

  const renderRows = (items: PLRow[]) =>
    items.map((row, index) => {
      const rowStyle = row.isHighlight
        ? {
            backgroundColor: '#E8F5E9',
            fontWeight: 800,
            borderLeft: '4px solid #1F5C3A',
          }
        : row.isBold
        ? {
            fontWeight: 700,
            backgroundColor: '#F9F8F6',
            borderLeft: '2px solid #E8E5DC',
          }
        : {};

      return (
        <Table.Tr key={index} style={rowStyle}>
          <Table.Td
            style={{
              fontSize: '13px',
              paddingLeft: row.isBold ? '16px' : '32px',
              color: row.isHighlight ? '#1F5C3A' : '#3A3A34',
              fontWeight: row.isBold ? 700 : 400,
            }}
          >
            {row.concepto}
          </Table.Td>
          <Table.Td
            style={{
              textAlign: 'right',
              fontSize: '13px',
              color: row.isNegative ? '#C0392B' : row.isHighlight ? '#1F5C3A' : '#3A3A34',
              fontWeight: row.isBold ? 700 : 400,
            }}
          >
            {formatCurrency(row.pronostico)}
          </Table.Td>
          <Table.Td
            style={{
              textAlign: 'right',
              fontSize: '13px',
              color: row.isNegative ? '#C0392B' : '#2A6A8A',
              fontWeight: row.isBold ? 700 : 400,
            }}
          >
            {formatCurrency(row.real)}
          </Table.Td>
          <Table.Td style={{ textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>
            <Badge
              size="sm"
              color={row.pct >= 95 ? 'green' : row.pct >= 85 ? 'yellow' : 'red'}
              variant="light"
              radius="xl"
              style={{ fontWeight: 700, minWidth: '45px' }}
            >
              {row.pct}%
            </Badge>
          </Table.Td>
        </Table.Tr>
      );
    });

  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      key={viewMode}
    >
      <Paper
        withBorder
        style={{
          borderColor: '#E8E5DC',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <ScrollArea>
          <Table verticalSpacing="sm" horizontalSpacing="md" withRowBorders>
            <Table.Thead style={{ backgroundColor: '#1F5C3A' }}>
              <Table.Tr>
                <Table.Th
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    padding: '14px 20px',
                    minWidth: '200px',
                  }}
                >
                  <Group gap="xs">
                    <IconReceipt size={16} />
                    Concepto
                  </Group>
                </Table.Th>
                <Table.Th
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    textAlign: 'right',
                    padding: '14px 20px',
                    width: '180px',
                  }}
                >
                  <Group gap="xs" justify="flex-end">
                    <IconChartBar size={16} />
                    Pronóstico
                  </Group>
                </Table.Th>
                <Table.Th
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    textAlign: 'right',
                    padding: '14px 20px',
                    width: '180px',
                  }}
                >
                  <Group gap="xs" justify="flex-end">
                    <IconTrendingUp size={16} />
                    Real
                  </Group>
                </Table.Th>
                <Table.Th
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    textAlign: 'center',
                    padding: '14px 20px',
                    width: '120px',
                  }}
                >
                  % Cumpl.
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {/* Sección 1: Puente a Liquidación */}
              <Table.Tr style={{ backgroundColor: '#2A6A8A' }}>
                <Table.Td
                  colSpan={4}
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    padding: '10px 20px',
                    textTransform: 'uppercase',
                  }}
                >
                  <Group gap="xs">
                    <IconArrowUpRight size={14} />
                    Puente a Liquidación
                  </Group>
                </Table.Td>
              </Table.Tr>
              {renderRows(puenteLiquidacion)}

              {/* Sección 2: Costos de Campo */}
              <Table.Tr style={{ backgroundColor: '#C08412' }}>
                <Table.Td
                  colSpan={4}
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    padding: '10px 20px',
                    textTransform: 'uppercase',
                  }}
                >
                  <Group gap="xs">
                    <IconArrowDownRight size={14} />
                    Costos de Campo por Categoría
                    {viewMode === 'resumido' && (
                      <Badge size="xs" variant="white" radius="sm" style={{ color: '#C08412', fontWeight: 700 }}>
                        Resumido
                      </Badge>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
              {renderRows(filteredCostos)}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </motion.div>
  );
};