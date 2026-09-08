import React from 'react';
import { Box, Title, Text, Button, Stack, Container } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconError404 } from '@tabler/icons-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack align="center" gap="xl" ta="center">
          {/* Icono temático o ilustrativo */}
          <Box c="produceGreen.6" style={{ opacity: 0.8 }}>
            <IconError404 size={120} stroke={1.2} />
          </Box>

          <Box>
            <Title order={1} fw={800} c="gray.8" style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>
              Módulo no encontrado
            </Title>
            <Text c="dimmed" size="sm" mt="sm" style={{ maxWidth: '420px' }}>
              La sección a la que intentas acceder no existe o se encuentra actualmente en proceso de migración al nuevo stack técnico.
            </Text>
          </Box>

          <Button
            color="produceGreen"
            size="md"
            radius="md"
            onClick={() => navigate('/dashboard')}
            styles={{
              root: {
                fontWeight: 600,
                paddingLeft: '32px',
                paddingRight: '32px',
              },
            }}
          >
            Volver al Panel Principal
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};