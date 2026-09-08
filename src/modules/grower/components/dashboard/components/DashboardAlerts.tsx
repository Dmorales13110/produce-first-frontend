// src/modules/dashboard/components/DashboardAlerts.tsx
import React from 'react';
import { Card, Text, Group, Stack, Divider, Badge } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconClock } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { DashboardAlert } from '../../../../../services/dashboard';

interface DashboardAlertsProps {
  alerts: DashboardAlert[];
}

export const DashboardAlerts: React.FC<DashboardAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{ marginBottom: '24px' }}
    >
      <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group gap="sm" mb="lg">
          <IconAlertCircle size={18} color="#C08412" />
          <Stack gap={0}>
            <Text size="sm" fw={700} c="#3A3A34">Alertas y Notificaciones</Text>
            <Text size="xs" c="dimmed">Eventos importantes del sistema</Text>
          </Stack>
        </Group>
        <Divider mb="lg" />
        <Stack gap="sm">
          {alerts.map((alert, idx) => (
            <Group key={idx} p="xs" style={{ 
              backgroundColor: alert.type === 'critical' ? 'rgba(192, 57, 43, 0.06)' : 
                            alert.type === 'warning' ? 'rgba(192, 132, 18, 0.06)' : 
                            alert.type === 'success' ? 'rgba(31, 92, 58, 0.06)' : 
                            'rgba(42, 106, 138, 0.06)',
              borderRadius: '8px',
              borderLeft: `4px solid ${alert.type === 'critical' ? '#C0392B' : 
                            alert.type === 'warning' ? '#C08412' : 
                            alert.type === 'success' ? '#1F5C3A' : '#2A6A8A'}`
            }}>
              {alert.type === 'critical' && <IconAlertCircle size={16} color="#C0392B" />}
              {alert.type === 'warning' && <IconAlertCircle size={16} color="#C08412" />}
              {alert.type === 'success' && <IconCheck size={16} color="#1F5C3A" />}
              {alert.type === 'info' && <IconClock size={16} color="#2A6A8A" />}
              <Stack gap={0} style={{ flex: 1 }}>
                <Text size="xs" fw={600}>{alert.title}</Text>
                <Text size="xs" c="dimmed">{alert.description}</Text>
              </Stack>
              <Badge size="xs" color="gray" variant="light">
                {alert.module}
              </Badge>
              <Text size="xs" c="dimmed">{new Date(alert.timestamp).toLocaleDateString()}</Text>
            </Group>
          ))}
        </Stack>
      </Card>
    </motion.div>
  );
};