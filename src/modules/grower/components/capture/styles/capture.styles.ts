// src/modules/grower/capture/styles/capture.styles.ts
import type { CSSProperties } from 'react';

type InteractiveStyle = CSSProperties & {
  ':hover'?: CSSProperties;
  ':disabled'?: CSSProperties;
};

export const captureContainerStyles: CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '16px',
};

export const cardStyles: CSSProperties = {
  borderColor: '#E8E5DC',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
};

export const formSectionStyles: CSSProperties = {
  backgroundColor: '#FAF9F5',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #E8E5DC',
};

export const inputStyles = {
  label: {
    fontWeight: 600,
    fontSize: '12px',
    color: '#3A3A34',
  },
  input: {
    border: '1px solid #E8E5DC',
    borderRadius: '8px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:focus': {
      borderColor: '#1F5C3A',
      boxShadow: '0 0 0 3px rgba(31, 92, 58, 0.1)',
    },
  },
};

export const gradientButtonStyles: InteractiveStyle = {
  background: 'linear-gradient(135deg, #1F5C3A 0%, #2A6A8A 100%)',
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '14px',
  height: '48px',
  color: '#FFFFFF',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(31, 92, 58, 0.3)',
  },
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};