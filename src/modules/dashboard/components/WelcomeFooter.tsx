import { Group, Text, Badge } from '@mantine/core';
import { motion } from 'framer-motion';

interface WelcomeFooterProps {
  companyName: string;
  onHelpClick?: () => void;
  onSupportClick?: () => void;
}

export const WelcomeFooter = ({
}: WelcomeFooterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Group justify="space-between" pt="md" wrap="wrap">
        <Group gap="xs">
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} Produce First. Todos los derechos reservados.
          </Text>
          <Badge size="xs" variant="dot" color="blue" />
          <Text size="xs" c="dimmed" component="span">
            v1.0.0
          </Text>
        </Group>
      </Group>
    </motion.div>
  );
};