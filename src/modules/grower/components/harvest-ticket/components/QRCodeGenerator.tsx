// src/components/QRCodeGenerator.tsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Paper, Text, Stack, Group, Badge, Box } from '@mantine/core';
import { IconFileInvoice, IconDownload, IconCopy } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface QRCodeGeneratorProps {
  folio: string;
  producto: string;
  cuadrilla: string;
  totalCajas: number;
  fecha: string;
  status: string;
  size?: number;
  onDownload?: () => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  folio,
  producto,
  cuadrilla,
  totalCajas,
  fecha,
  status,
  size = 180,
  onDownload,
}) => {
  // Datos para el QR
  const qrData = JSON.stringify({
    folio,
    producto,
    cuadrilla,
    totalCajas,
    fecha,
    status,
    timestamp: new Date().toISOString(),
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      emitida: 'gray',
      escaneada: 'blue',
      en_transito: 'orange',
      entregada: 'green',
    };
    return colors[status] || 'gray';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      emitida: 'Emitida',
      escaneada: 'Escaneada',
      en_transito: 'En tránsito',
      entregada: 'Entregada',
    };
    return labels[status] || status;
  };

  // Función para descargar QR como imagen
  const handleDownload = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `QR-${folio}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper 
        p="lg" 
        radius="lg" 
        withBorder 
        style={{ 
          borderColor: '#E8E5DC', 
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
      >
        <Stack align="center" gap="xs">
          <Group gap="xs">
            <IconFileInvoice size={18} color="#1F5C3A" />
            <Text size="xs" fw={700} c="#1F5C3A" style={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Boleta de Cosecha
            </Text>
          </Group>
          
          {/* QR Code */}
          <Box 
            p="md" 
            style={{ 
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '2px solid #E8E5DC'
            }}
          >
            <QRCodeSVG
              id="qr-code-canvas"
              value={qrData}
              size={size}
              bgColor="#FFFFFF"
              fgColor="#1F5C3A"
              level="H"
              includeMargin={true}
            />
          </Box>
          
          {/* Folio */}
          <Text size="md" fw={800} c="#1F5C3A" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            {folio}
          </Text>
          
          {/* Badges */}
          <Group gap="xs" justify="center">
            <Badge size="sm" variant="light" color="teal" radius="sm">
              {producto}
            </Badge>
            <Badge 
              size="sm" 
              variant="light" 
              color={getStatusColor(status)}
              radius="sm"
            >
              {getStatusLabel(status)}
            </Badge>
          </Group>
          
          {/* Detalles */}
          <Stack gap={2} align="center">
            <Text size="xs" c="dimmed">
              {totalCajas} cajas · {cuadrilla}
            </Text>
            <Text size="xs" c="dimmed">
              {fecha}
            </Text>
          </Stack>

          {/* Información del QR */}
          <Box 
            p="xs" 
            style={{ 
              backgroundColor: '#FAF9F5', 
              borderRadius: '6px',
              width: '100%',
              border: '1px solid #EFECE3'
            }}
          >
            <Text size="9px" c="dimmed" style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {qrData}
            </Text>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
};