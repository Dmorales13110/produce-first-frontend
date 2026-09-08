// src/pages/styles/auth.styles.ts

// Usamos React.CSSProperties en lugar de CSSObject
export const authContainerStyles: React.CSSProperties = {
  minHeight: '100vh',
  background: '#F4F1EA',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
};

export const authCardStyles: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #E8E5DC',
  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
  padding: '40px',
  maxWidth: '480px',
  width: '100%',
  position: 'relative',
};

// Para los estilos de inputs usamos el tipo de Mantine
export const authInputStyles = {
  input: {
    border: '1px solid #E8E5DC',
    borderRadius: '8px',
    fontSize: '14px',
    height: '46px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#FFFFFF',
    color: '#3A3A34',
    '&:focus': {
      borderColor: '#1F5C3A',
      boxShadow: '0 0 0 3px rgba(31, 92, 58, 0.1)',
    },
    '&:hover': {
      borderColor: '#1F5C3A',
    },
    '&::placeholder': {
      color: '#9A968A',
    },
  },
  label: {
    fontWeight: 600,
    marginBottom: '6px',
    color: '#3A3A34',
    fontSize: '13px',
  },
  error: {
    color: '#C0392B',
    fontSize: '12px',
    marginTop: '4px',
  },
};

export const passwordInputStyles = {
  input: {
    border: '1px solid #E8E5DC',
    borderRadius: '8px',
    fontSize: '14px',
    height: '46px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#FFFFFF',
    color: '#3A3A34',
    '&:focus': {
      borderColor: '#1F5C3A',
      boxShadow: '0 0 0 3px rgba(31, 92, 58, 0.1)',
    },
    '&:hover': {
      borderColor: '#1F5C3A',
    },
    '&::placeholder': {
      color: '#9A968A',
    },
  },
  label: {
    fontWeight: 600,
    marginBottom: '6px',
    color: '#3A3A34',
    fontSize: '13px',
  },
  error: {
    color: '#C0392B',
    fontSize: '12px',
    marginTop: '4px',
  },
  innerInput: {
    paddingLeft: '40px',
    height: '44px',
  },
};

// Para botones usamos React.CSSProperties
export const gradientButtonStyles: React.CSSProperties & { [key: string]: React.CSSProperties | string | number | undefined } = {
  background: 'linear-gradient(135deg, #1F5C3A 0%, #2A6A8A 100%)',
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '14px',
  height: '48px',
  color: '#FFFFFF',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  border: 'none',
  cursor: 'pointer',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(31, 92, 58, 0.3)',
  },
  ':active': {
    transform: 'translateY(0)',
  },
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

export const authBannerStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1F5C3A 0%, #2A6A8A 100%)',
  borderRadius: '16px',
  padding: '32px',
  color: '#FFFFFF',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: '32px',
};

export const authSidePanelStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, #FAF9F5 0%, #F4F1EA 100%)',
  borderRadius: '16px',
  border: '1px solid #E8E5DC',
  padding: '40px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
};