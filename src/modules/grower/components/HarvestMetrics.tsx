import React from 'react';
import { SimpleGrid, Card, Text, Group } from '@mantine/core';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const HarvestMetrics: React.FC = () => {
  const metrics = [
    { label: 'Cajas Cosechadas Hoy', value: '2,450', subtext: '+12% vs ayer', color: 'green.8' },
    { label: 'Folios Activos', value: '14', subtext: '4 pendientes de escaneo', color: 'orange.8' },
    { label: 'Eficiencia de Cuadrilla', value: '94.2%', subtext: 'Meta: 90%', color: 'blue.8' },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          component={motion.div} 
          variants={itemVariants}
          withBorder 
          padding="md" 
          radius="md" 
          style={{ borderColor: '#D8E4D2' }}
        >
          <Text size="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase' }}>
            {metric.label}
          </Text>
          <Group justify="space-between" align="flex-end" mt={5}>
            <Text size="xl" fw={800} c={metric.color} style={{ lineHeight: 1 }}>
              {metric.value}
            </Text>
            <Text size="xs" c="green.7" fw={600}>
              {metric.subtext}
            </Text>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
};