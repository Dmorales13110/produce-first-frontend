import { Group, Stack, Title, Text, ThemeIcon } from '@mantine/core';
import { IconSun, IconMoon, IconCloud, IconClock } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import classes from '../styles/welcome.module.css';

interface WelcomeHeaderProps {
  greeting: string;
  companyName: string;
  greetingIcon: string;
  currentTime: Date;
  formatTime: (date: Date) => string;
  formatDate: (date: Date) => string;
}

const iconMap = {
  sun: { icon: IconSun, bg: 'rgba(230, 126, 34, 0.12)', text: '#E67E22' },
  moon: { icon: IconMoon, bg: 'rgba(52, 73, 94, 0.12)', text: '#34495E' },
  cloud: { icon: IconCloud, bg: 'rgba(41, 128, 185, 0.12)', text: '#2980B9' },
};

export const WelcomeHeader = ({
  greeting,
  companyName,
  greetingIcon,
  currentTime,
  formatTime,
  formatDate,
}: WelcomeHeaderProps) => {
  const config = iconMap[greetingIcon as keyof typeof iconMap] || iconMap.sun;
  const GreetingIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Stack gap={4}>
          <Group gap="sm" wrap="wrap">
            <ThemeIcon 
              size={40} 
              radius="xl" 
              style={{ backgroundColor: config.bg, color: config.text }}
            >
              <GreetingIcon size={22} stroke={2} />
            </ThemeIcon>
            <Title order={1} className={classes.welcomeTitle}>
              {greeting}, {companyName || 'Usuario'}
            </Title>
          </Group>
          <Group gap="xs" ml={4}>
            <IconClock size={16} className={classes.iconClock} />
            <Text size="sm" c="dimmed" fw={500}>
              {formatTime(currentTime)} · {formatDate(currentTime)}
            </Text>
          </Group>
        </Stack>
      </Group>
    </motion.div>
  );
};