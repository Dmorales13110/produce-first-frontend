import { Stack, Group, ThemeIcon, Text, SimpleGrid, Paper } from '@mantine/core';
import { IconBuildingWarehouse, IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import classes from '../styles/welcome.module.css';

interface Module {
    icon: any;
    label: string;
    path: string;
    color: string;
}

interface ModuleAccessProps {
    modules: Module[];
}

const colorPicker = (color: string) => {
    switch (color) {
        case 'growerGreen': return { bg: 'rgba(31, 92, 58, 0.12)', text: '#1F5C3A' };
        case 'coolingBlue': return { bg: 'rgba(42, 106, 138, 0.12)', text: '#2A6A8A' };
        case 'firstRust': return { bg: 'rgba(138, 90, 42, 0.12)', text: '#8A5A2A' };
        case 'grape': return { bg: 'rgba(142, 68, 173, 0.12)', text: '#8E44AD' };
        case 'teal': return { bg: 'rgba(20, 143, 119, 0.12)', text: '#148F77' };
        default: return { bg: 'rgba(31, 117, 255, 0.12)', text: '#1F75FF' };
    }
};

const ModuleItem = ({ icon: Icon, label, path, color }: Module) => {
    const navigate = useNavigate();
    const colors = colorPicker(color);

    return (
        <motion.div
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <Paper
                withBorder
                p="sm"
                radius="md"
                className={classes.moduleAccess}
                onClick={() => navigate(path)}
                style={{ cursor: 'pointer' }}
            >
                <Group>
                    <ThemeIcon
                        size={36}
                        radius="md"
                        style={{
                            backgroundColor: colors.bg,
                            color: colors.text
                        }}
                    >
                        <Icon size={18} stroke={2} />
                    </ThemeIcon>
                    <Text size="sm" fw={600} c="#3A3A34" style={{ flex: 1 }}>
                        {label}
                    </Text>
                    <IconArrowRight size={16} color="var(--mantine-color-gray-4)" />
                </Group>
            </Paper>
        </motion.div>
    );
};

export const ModuleAccess = ({ modules }: ModuleAccessProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            <Stack gap="md">
                <Group>
                    <ThemeIcon
                        size="sm"
                        radius="xl"
                        style={{ backgroundColor: 'rgba(42, 106, 138, 0.12)', color: '#2A6A8A' }}
                    >
                        <IconBuildingWarehouse size={14} />
                    </ThemeIcon>
                    <Text fw={600} size="md" c="#3A3A34">
                        Módulos del Sistema
                    </Text>
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
                    {modules.map((module, index) => (
                        <ModuleItem key={index} {...module} />
                    ))}
                </SimpleGrid>
            </Stack>
        </motion.div>
    );
};