import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const NavigationProgressBar: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Al cambiar de ruta, iniciar la barra de progreso
    setVisible(true);
    setProgress(25);

    const stepTimer = setTimeout(() => {
      setProgress(75);
    }, 120);

    const finishTimer = setTimeout(() => {
      setProgress(100);
    }, 380);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 600);

    return () => {
      clearTimeout(stepTimer);
      clearTimeout(finishTimer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        zIndex: 99999,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #1F5C3A 0%, #2A6A8A 50%, #40C057 100%)',
          boxShadow: '0 0 10px rgba(31, 92, 58, 0.7)',
          transition: progress === 100 ? 'width 0.15s ease-out, opacity 0.25s ease' : 'width 0.25s ease-in-out',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
};
