import { Stack, Group, ThemeIcon, Text, SimpleGrid, Card, Button } from '@mantine/core';
import { IconRocket, IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import classes from '../styles/welcome.module.css';

interface QuickAction {
    icon: any;
    label: string;
    description: string;
    color: string; // Puede ser 'growerGreen', 'firstRust', 'coolingBlue', 'grape'
    onClick: () => void;
}

interface QuickActionsProps {
    actions: QuickAction[];
}

// Mapeo seguro de colores hexadecimales para asegurar contraste óptimo si falla la propiedad string
const colorPicker = (color: string) => {
    switch (color) {
        case 'growerGreen': return { bg: 'rgba(31, 92, 58, 0.12)', text: '#1F5C3A' };
        case 'coolingBlue': return { bg: 'rgba(42, 106, 138, 0.12)', text: '#2A6A8A' };
        case 'firstRust': return { bg: 'rgba(138, 90, 42, 0.12)', text: '#8A5A2A' };
        case 'grape': return { bg: 'rgba(142, 68, 173, 0.12)', text: '#8E44AD' };
        default: return { bg: 'rgba(31, 117, 255, 0.12)', text: '#1F75FF' };
    }
};

const QuickActionItem = ({
    icon: Icon,
    label,
    description,
    color,
    onClick,
}: QuickAction) => {
    const colors = colorPicker(color);

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{ height: '100%' }}
        >
            <Card
                withBorder
                p="lg"
                radius="md"
                className={classes.quickAction}
                onClick={onClick}
                style={{ cursor: 'pointer', height: '100%' }}
            >
                <Stack align="center" gap="sm">
                    {/* ThemeIcon con contraste explícito */}
                    <ThemeIcon
                        size={56}
                        radius="xl"
                        style={{
                            backgroundColor: colors.bg,
                            color: colors.text
                        }}
                    >
                        <Icon size={28} stroke={2} />
                    </ThemeIcon>

                    <Text fw={600} size="sm" ta="center" c="#3A3A34">
                        {label}
                    </Text>
                    <Text size="xs" c="dimmed" ta="center" lineClamp={2}>
                        {description}
                    </Text>
                    <Button
                        variant="subtle"
                        color={color}
                        size="xs"
                        rightSection={<IconArrowRight size={14} />}
                        mt="auto"
                    >
                        Comenzar
                    </Button>
                </Stack>
            </Card>
        </motion.div>
    );
};

export const QuickActions = ({ actions }: QuickActionsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
        >
            <Stack gap="md">
                <Group>
                    <ThemeIcon
                        size="sm"
                        radius="xl"
                        style={{ backgroundColor: 'rgba(31, 92, 58, 0.12)', color: '#1F5C3A' }}
                    >
                        <IconRocket size={14} />
                    </ThemeIcon>
                    <Text fw={600} size="md" c="#3A3A34">
                        Acciones Rápidas
                    </Text>
                </Group>
                <SimpleGrid cols={{ base: 2, sm: 2, md: 4 }} spacing="md">
                    {actions.map((action, index) => (
                        <QuickActionItem key={index} {...action} />
                    ))}
                </SimpleGrid>
            </Stack>
        </motion.div>
    );
};