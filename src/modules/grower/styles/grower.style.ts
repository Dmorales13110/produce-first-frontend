import type { CSSProperties } from 'react';

// Estilos base usando la paleta tierra/agrícola del ERP
export const growerStyles = {
  dashboardContainer: {
    minHeight: '100vh',
    backgroundColor: '#F3F6F1',
  } as CSSProperties,

  cardBorder: {
    borderColor: '#D8E4D2',
  } as CSSProperties,

  tableHeader: {
    backgroundColor: '#4F6F52',
  } as CSSProperties,

  dividerLine: {
    borderBottom: '1px solid #EDEAE0',
    paddingBottom: 8,
  } as CSSProperties,
};

// Variantes de animación reutilizables para las vistas del módulo
export const growerAnimationVariants = {
  container: {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 } 
    }
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }
};