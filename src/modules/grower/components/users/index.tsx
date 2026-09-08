import React, { useState } from 'react';
import {
    Box,
    Paper,
    Text,
    Group,
    Stack,
    Badge,
    Table,
    SimpleGrid,
    Card,
    Button,
    TextInput,
    Select,
    Grid,
    ThemeIcon,
    Divider,
    RingProgress,
    Tooltip,
    ActionIcon,
    SegmentedControl,
    Avatar,
    Switch,
    Alert,
    Loader,
    Center,
    ScrollArea,
    Menu,
    Modal,
    PasswordInput,
    Textarea,
} from '@mantine/core';
import {
    IconUsers,
    IconLock,
    IconCheck,
    IconDeviceMobile,
    IconUserPlus,
    IconUser,
    IconShield,
    IconBuilding,
    IconClock,
    IconCalendar,
    IconRefresh,
    IconDownload,
    IconEye,
    IconEdit,
    IconTrash,
    IconSearch,
    IconFilter,
    IconKey,
    IconShieldLock,
    IconUserCheck,
    IconUserX,
    IconDotsVertical,
    IconFileExport,
    IconPrinter,
    IconPlus,
    IconX,
    IconAlertCircle,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useUsers } from './hooks/useUsers';
import { notifications } from '@mantine/notifications';

export function GrowerUsersPermissions() {
    const {
        users,
        roles,
        logs,
        summary,
        isLoading,
        error,
        filters,
        setFilters,
        refresh,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        createRole,
        updateRole,
        deleteRole,
    } = useUsers();

    const [viewMode, setViewMode] = useState('activos');
    const [filterPerfil, setFilterPerfil] = useState('Todos');
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editing, setEditing] = useState(false);

    const [userForm, setUserForm] = useState({
        full_name: '',
        email: '',
        phone: '',
        role_id: '',
        empresa_id: '',
        pin_code: '',
        device_type: 'computadora',
        is_active: true,
        password: '',
    });

    const [roleForm, setRoleForm] = useState({
        name: '',
        description: '',
        permissions: { all: false, modules: [] },
        is_active: true,
    });

    // ============================================================
    // FUNCIONES DE UTILIDAD PARA MANEJAR DATOS ROBUSTAS
    // ============================================================

    const getUserName = (user: any): string => {
        if (!user) return 'Usuario sin nombre';

        // 1. Priorizar full_name
        if (user.full_name && user.full_name.trim() !== '' && user.full_name !== 'Usuario sin nombre') {
            return user.full_name.trim();
        }

        // 2. Luego name
        if (user.name && user.name.trim() !== '' && user.name !== 'Usuario sin nombre') {
            return user.name.trim();
        }

        // 3. Intentar extraer del email
        if (user.email) {
            const emailName = user.email.split('@')[0];
            if (emailName && emailName.trim() !== '') {
                return emailName.replace(/[._-]/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase());
            }
        }

        // 4. Fallback
        return 'Usuario sin nombre';
    };

    const getUserRole = (user: any): string => {
        if (!user) return 'Sin perfil';
        const roleValue = user.role || user.role_id || user.perfil || user.rol;
        if (!roleValue) return 'Sin perfil';
        if (typeof roleValue === 'object' && roleValue.name) {
            return roleValue.name;
        }
        const role = roles.find(r => r.id === roleValue || r.name === roleValue);
        return role?.name || roleValue || 'Sin perfil';
    };

    const getUserStatus = (user: any): boolean => {
        if (!user) return false;
        if (user.status === 'active') return true;
        if (user.is_active === true) return true;
        if (user.status === 'inactive') return false;
        if (user.is_active === false) return false;
        return true;
    };

    const getUserEmail = (user: any): string => {
        if (!user) return '';
        return user.email || user.correo || '';
    };

    const getUserGrower = (user: any): string => {
        if (!user) return 'Grupo';
        const grower = user.grower || user.empresa || user.rancho;
        if (grower) {
            return grower.commercial_name || grower.legal_name || grower.name || 'Grupo';
        }
        return 'Grupo';
    };

    const getUserDevice = (user: any): string => {
        if (!user) return 'computadora';
        return user.device_type || user.dispositivo || 'computadora';
    };

    const getUserLastLogin = (user: any): string => {
        if (!user) return 'Nunca';
        const login = user.last_login || user.ultimo_acceso;
        if (login) {
            try {
                return new Date(login).toLocaleString();
            } catch (e) {
                return login;
            }
        }
        return 'Nunca';
    };

    // ============================================================
    // HANDLERS
    // ============================================================

    const handleRefresh = async () => {
        await refresh();
        notifications.show({
            title: 'Datos actualizados',
            message: 'Usuarios y permisos actualizados',
            color: 'green',
            icon: <IconCheck size={16} />,
            autoClose: 2000,
        });
    };

    const handleExport = () => {
        notifications.show({
            title: 'Exportando reporte',
            message: 'El reporte se está generando...',
            color: 'blue',
            icon: <IconDownload size={16} />,
            autoClose: 2000,
        });
    };

    const handleOpenUserModal = (user?: any) => {
        if (user) {
            setSelectedUser(user);
            setEditing(true);
            setUserForm({
                full_name: getUserName(user),
                email: getUserEmail(user),
                phone: user.phone || '',
                role_id: user.role || user.role_id || '',
                empresa_id: user.grower_id || user.empresa_id || '',
                pin_code: user.pin_code || '',
                device_type: user.device_type || 'computadora',
                is_active: getUserStatus(user),
                password: '',
            });
        } else {
            setSelectedUser(null);
            setEditing(false);
            setUserForm({
                full_name: '',
                email: '',
                phone: '',
                role_id: roles.length > 0 ? roles[0].id : '',
                empresa_id: '',
                pin_code: '',
                device_type: 'computadora',
                is_active: true,
                password: '',
            });
        }
        setUserModalOpen(true);
    };

    const handleOpenRoleModal = (role?: any) => {
        if (role) {
            setSelectedRole(role);
            setRoleForm({
                name: role.name || '',
                description: role.description || '',
                permissions: role.permissions || { all: false, modules: [] },
                is_active: role.is_active !== undefined ? role.is_active : true,
            });
        } else {
            setSelectedRole(null);
            setRoleForm({
                name: '',
                description: '',
                permissions: { all: false, modules: [] },
                is_active: true,
            });
        }
        setRoleModalOpen(true);
    };

    const handleDeleteUser = (user: any) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleCreateUser = async () => {
        // Validar que la contraseña esté presente para nuevos usuarios
        if (!editing && !userForm.password) {
            notifications.show({
                title: '⚠️ Contraseña requerida',
                message: 'La contraseña es obligatoria para crear un nuevo usuario',
                color: 'yellow',
                icon: <IconAlertCircle size={16} />,
                autoClose: 3000,
            });
            return;
        }

        // Validar longitud de contraseña
        if (!editing && userForm.password.length < 6) {
            notifications.show({
                title: '⚠️ Contraseña muy corta',
                message: 'La contraseña debe tener al menos 6 caracteres',
                color: 'yellow',
                icon: <IconAlertCircle size={16} />,
                autoClose: 3000,
            });
            return;
        }

        // Validar nombre
        if (!userForm.full_name || userForm.full_name.trim() === '') {
            notifications.show({
                title: '⚠️ Nombre requerido',
                message: 'El nombre completo es obligatorio',
                color: 'yellow',
                icon: <IconAlertCircle size={16} />,
                autoClose: 3000,
            });
            return;
        }

        // Validar email
        if (!userForm.email || !userForm.email.includes('@')) {
            notifications.show({
                title: '⚠️ Email inválido',
                message: 'Ingresa un correo electrónico válido',
                color: 'yellow',
                icon: <IconAlertCircle size={16} />,
                autoClose: 3000,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const selectedRole = roles.find(r => r.id === userForm.role_id);
            const roleName = selectedRole?.name || userForm.role_id;
            const userData: any = {
                name: userForm.full_name.trim(),
                full_name: userForm.full_name.trim(),
                email: userForm.email.trim(),
                phone: userForm.phone || null,
                role: roleName, // <-- Enviar el nombre del rol, no el ID
                grower_id: userForm.empresa_id || null,
                pin_code: userForm.pin_code || null, // <-- Enviar null si está vacío
                device_type: userForm.device_type || 'computadora',
                is_active: userForm.is_active,
            };

            // Solo incluir password si es un nuevo usuario
            if (!editing) {
                userData.password = userForm.password;
            }

            if (editing && selectedUser) {
                await updateUser(selectedUser.id, userData);
                notifications.show({
                    title: '✅ Usuario actualizado',
                    message: `${userForm.full_name} actualizado exitosamente`,
                    color: 'green',
                    icon: <IconCheck size={16} />,
                    autoClose: 3000,
                });
            } else {
                await createUser(userData);
                notifications.show({
                    title: '✅ Usuario creado',
                    message: `${userForm.full_name} creado exitosamente`,
                    color: 'green',
                    icon: <IconCheck size={16} />,
                    autoClose: 3000,
                });
            }
            setUserModalOpen(false);
            // Limpiar contraseña
            setUserForm(prev => ({ ...prev, password: '' }));
        } catch (err: any) {
            notifications.show({
                title: '❌ Error',
                message: err.message || 'Error al procesar usuario',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateRole = async () => {
        setIsSubmitting(true);
        try {
            if (selectedRole) {
                await updateRole(selectedRole.id, roleForm);
                notifications.show({
                    title: '✅ Rol actualizado',
                    message: `${roleForm.name} actualizado exitosamente`,
                    color: 'green',
                    icon: <IconCheck size={16} />,
                    autoClose: 3000,
                });
            } else {
                await createRole(roleForm);
                notifications.show({
                    title: '✅ Rol creado',
                    message: `${roleForm.name} creado exitosamente`,
                    color: 'green',
                    icon: <IconCheck size={16} />,
                    autoClose: 3000,
                });
            }
            setRoleModalOpen(false);
        } catch (err: any) {
            notifications.show({
                title: '❌ Error',
                message: err.message || 'Error al procesar rol',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        try {
            await deleteUser(selectedUser.id);
            notifications.show({
                title: '✅ Usuario eliminado',
                message: `${getUserName(selectedUser)} eliminado exitosamente`,
                color: 'green',
                icon: <IconCheck size={16} />,
                autoClose: 3000,
            });
            setDeleteModalOpen(false);
            setSelectedUser(null);
        } catch (err: any) {
            notifications.show({
                title: '❌ Error',
                message: err.message || 'Error al eliminar usuario',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (user: any) => {
        try {
            const currentStatus = getUserStatus(user);
            await toggleUserStatus(user.id, !currentStatus);
            notifications.show({
                title: currentStatus ? 'Usuario desactivado' : 'Usuario activado',
                message: `${getUserName(user)} ${currentStatus ? 'desactivado' : 'activado'} exitosamente`,
                color: currentStatus ? 'yellow' : 'green',
                icon: <IconCheck size={16} />,
                autoClose: 3000,
            });
        } catch (err: any) {
            notifications.show({
                title: '❌ Error',
                message: err.message || 'Error al cambiar estado',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        }
    };

    // ============================================================
    // FILTROS
    // ============================================================

    const filteredUsers = users.filter(u => {
        if (viewMode === 'activos') {
            return getUserStatus(u);
        }
        if (viewMode === 'inactivos') {
            return !getUserStatus(u);
        }
        if (filterPerfil !== 'Todos' && getUserRole(u) !== filterPerfil) return false;
        return true;
    });

    // ============================================================
    // CÁLCULOS
    // ============================================================

    const totalUsuarios = users.length;
    const activos = users.filter(u => getUserStatus(u)).length;
    const inactivos = users.filter(u => !getUserStatus(u)).length;
    const totalRoles = roles.length;

    const getStatusColor = (estado: boolean) => {
        return estado ? 'green' : 'gray';
    };

    const getDeviceIcon = (device: string) => {
        return <IconDeviceMobile size={14} />;
    };

    const getRoleColor = (roleName: string) => {
        if (roleName === 'Administrador') return 'green';
        if (roleName === 'Administración') return 'blue';
        if (roleName === 'Encargado') return 'yellow';
        if (roleName === 'Operador') return 'gray';
        if (roleName === 'Báscula') return 'teal';
        return 'gray';
    };

    // ============================================================
    // RENDER
    // ============================================================

    if (isLoading) {
        return (
            <Center style={{ height: '60vh' }}>
                <Stack align="center" gap="md">
                    <Loader color="growerGreen" size="xl" type="dots" />
                    <Text size="sm" c="dimmed">Cargando usuarios...</Text>
                </Stack>
            </Center>
        );
    }

    if (error) {
        return (
            <Box p="md">
                <Alert
                    color="red"
                    variant="light"
                    title="Error al cargar datos"
                    icon={<IconAlertCircle size={16} />}
                >
                    {error}
                    <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={refresh}
                        mt="sm"
                        leftSection={<IconRefresh size={14} />}
                    >
                        Reintentar
                    </Button>
                </Alert>
            </Box>
        );
    }

    return (
        <Box style={{ backgroundColor: '#F4F1EA', minHeight: '100vh', padding: '16px' }}>

            {/* ===== ENCABEZADO ===== */}
            <Paper
                p="xl"
                radius="lg"
                mb="xl"
                style={{
                    background: 'linear-gradient(135deg, #1F5C3A 0%, #2A6A8A 100%)',
                    color: '#FFFFFF',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 1 }}>
                    <Stack gap={4}>
                        <Group gap="xs">
                            <Badge size="xs" variant="white" color="teal" radius="sm">
                                USR-1 · Usuarios
                            </Badge>
                            <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                                {new Date().getFullYear()}
                            </Badge>
                        </Group>
                        <Group gap="sm" align="center">
                            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                                Usuarios y Permisos
                            </Text>
                            <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
                                {totalUsuarios} Usuarios
                            </Badge>
                        </Group>
                        <Group gap="xl" mt={2}>
                            <Group gap={4}>
                                <IconCalendar size={14} style={{ opacity: 0.7 }} />
                                <Text size="xs" style={{ opacity: 0.8 }}>Último acceso: {summary?.lastLogin || 'Nunca'}</Text>
                            </Group>
                            <Group gap={4}>
                                <IconUsers size={14} style={{ opacity: 0.7 }} />
                                <Text size="xs" style={{ opacity: 0.8 }}>{totalRoles} Perfiles</Text>
                            </Group>
                            <Group gap={4}>
                                <IconDeviceMobile size={14} style={{ opacity: 0.7 }} />
                                <Text size="xs" style={{ opacity: 0.8 }}>Móvil · Tablet · PC</Text>
                            </Group>
                        </Group>
                    </Stack>

                    <Group gap="xl">
                        <Group gap="sm">
                            <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                                <IconUsers size={20} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text size="lg" fw={700}>{activos}</Text>
                                <Text size="xs" style={{ opacity: 0.7 }}>Activos</Text>
                            </Stack>
                        </Group>
                        <RingProgress
                            size={90}
                            thickness={10}
                            sections={[{ value: totalUsuarios > 0 ? (activos / totalUsuarios) * 100 : 0, color: '#FFFFFF' }]}
                            label={
                                <Stack align="center" gap={0}>
                                    <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>
                                        {totalUsuarios > 0 ? Math.round((activos / totalUsuarios) * 100) : 0}%
                                    </Text>
                                    <Text size="8px" style={{ opacity: 0.7 }}>activos</Text>
                                </Stack>
                            }
                        />
                    </Group>
                </Group>
            </Paper>

            {/* ===== KPIs ===== */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                >
                    <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Usuarios Activos</Text>
                                <Text size="28px" fw={800} c="#1F5C3A">{activos}</Text>
                                <Group gap={4}>
                                    <IconUserCheck size={14} color="#1F5C3A" />
                                    <Text size="xs" c="#1F5C3A" fw={600}>{inactivos} inactivos</Text>
                                </Group>
                                <Badge size="xs" color="green" variant="light" radius="sm">Todos activos</Badge>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                <IconUsers size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Perfiles</Text>
                                <Text size="28px" fw={800} c="#2A6A8A">{totalRoles}</Text>
                                <Group gap={4}>
                                    <IconShield size={14} color="#2A6A8A" />
                                    <Text size="xs" c="#2A6A8A" fw={600}>Roles definidos</Text>
                                </Group>
                                <Badge size="xs" color="blue" variant="light" radius="sm">Administración</Badge>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                                <IconShieldLock size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                >
                    <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Auditoría</Text>
                                <Text size="20px" fw={800} c="#C08412">Siempre activa</Text>
                                <Group gap={4}>
                                    <IconLock size={14} color="#C08412" />
                                    <Text size="xs" c="#C08412" fw={600}>Cada acción queda registrada</Text>
                                </Group>
                                <Badge size="xs" color="yellow" variant="light" radius="sm">Trazabilidad</Badge>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                                <IconLock size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Accesos por PIN</Text>
                                <Text size="20px" fw={800} c="#1F5C3A">Móvil · Tablet</Text>
                                <Group gap={4}>
                                    <IconKey size={14} color="#1F5C3A" />
                                    <Text size="xs" c="#1F5C3A" fw={600}>Sin contraseñas complicadas</Text>
                                </Group>
                                <Badge size="xs" color="teal" variant="light" radius="sm">Seguro</Badge>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                <IconKey size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>
            </SimpleGrid>

            {/* ===== FILTROS ===== */}
            <Group justify="space-between" mb="md">
                <Group gap="sm">
                    <SegmentedControl
                        size="sm"
                        value={viewMode}
                        onChange={setViewMode}
                        data={[
                            { value: 'activos', label: 'Activos' },
                            { value: 'todos', label: 'Todos' },
                            { value: 'inactivos', label: 'Inactivos' },
                            { value: 'perfiles', label: 'Perfiles' },
                        ]}
                        styles={{
                            root: { backgroundColor: '#F5F3EE' },
                            indicator: { backgroundColor: '#1F5C3A' },
                            label: { fontWeight: 600 }
                        }}
                    />
                    {viewMode !== 'perfiles' && (
                        <Select
                            size="xs"
                            value={filterPerfil}
                            onChange={(value) => setFilterPerfil(value || 'Todos')}
                            data={['Todos', ...roles.map(r => r.name)]}
                            placeholder="Perfil"
                            style={{ width: 140 }}
                        />
                    )}
                    <Badge variant="light" color="teal" radius="sm">
                        <Group gap={4}>
                            <IconClock size={12} />
                            Actualizado: Hoy
                        </Group>
                    </Badge>
                </Group>
                <Group gap="xs">
                    <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                            <ActionIcon variant="light" color="teal" size="sm" radius="md">
                                <IconDotsVertical size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Acciones</Menu.Label>
                            <Menu.Item leftSection={<IconRefresh size={14} />} onClick={handleRefresh}>
                                Actualizar datos
                            </Menu.Item>
                            <Menu.Item leftSection={<IconFileExport size={14} />} onClick={handleExport}>
                                Exportar Excel
                            </Menu.Item>
                            <Menu.Item leftSection={<IconPrinter size={14} />} onClick={() => window.print()}>
                                Imprimir reporte
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item leftSection={<IconUserPlus size={14} />} onClick={() => handleOpenUserModal()}>
                                Nuevo Usuario
                            </Menu.Item>
                            <Menu.Item leftSection={<IconShield size={14} />} onClick={() => handleOpenRoleModal()}>
                                Nuevo Perfil
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    <ActionIcon variant="light" color="teal" size="sm" radius="md" onClick={handleRefresh}>
                        <IconRefresh size={16} />
                    </ActionIcon>
                    <ActionIcon variant="light" color="teal" size="sm" radius="md" onClick={handleExport}>
                        <IconDownload size={16} />
                    </ActionIcon>
                </Group>
            </Group>

            {/* ===== TABLA DE USUARIOS ===== */}
            {viewMode !== 'perfiles' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ marginBottom: '24px' }}
                >
                    <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" mb="lg">
                            <Group gap="sm">
                                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                    <IconUsers size={18} />
                                </ThemeIcon>
                                <Stack gap={0}>
                                    <Text size="sm" fw={700} c="#3A3A34">Usuarios</Text>
                                    <Text size="xs" c="dimmed">
                                        {filteredUsers.length} usuarios {filterPerfil !== 'Todos' ? `· ${filterPerfil}` : ''}
                                    </Text>
                                </Stack>
                            </Group>
                            <Button
                                size="xs"
                                variant="light"
                                color="teal"
                                leftSection={<IconUserPlus size={14} />}
                                onClick={() => handleOpenUserModal()}
                            >
                                Nuevo Usuario
                            </Button>
                        </Group>

                        <Divider mb="lg" />

                        <ScrollArea style={{ width: '100%' }}>
                            <Table
                                verticalSpacing="md"
                                horizontalSpacing="md"
                                highlightOnHover
                                style={{
                                    tableLayout: 'fixed',
                                    width: '100%',
                                    minWidth: '900px'
                                }}
                            >
                                <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                                    <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                                        <Table.Th style={{ width: '18%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Usuario</Table.Th>
                                        <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Perfil</Table.Th>
                                        <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Empresa</Table.Th>
                                        <Table.Th style={{ width: '11%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Dispositivo</Table.Th>
                                        <Table.Th style={{ width: '15%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Últ. Acceso</Table.Th>
                                        <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Estado</Table.Th>
                                        <Table.Th style={{ width: '20%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Acciones</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((row, idx) => {
                                            const userName = getUserName(row);
                                            const userRole = getUserRole(row);
                                            const isActive = getUserStatus(row);
                                            const userEmail = getUserEmail(row);
                                            const userGrower = getUserGrower(row);
                                            const userDevice = getUserDevice(row);
                                            const userLastLogin = getUserLastLogin(row);

                                            const color = isActive ? '#1F5C3A' : '#9A968A';
                                            const roleColor = getRoleColor(userRole);

                                            return (
                                                <Table.Tr
                                                    key={row.id || idx}
                                                    style={{
                                                        borderBottom: '1px solid #EFECE3',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAF9F5'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                                >
                                                    <Table.Td style={{ maxWidth: '200px' }}>
                                                        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                                                            <Avatar size="sm" radius="xl" style={{ backgroundColor: `${color}20`, color: color, flexShrink: 0 }}>
                                                                {userName.charAt(0) || '?'}
                                                            </Avatar>
                                                            <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                                                                <Text fw={600} c="#3A3A34" size="xs" truncate>{userName}</Text>
                                                                <Text size="10px" c="dimmed" truncate>{userEmail}</Text>
                                                            </Stack>
                                                        </Group>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Badge
                                                            size="sm"
                                                            color={roleColor}
                                                            variant="light"
                                                            radius="sm"
                                                            style={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            {userRole}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Badge size="sm" variant="outline" color="teal" radius="sm" style={{ whiteSpace: 'nowrap' }}>
                                                            {userGrower}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Group gap={4} wrap="nowrap">
                                                            {getDeviceIcon(userDevice)}
                                                            <Text size="xs" tt="capitalize" truncate>{userDevice}</Text>
                                                        </Group>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="xs" c="dimmed" truncate>{userLastLogin}</Text>
                                                    </Table.Td>
                                                    <Table.Td style={{ textAlign: 'center' }}>
                                                        <Badge
                                                            size="sm"
                                                            color={getStatusColor(isActive)}
                                                            variant="light"
                                                            radius="xl"
                                                            style={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            {isActive ? 'Activo' : 'Inactivo'}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td style={{ textAlign: 'center' }}>
                                                        <Group gap="xs" justify="center" wrap="nowrap">
                                                            <Tooltip label={isActive ? 'Desactivar' : 'Activar'}>
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="subtle"
                                                                    color={isActive ? 'yellow' : 'green'}
                                                                    onClick={() => handleToggleStatus(row)}
                                                                >
                                                                    {isActive ? <IconUserX size={14} /> : <IconUserCheck size={14} />}
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip label="Editar">
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="subtle"
                                                                    color="blue"
                                                                    onClick={() => handleOpenUserModal(row)}
                                                                >
                                                                    <IconEdit size={14} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip label="Eliminar">
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="subtle"
                                                                    color="red"
                                                                    onClick={() => handleDeleteUser(row)}
                                                                >
                                                                    <IconTrash size={14} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Group>
                                                    </Table.Td>
                                                </Table.Tr>
                                            );
                                        })
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td colSpan={7} ta="center" py="xl">
                                                <Stack align="center" gap="sm">
                                                    <IconUsers size={40} color="#9A968A" opacity={0.4} />
                                                    <Text size="sm" c="dimmed">
                                                        {filterPerfil !== 'Todos' ? 'No hay usuarios con este perfil' : 'No hay usuarios registrados'}
                                                    </Text>
                                                    <Button
                                                        size="xs"
                                                        color="teal"
                                                        style={{ backgroundColor: '#1F5C3A' }}
                                                        leftSection={<IconUserPlus size={14} />}
                                                        onClick={() => handleOpenUserModal()}
                                                    >
                                                        Crear Usuario
                                                    </Button>
                                                </Stack>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>

                        <Divider my="lg" />

                        <Group justify="space-between">
                            <Group gap="sm">
                                <Badge variant="light" color="green" radius="sm">
                                    <Group gap={4}>
                                        <IconUserCheck size={12} />
                                        {activos} activos
                                    </Group>
                                </Badge>
                                <Badge variant="light" color="gray" radius="sm">
                                    <Group gap={4}>
                                        <IconUserX size={12} />
                                        {inactivos} inactivos
                                    </Group>
                                </Badge>
                            </Group>
                            <Text size="xs" c="dimmed">
                                Cada captura del sistema queda firmada: quién, cuándo y desde qué dispositivo
                            </Text>
                        </Group>
                    </Card>
                </motion.div>
            )}

            {/* ===== PERFILES ===== */}
            {viewMode === 'perfiles' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{ marginBottom: '24px' }}
                >
                    <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" mb="lg">
                            <Group gap="sm">
                                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                    <IconShield size={18} />
                                </ThemeIcon>
                                <Stack gap={0}>
                                    <Text size="sm" fw={700} c="#3A3A34">Perfiles</Text>
                                    <Text size="xs" c="dimmed">Definición de roles y permisos</Text>
                                </Stack>
                            </Group>
                            <Button
                                size="xs"
                                variant="light"
                                color="teal"
                                leftSection={<IconPlus size={14} />}
                                onClick={() => handleOpenRoleModal()}
                            >
                                Nuevo Perfil
                            </Button>
                        </Group>

                        <Divider mb="lg" />

                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                            {roles.length > 0 ? (
                                roles.map((role, idx) => {
                                    const colors = ['#1F5C3A', '#2A6A8A', '#C08412', '#7D3C98', '#1F5C3A'];
                                    const color = colors[idx % colors.length];
                                    const userCount = users.filter(u => u.role === role.id || u.role_id === role.id).length;

                                    return (
                                        <Card
                                            key={idx}
                                            p="md"
                                            radius="md"
                                            withBorder
                                            style={{
                                                borderColor: `${color}40`,
                                                backgroundColor: `${color}06`,
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Group justify="space-between" mb="xs">
                                                <Group gap="sm">
                                                    <ThemeIcon size="sm" radius="xl" style={{ backgroundColor: `${color}20`, color: color }}>
                                                        <IconShield size={14} />
                                                    </ThemeIcon>
                                                    <Text fw={700} size="sm" c={color}>{role.name}</Text>
                                                </Group>
                                                <Group gap="xs">
                                                    <Tooltip label="Editar perfil">
                                                        <ActionIcon
                                                            size="sm"
                                                            variant="subtle"
                                                            color="blue"
                                                            onClick={() => handleOpenRoleModal(role)}
                                                        >
                                                            <IconEdit size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Eliminar perfil">
                                                        <ActionIcon
                                                            size="sm"
                                                            variant="subtle"
                                                            color="red"
                                                            onClick={() => {
                                                                setSelectedRole(role);
                                                                if (window.confirm(`¿Eliminar el perfil "${role.name}"?`)) {
                                                                    deleteRole(role.id).then(() => {
                                                                        notifications.show({
                                                                            title: '✅ Perfil eliminado',
                                                                            message: `${role.name} eliminado exitosamente`,
                                                                            color: 'green',
                                                                            icon: <IconCheck size={16} />,
                                                                        });
                                                                    });
                                                                }
                                                            }}
                                                            disabled={userCount > 0}
                                                        >
                                                            <IconTrash size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Group>
                                            </Group>
                                            <Text size="xs" fw={600} c="#3A3A34">{userCount} usuarios</Text>
                                            <Text size="xs" c="dimmed" mt={4}>{role.description || 'Sin descripción'}</Text>
                                            <Divider my="xs" />
                                            <Badge size="xs" variant="light" color="teal" radius="sm">
                                                {userCount} asignados
                                            </Badge>
                                        </Card>
                                    );
                                })
                            ) : (
                                <Box ta="center" py="xl">
                                    <IconShield size={40} color="#9A968A" opacity={0.4} />
                                    <Text size="sm" c="dimmed" mt="sm">No hay perfiles configurados</Text>
                                    <Button
                                        size="xs"
                                        color="teal"
                                        style={{ backgroundColor: '#1F5C3A' }}
                                        leftSection={<IconPlus size={14} />}
                                        onClick={() => handleOpenRoleModal()}
                                        mt="sm"
                                    >
                                        Crear Perfil
                                    </Button>
                                </Box>
                            )}
                        </SimpleGrid>
                    </Card>
                </motion.div>
            )}

            {/* ============================================================
          MODAL: Crear/Editar Usuario
      ============================================================ */}
            <Modal
                opened={userModalOpen}
                onClose={() => {
                    setUserModalOpen(false);
                    setSelectedUser(null);
                    setUserForm(prev => ({ ...prev, password: '' }));
                }}
                title={
                    <Group gap="sm">
                        <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                            {editing ? <IconEdit size={18} /> : <IconUserPlus size={18} />}
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text size="sm" fw={700}>{editing ? 'Editar Usuario' : 'Nuevo Usuario'}</Text>
                            <Text size="xs" c="dimmed">
                                {editing ? getUserName(selectedUser) : 'Crear un nuevo usuario en el sistema'}
                            </Text>
                        </Stack>
                    </Group>
                }
                size="lg"
                centered
            >
                <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
                    <Stack gap="md">
                        <Grid>
                            <Grid.Col span={8}>
                                <TextInput
                                    label="Nombre Completo"
                                    placeholder="Ej: Juan Pérez"
                                    value={userForm.full_name}
                                    onChange={(e) => setUserForm({ ...userForm, full_name: e.currentTarget.value })}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <PasswordInput
                                    label="PIN (4 dígitos)"
                                    placeholder="****"
                                    value={userForm.pin_code}
                                    onChange={(e) => setUserForm({ ...userForm, pin_code: e.currentTarget.value })}
                                    maxLength={4}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Email"
                                    placeholder="ejemplo@correo.com"
                                    type="email"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.currentTarget.value })}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Teléfono"
                                    placeholder="555-123-4567"
                                    value={userForm.phone}
                                    onChange={(e) => setUserForm({ ...userForm, phone: e.currentTarget.value })}
                                />
                            </Grid.Col>
                        </Grid>

                        {/* NUEVO: Campo de contraseña - solo visible para nuevos usuarios */}
                        {!editing && (
                            <PasswordInput
                                label="Contraseña"
                                placeholder="Mínimo 6 caracteres"
                                value={userForm.password}
                                onChange={(e) => setUserForm({ ...userForm, password: e.currentTarget.value })}
                                required
                                description="La contraseña debe tener al menos 6 caracteres"
                                styles={{
                                    input: {
                                        borderColor: userForm.password && userForm.password.length < 6 ? '#fa5252' : undefined,
                                    }
                                }}
                                rightSection={
                                    userForm.password && userForm.password.length >= 6 ? (
                                        <IconCheck size={16} color="#40c057" />
                                    ) : userForm.password && userForm.password.length < 6 ? (
                                        <IconAlertCircle size={16} color="#fa5252" />
                                    ) : null
                                }
                            />
                        )}

                        {/* Mostrar indicación de que la contraseña solo se puede cambiar en edición */}
                        {editing && (
                            <Alert
                                color="blue"
                                variant="light"
                                icon={<IconLock size={16} />}
                            >
                                <Text size="xs" c="dimmed">
                                    Para cambiar la contraseña, utiliza la opción "Restablecer contraseña" en el perfil del usuario.
                                </Text>
                            </Alert>
                        )}

                        <Grid>
                            <Grid.Col span={6}>
                                <Select
                                    label="Perfil"
                                    value={userForm.role_id}
                                    onChange={(value) => setUserForm({ ...userForm, role_id: value || '' })}
                                    data={roles.map(r => ({ value: r.id, label: r.name }))}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Dispositivo"
                                    value={userForm.device_type}
                                    onChange={(value) => setUserForm({ ...userForm, device_type: value as any || 'computadora' })}
                                    data={[
                                        { value: 'computadora', label: '💻 Computadora' },
                                        { value: 'tablet', label: '📱 Tablet' },
                                        { value: 'celular', label: '📲 Celular' },
                                    ]}
                                />
                            </Grid.Col>
                        </Grid>

                        <Switch
                            label="Usuario Activo"
                            checked={userForm.is_active}
                            onChange={(e) => setUserForm({ ...userForm, is_active: e.currentTarget.checked })}
                        />

                        <Divider />

                        <Group justify="space-between">
                            <Button
                                variant="subtle"
                                color="gray"
                                onClick={() => {
                                    setUserModalOpen(false);
                                    setSelectedUser(null);
                                    setUserForm(prev => ({ ...prev, password: '' }));
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                style={{ backgroundColor: '#1F5C3A' }}
                                leftSection={editing ? <IconEdit size={16} /> : <IconUserPlus size={16} />}
                                disabled={!editing && (!userForm.password || userForm.password.length < 6)}
                            >
                                {editing ? 'Actualizar Usuario' : 'Crear Usuario'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* ============================================================
          MODAL: Crear/Editar Perfil
      ============================================================ */}
            <Modal
                opened={roleModalOpen}
                onClose={() => {
                    setRoleModalOpen(false);
                    setSelectedRole(null);
                }}
                title={
                    <Group gap="sm">
                        <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                            {selectedRole ? <IconEdit size={18} /> : <IconShield size={18} />}
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text size="sm" fw={700}>{selectedRole ? 'Editar Perfil' : 'Nuevo Perfil'}</Text>
                            <Text size="xs" c="dimmed">
                                {selectedRole ? selectedRole.name : 'Definir un nuevo rol y permisos'}
                            </Text>
                        </Stack>
                    </Group>
                }
                size="md"
                centered
            >
                <form onSubmit={(e) => { e.preventDefault(); handleCreateRole(); }}>
                    <Stack gap="md">
                        <TextInput
                            label="Nombre del Perfil"
                            placeholder="Ej: Supervisor"
                            value={roleForm.name}
                            onChange={(e) => setRoleForm({ ...roleForm, name: e.currentTarget.value })}
                            required
                        />

                        <TextInput
                            label="Descripción"
                            placeholder="Descripción del rol"
                            value={roleForm.description}
                            onChange={(e) => setRoleForm({ ...roleForm, description: e.currentTarget.value })}
                        />

                        <Divider />

                        <Switch
                            label="Perfil Activo"
                            checked={roleForm.is_active}
                            onChange={(e) => setRoleForm({ ...roleForm, is_active: e.currentTarget.checked })}
                        />

                        <Divider />

                        <Group justify="space-between">
                            <Button
                                variant="subtle"
                                color="gray"
                                onClick={() => {
                                    setRoleModalOpen(false);
                                    setSelectedRole(null);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                style={{ backgroundColor: '#1F5C3A' }}
                                leftSection={selectedRole ? <IconEdit size={16} /> : <IconCheck size={16} />}
                            >
                                {selectedRole ? 'Actualizar Perfil' : 'Crear Perfil'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* ============================================================
          MODAL: Confirmar Eliminación
      ============================================================ */}
            <Modal
                opened={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedUser(null);
                }}
                title="Eliminar Usuario"
                size="sm"
                centered
            >
                <Stack gap="md">
                    <Alert
                        color="red"
                        variant="light"
                        title="¿Estás seguro?"
                        icon={<IconAlertCircle size={16} />}
                    >
                        <Text size="sm">
                            Vas a eliminar al usuario <strong>{getUserName(selectedUser)}</strong>.
                            Esta acción no se puede deshacer.
                        </Text>
                    </Alert>

                    <Group justify="space-between">
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={() => {
                                setDeleteModalOpen(false);
                                setSelectedUser(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            color="red"
                            loading={isSubmitting}
                            leftSection={<IconTrash size={16} />}
                            onClick={handleConfirmDelete}
                        >
                            Eliminar Usuario
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Box>
    );
}

export default GrowerUsersPermissions;