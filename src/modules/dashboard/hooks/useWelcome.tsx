import { useState, useEffect } from 'react';

export function useWelcome() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getGreetingIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 6 || hour > 18) return 'moon';
    if (hour < 12) return 'sun';
    return 'cloud';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return {
    currentTime,
    getGreeting,
    getGreetingIcon,
    formatDate,
    formatTime,
  };
}