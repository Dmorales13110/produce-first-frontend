// src/modules/produce-first/PFUSR_UsuariosPermisos.tsx

import React, { useState, useEffect } from 'react';
import { UsersService } from '../../../services/users';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import {
  Box,
  Container,
  Paper,
  Text,
  Group,
  Stack,
  Table,
  Button,
  SimpleGrid,
  TextInput,
  Select,
  Badge,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconUsers,
  IconUserPlus,
  IconLockCheck,
  IconInfoCircle,
  IconUser,
  IconDeviceLaptop,
  IconShieldLock,
  IconKey,
  IconWorld,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface KpiCard {
  label: string;
  value: string | number;
  sub: string;
  icon: React.FC<any>;
  color: string;
  bgColor: string;
  badge: string;
  badgeColor: string;
  delay: number;
}

interface UsuarioItem {
  id: string;
  usuario: string;
  rol: string;
  pantallas: string;
  pin: string;
  estado: string;
  estadoColor: string;
}

export function UsuariosPermisosView() {
  // --- Estados de Formulario para Alta de Usuario ---
  const [nombre, setNombre] = useState('');
  const [perfil, setPerfil] = useState<string | null>('Logística');
  const [contacto, setContacto] = useState('');
  const [requierePin, setRequierePin] = useState<string | null>('No');

  // --- Datos de Respaldo Tabla 1: Usuarios y perfiles ---
  const INITIAL_USUARIOS: UsuarioItem[] = [
    {
      id: '1',
      usuario: 'Jose (JFNO)',
      rol: 'Dirección · todo',
      pantallas: 'todas + GRP-1',
      pin: '✓ pagos y liquidaciones',
      estado: 'activo',
      estadoColor: 'amber',
    },
    {
      id: '2',
      usuario: 'Wendy',
      rol: 'Logística y documentación',
      pantallas: 'PF-4, PF-5, PF-6, PF-LQC, portales',
      pin: '—',
      estado: 'activo',
      estadoColor: 'amber',
    },
    {
      id: '3',
      usuario: 'Néstor',
      rol: 'Pronóstico y campo',
      pantallas: 'PF-2, PF-3, PF-VIS',
      pin: '—',
      estado: 'activo',
      estadoColor: 'amber',
    },
    {
      id: '4',
      usuario: 'Despacho contable',
      rol: 'Lectura + Contpaqi',
      pantallas: 'PF-9, PF-CONT (export)',
      pin: '—',
      estado: 'activo',
      estadoColor: 'amber',
    },
    {
      id: '5',
      usuario: 'Clientes Comerciales (15)',
      rol: 'Client Portal (customer)',
      pantallas: 'PF-WEB1 · solo lo suyo',
      pin: '—',
      estado: 'externos',
      estadoColor: 'blue',
    },
  ];

  const [usuariosData, setUsuariosData] = useState<UsuarioItem[]>(INITIAL_USUARIOS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    UsersService.getUsers()
      .then((users) => {
        if (isMounted && users && users.length > 0) {
          const mapped: UsuarioItem[] = users.map((u) => ({
            id: u.id,
            usuario: u.full_name || u.name || u.email,
            rol: u.role || 'Usuario',
            pantallas: 'Estándar',
            pin: u.pin_code ? '✓ ' + u.pin_code : '—',
            estado: u.is_active ? 'activo' : 'inactivo',
            estadoColor: u.is_active ? 'green' : 'gray',
          }));
          setUsuariosData(mapped);
        }
      })
      .catch((err) => {
        console.warn('⚠️ [PF-USR] Error al obtener usuarios, usando respaldo:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCrearUsuario = async () => {
    if (!nombre.trim()) {
      notifications.show({
        title: 'Campo Requerido',
        message: 'Por favor ingrese el nombre del usuario',
        color: 'red',
      });
      return;
    }

    setIsLoading(true);
    try {
      await UsersService.createUser({
        name: nombre,
        full_name: nombre,
        email: contacto.includes('@') ? contacto : `${nombre.toLowerCase().replace(/\s+/g, '.')}@producefirst.com`,
        role: perfil || 'comercial',
        device_type: 'computadora',
        is_active: true,
      });

      setUsuariosData((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          usuario: nombre,
          rol: perfil || 'Usuario',
          pantallas: 'Asignadas por perfil',
          pin: requierePin?.startsWith('Sí') ? '✓ 4 dígitos' : '—',
          estado: 'activo',
          estadoColor: 'green',
        },
      ]);

      notifications.show({
        title: 'Usuario Creado',
        message: `El usuario ${nombre} ha sido registrado exitosamente.`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      setNombre('');
      setContacto('');
    } catch (err) {
      console.warn('⚠️ [PF-USR] Fallback local al crear usuario:', err);
      setUsuariosData((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          usuario: nombre,
          rol: perfil || 'Usuario',
          pantallas: 'Asignadas por perfil',
          pin: requierePin?.startsWith('Sí') ? '✓ 4 dígitos' : '—',
          estado: 'activo',
          estadoColor: 'green',
        },
      ]);
      notifications.show({
        title: 'Usuario Registrado (Local)',
        message: `El usuario ${nombre} ha sido guardado localmente.`,
        color: 'blue',
        icon: <IconCheck size={16} />,
      });
      setNombre('');
      setContacto('');
    } finally {
      setIsLoading(false);
    }
  };

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Usuarios de PF',
      value: '6 internos + externos',
      sub: 'misma fórmula que USR-1 del grower',
      icon: IconUsers,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Total',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Perfiles',
      value: '4',
      sub: 'dirección · logística · captura · lectura',
      icon: IconShieldLock,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Roles',
      badgeColor: 'yellow',
      delay: 0.1,
    },
    {
      label: 'Portales Externos',
      value: 'Por invitación',
      sub: 'cada quien ve SOLO lo suyo',
      icon: IconWorld,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Externo',
      badgeColor: 'green',
      delay: 0.15,
    },
    {
      label: 'PIN de Autorización',
      value: 'Para pagos y liquidaciones',
      sub: '4 dígitos · queda en bitácora',
      icon: IconKey,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Seguridad',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-USR */}
          <Paper
            p="lg"
            radius="lg"
            withBorder
            style={{
              borderColor: '#E8E5DC',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <ThemeIcon size="lg" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
                  <IconBuildingStore size={24} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="20px" fw={800} c="#1A3A5C">
                    PF-USR · Usuarios y Permisos de PF
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconUsers size={14} />
                    Administración
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconShieldLock size={14} />
                    Seguridad
                  </Group>
                </Badge>
              </Group>
            </Group>
          </Paper>

          {/* 4 KPI Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            {kpiCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: card.delay || index * 0.05 }}
              >
                <Paper
                  p="md"
                  radius="lg"
                  withBorder
                  style={{
                    borderColor: '#E8E5DC',
                    backgroundColor: '#FFFFFF',
                    height: '100%',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">
                        {card.label}
                      </Text>
                      <Text size="16px" fw={800} style={{ color: card.color, lineHeight: 1.2 }}>
                        {card.value}
                      </Text>
                      <Text size="10px" c="dimmed">{card.sub}</Text>
                      <Badge
                        size="xs"
                        color={card.badgeColor}
                        variant="light"
                        radius="sm"
                        style={{ alignSelf: 'flex-start', marginTop: 2 }}
                      >
                        {card.badge}
                      </Badge>
                    </Stack>
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      style={{
                        backgroundColor: card.bgColor,
                        color: card.color,
                        flexShrink: 0,
                      }}
                    >
                      <card.icon size={20} stroke={2} />
                    </ThemeIcon>
                  </Group>
                </Paper>
              </motion.div>
            ))}
          </SimpleGrid>

          {/* SECCIÓN USUARIOS Y PERFILES */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconUsers size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Usuarios y Perfiles
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  {usuariosData.length} usuarios
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Usuario</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Rol</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Pantallas</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>PIN</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Estado
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {usuariosData.map((row) => (
                      <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          <Group gap={4}>
                            <IconUser size={14} color="#6B7280" />
                            {row.usuario}
                          </Group>
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.rol}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.pantallas}</Table.Td>
                        <Table.Td>
                          {row.pin.startsWith('✓') ? (
                            <Badge size="xs" color="amber" variant="light" style={{ textTransform: 'none' }}>
                              {row.pin}
                            </Badge>
                          ) : (
                            <Text size="12px" c="dimmed">{row.pin}</Text>
                          )}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge size="xs" color={row.estadoColor} variant="light">
                            {row.estado}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                los usuarios internos tienen acceso a las pantallas de su perfil · los externos 
                (productores y clientes) acceden solo a sus portales dedicados
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN CAPTURA - ALTA / PERMISOS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconUserPlus size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Captura · Alta / Permisos
                </Text>
                <Badge size="xs" color="yellow" variant="light" radius="sm">
                  Nuevo usuario
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                <TextInput
                  label="Nombre"
                  placeholder="Ej: Operador de campo"
                  size="xs"
                  value={nombre}
                  onChange={(e) => setNombre(e.currentTarget.value)}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />

                <Select
                  label="Perfil"
                  size="xs"
                  value={perfil}
                  onChange={setPerfil}
                  data={['Dirección', 'Logística', 'Pronóstico y campo', 'Lectura + Contpaqi', 'Client Portal']}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />

                <TextInput
                  label="Correo / teléfono"
                  placeholder="—"
                  size="xs"
                  value={contacto}
                  onChange={(e) => setContacto(e.currentTarget.value)}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />

                <Select
                  label="Requiere PIN"
                  size="xs"
                  value={requierePin}
                  onChange={setRequierePin}
                  data={['No', 'Sí (4 dígitos)']}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </SimpleGrid>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconLockCheck size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                  onClick={handleCrearUsuario}
                  loading={isLoading}
                >
                  Crear usuario e invitar
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                cada usuario tiene un perfil que define las pantallas a las que tiene acceso · 
                el PIN de autorización queda registrado en la bitácora de cada operación
              </Text>
            </Stack>
          </Paper>

          {/* Callout Informativo Final */}
          <Paper
            p="sm"
            radius="lg"
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
            }}
          >
            <Group align="flex-start" gap="xs">
              <IconLockCheck size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#15803D" style={{ flex: 1, lineHeight: 1.5 }}>
                <strong>✓ Al guardar:</strong> quién emitió cada liquidación, quién aprobó cada ajuste 
                y quién marcó cada pago queda firmado con su usuario — la bitácora es parte del registro.
              </Text>
            </Group>
          </Paper>

          <Paper
            p="sm"
            radius="lg"
            style={{
              backgroundColor: '#F0F7FF',
              border: '1px solid #93C5FD',
            }}
          >
            <Group align="flex-start" gap="xs">
              <IconInfoCircle size={18} color="#1A4B8C" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#1A3A5C" style={{ flex: 1, lineHeight: 1.5 }}>
                <strong>✓ PF-USR:</strong> la administración de usuarios y permisos de Produce First · 
                cada perfil define el acceso a pantallas y operaciones · los portales externos permiten 
                a productores y clientes ver solo su información · el PIN de autorización asegura 
                operaciones críticas como pagos y liquidaciones.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}