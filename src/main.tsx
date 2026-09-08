import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';

// IMPORTANTE: Estilos globales obligatorios de Mantine v7+
import '@mantine/core/styles.css';
import './index.css'; 

import App from './App.tsx';

// Opcional: Centralizar la paleta de colores de Produce First para todo el ERP
const theme = createTheme({
  primaryColor: 'green',
  defaultRadius: 'md',
  // Aquí puedes personalizar fuentes o variantes globales más adelante
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light" forceColorScheme='light'>
      <App />
    </MantineProvider>
  </StrictMode>,
);