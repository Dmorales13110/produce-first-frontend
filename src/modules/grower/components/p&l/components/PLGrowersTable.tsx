// src/modules/grower/pl/components/PLGrowersTable.tsx
import React from 'react';
import { Card, Text, Group, Stack, ThemeIcon, Divider, SimpleGrid, Progress, Badge } from '@mantine/core';
import { IconUsers, IconBox, IconCash } from '@tabler/icons-react';

interface PLGrowersTableProps {
  revenueByGrower: {
    growerId: string;
    growerName: string;
    revenue: number;
    boxes: number;
  }[];
  totalRevenue: number;
}

export const PLGrowersTable: React.FC<PLGrowersTableProps> = ({ revenueByGrower, totalRevenue }) => {
  if (!revenueByGrower || revenueByGrower.length === 0) return null;

  return (
    <Card mt="xl" p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Group gap="sm" mb="lg">
        <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
          <IconUsers size={18} />
        </ThemeIcon>
        <Stack gap={0}>
          <Text size="sm" fw={700} c="#3A3A34">Ingresos por Rancho</Text>
          <Text size="xs" c="dimmed">Contribución a la utilidad total</Text>
        </Stack>
      </Group>

      <Divider mb="lg" />

      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
        {revenueByGrower.map((grower, idx) => (
          <Card
            key={idx}
            p="md"
            radius="md"
            withBorder
            style={{ borderColor: '#E8E5DC', backgroundColor: '#FAF9F5' }}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="sm" fw={700} c="#3A3A34">{grower.growerName}</Text>
                <Group gap="md">
                  <Group gap={4}>
                    <IconBox size={14} color="#9A968A" />
                    <Text size="xs" c="dimmed">{grower.boxes} cajas</Text>
                  </Group>
                  <Group gap={4}>
                    <IconCash size={14} color="#1F5C3A" />
                    <Text size="xs" fw={700} c="#1F5C3A">${grower.revenue.toLocaleString()}</Text>
                  </Group>
                </Group>
              </Stack>
              <Badge
                size="sm"
                color={grower.revenue > 0 ? 'green' : 'gray'}
                variant="light"
                radius="xl"
              >
                {totalRevenue > 0 ? Math.round((grower.revenue / totalRevenue) * 100) : 0}%
              </Badge>
            </Group>
            <Progress
              value={totalRevenue > 0 ? (grower.revenue / totalRevenue) * 100 : 0}
              color="#1F5C3A"
              size="xs"
              radius="xl"
              mt="sm"
            />
          </Card>
        ))}
      </SimpleGrid>
    </Card>
  );
};