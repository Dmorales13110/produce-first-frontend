import { Stack, Group, ThemeIcon, Text, Paper } from '@mantine/core';
import { IconBulb } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import classes from '../styles/welcome.module.css';

interface Tip {
  icon: any;
  text: string;
  color: string;
}

interface TipsSectionProps {
  tips: Tip[];
}

// Mapeo de color explícito para asegurar contraste en los Tips
const tipColorPicker = (color: string) => {
  switch (color) {
    case 'yellow': return { bg: 'rgba(241, 196, 15, 0.15)', text: '#D4AC0D' };
    case 'growerGreen': return { bg: 'rgba(31, 92, 58, 0.12)', text: '#1F5C3A' };
    case 'coolingBlue': return { bg: 'rgba(42, 106, 138, 0.12)', text: '#2A6A8A' };
    case 'grape': return { bg: 'rgba(142, 68, 173, 0.12)', text: '#8E44AD' };
    default: return { bg: 'rgba(52, 73, 94, 0.12)', text: '#34495E' };
  }
};

const TipItem = ({ icon: Icon, text, color }: Tip) => {
  const colors = tipColorPicker(color);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{ width: '100%' }}
    >
      <Paper withBorder p="sm" radius="md" className={classes.tipCard}>
        <Group gap="sm" wrap="nowrap">
          {/* Icono del Tip corregido */}
          <ThemeIcon 
            size={28} 
            radius="xl" 
            style={{ 
              backgroundColor: colors.bg, 
              color: colors.text 
            }}
          >
            <Icon size={16} stroke={2} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" style={{ flex: 1 }}>
            {text}
          </Text>
        </Group>
      </Paper>
    </motion.div>
  );
};

export const TipsSection = ({ tips }: TipsSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Stack gap="md">
        <Group>
          {/* Icono del título general de Tips */}
          <ThemeIcon 
            size="sm" 
            radius="xl" 
            style={{ backgroundColor: 'rgba(241, 196, 15, 0.15)', color: '#D4AC0D' }}
          >
            <IconBulb size={14} stroke={2} />
          </ThemeIcon>
          <Text fw={600} size="md" c="#3A3A34">
            Tips útiles
          </Text>
        </Group>
        <Stack gap="xs">
          {tips.map((tip, index) => (
            <TipItem key={index} {...tip} />
          ))}
        </Stack>
      </Stack>
    </motion.div>
  );
};