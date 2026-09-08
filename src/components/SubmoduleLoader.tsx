import React from 'react';
import { Center, Loader, Stack, Text, Box } from '@mantine/core';

interface SubmoduleLoaderProps {
  message?: string;
  minHeight?: string | number;
}

export const SubmoduleLoader: React.FC<SubmoduleLoaderProps> = ({ 
  message = 'Cargando datos del módulo...', 
  minHeight = '380px' 
}) => {
  return (
    <Box
      style={{
        width: '100%',
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        padding: '32px',
      }}
    >
      <Center>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="lg" type="dots" />
          <Text size="sm" c="dimmed" fw={600} style={{ letterSpacing: '0.2px' }}>
            {message}
          </Text>
        </Stack>
      </Center>
    </Box>
  );
};
