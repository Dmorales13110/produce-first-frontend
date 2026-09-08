// src/modules/grower/GrowerCatalog.tsx
import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  SimpleGrid, 
  Table, 
  Button, 
  Badge, 
  Stack, 
  Box,
  Group,
  ThemeIcon,
  Divider,
  Loader,
  Center,
  Alert,
  Modal,
  TextInput,
  Select,
  NumberInput,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Paper
} from '@mantine/core';
import { 
  IconPlus, 
  IconPackage, 
  IconTruck, 
  IconBuildingWarehouse,
  IconTag,
  IconCoin,
  IconClock,
  IconCheck,
  IconRefresh,
  IconAlertCircle,
  IconEdit,
  IconTrash,
  IconEye,
  IconSearch,
  IconFilter,
  IconCurrencyDollar,
  IconUser,
  IconMail,
  IconPhone
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCatalog } from './hooks/useCatalog';
import { notifications } from '@mantine/notifications';

export function GrowerCatalog() {
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { products, suppliers, summary, isLoading, error, refresh, createProduct, updateProduct, deleteProduct, createSupplier, updateSupplier, deleteSupplier } = useCatalog();

  // Estados para formularios
  const [productForm, setProductForm] = useState({
    sku: '',
    name: '',
    description: '',
    category: 'FERTILIZANTES',
    subcategory: '',
    unit: 'bulto 50kg',
    min_stock: 0,
    max_stock: 0,
    supplier: '',
    last_price: 0,
    currency: 'MXN',
  });

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    business_name: '',
    rfc: '',
    type: 'Fertilizante',
    payment_terms: 'Factura',
    credit_days: 30,
    lead_time: 3,
    currency: 'MXN',
    contact_name: '',
    contact_phone: '',
    email: '',
    address: '',
  });

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
        notifications.show({
          title: '✅ Producto actualizado',
          message: `${productForm.name} actualizado correctamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      } else {
        await createProduct(productForm);
        notifications.show({
          title: '✅ Producto creado',
          message: `${productForm.name} creado correctamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      }
      setProductModalOpen(false);
      resetProductForm();
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al guardar producto',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, supplierForm);
        notifications.show({
          title: '✅ Proveedor actualizado',
          message: `${supplierForm.name} actualizado correctamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      } else {
        await createSupplier(supplierForm);
        notifications.show({
          title: '✅ Proveedor creado',
          message: `${supplierForm.name} creado correctamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      }
      setSupplierModalOpen(false);
      resetSupplierForm();
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al guardar proveedor',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      category: product.category,
      subcategory: product.subcategory || '',
      unit: product.unit,
      min_stock: product.min_stock,
      max_stock: product.max_stock,
      supplier: product.supplier,
      last_price: product.last_price,
      currency: product.currency,
    });
    setProductModalOpen(true);
  };

  const handleEditSupplier = (supplier: any) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      business_name: supplier.business_name || '',
      rfc: supplier.rfc || '',
      type: supplier.type,
      payment_terms: supplier.payment_terms,
      credit_days: supplier.credit_days,
      lead_time: supplier.lead_time || 0,
      currency: supplier.currency,
      contact_name: supplier.contact_name || '',
      contact_phone: supplier.contact_phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
    });
    setSupplierModalOpen(true);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) return;

    try {
      await deleteProduct(id);
      notifications.show({
        title: '✅ Producto eliminado',
        message: `${name} eliminado correctamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al eliminar producto',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const handleDeleteSupplier = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el proveedor "${name}"?`)) return;

    try {
      await deleteSupplier(id);
      notifications.show({
        title: '✅ Proveedor eliminado',
        message: `${name} eliminado correctamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al eliminar proveedor',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      sku: '',
      name: '',
      description: '',
      category: 'FERTILIZANTES',
      subcategory: '',
      unit: 'bulto 50kg',
      min_stock: 0,
      max_stock: 0,
      supplier: '',
      last_price: 0,
      currency: 'MXN',
    });
  };

  const resetSupplierForm = () => {
    setEditingSupplier(null);
    setSupplierForm({
      name: '',
      business_name: '',
      rfc: '',
      type: 'Fertilizante',
      payment_terms: 'Factura',
      credit_days: 30,
      lead_time: 3,
      currency: 'MXN',
      contact_name: '',
      contact_phone: '',
      email: '',
      address: '',
    });
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando catálogos...</Text>
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
    <Box>
      {/* Encabezado */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Text size="xs" fw={700} c="#1F5C3A" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            CAT-1 · Catálogos
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Productos & Proveedores
          </Text>
          <Text size="sm" c="dimmed">
            Gestión de productos y proveedores para el ecosistema
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {summary?.totalProducts || 0} Productos
          </Badge>
          <Button
            size="xs"
            variant="subtle"
            color="teal"
            onClick={refresh}
            leftSection={<IconRefresh size={14} />}
          >
            Actualizar
          </Button>
        </Group>
      </Group>

      {/* KPIs */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
        {[
          { title: 'Productos', value: summary?.totalProducts?.toString() || '0', icon: IconPackage, color: '#1F5C3A', desc: `${summary?.activeProducts || 0} activos` },
          { title: 'Proveedores', value: summary?.totalSuppliers?.toString() || '0', icon: IconTruck, color: '#1F5C3A', desc: `${summary?.activeSuppliers || 0} activos` },
          { title: 'Captura Única', value: '1 vez', icon: IconCheck, color: '#1F5C3A', desc: 'todo lo demás lo usa' },
          { title: 'Alimentan a', value: '4 módulos', icon: IconBuildingWarehouse, color: '#3A3A34', desc: 'OC · CXP · G-10 · G-2' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                <Group justify="space-between" align="flex-start">
                  <Stack gap={2}>
                    <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {kpi.title}
                    </Text>
                    <Text size="xl" fw={800} c="#3A3A34">{kpi.value}</Text>
                    <Text size="10px" c="dimmed">{kpi.desc}</Text>
                  </Stack>
                  <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: kpi.color }}>
                    <Icon size={20} stroke={2} />
                  </ThemeIcon>
                </Group>
              </Card>
            </motion.div>
          );
        })}
      </SimpleGrid>

      {/* Tabla de Proveedores */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconTruck size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Proveedores</Text>
                <Text size="xs" c="dimmed">{suppliers.length} proveedores registrados</Text>
              </Stack>
            </Group>
            <Button 
              size="xs" 
              color="teal"
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconPlus size={14} />}
              onClick={() => {
                resetSupplierForm();
                setSupplierModalOpen(true);
              }}
            >
              Alta de Proveedor
            </Button>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Proveedor</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Tipo</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Condiciones</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Crédito</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Lead Time</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Moneda</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Compras 26-27</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <Table.Tr key={supplier.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                      <Table.Td fw={700} c="#3A3A34">{supplier.name}</Table.Td>
                      <Table.Td c="dimmed">{supplier.type}</Table.Td>
                      <Table.Td>{supplier.payment_terms}</Table.Td>
                      <Table.Td ta="center">
                        <Badge color={supplier.credit_days > 60 ? 'green' : supplier.credit_days > 30 ? 'blue' : 'orange'} variant="light" size="sm" radius="sm">
                          {supplier.credit_days} días
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Badge color={supplier.lead_time === 0 ? 'gray' : 'teal'} variant="light" size="sm" radius="sm">
                          {supplier.lead_time === 0 ? '—' : `${supplier.lead_time} días`}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="xs" variant="outline" color="gray" radius="sm">
                          {supplier.currency}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="right" fw={700} c="#1F5C3A">${supplier.total_purchases?.toLocaleString() || '0'}</Table.Td>
                      <Table.Td>
                        <Group gap={4} justify="center">
                          <Tooltip label="Editar">
                            <ActionIcon 
                              variant="subtle" 
                              color="blue" 
                              size="sm"
                              onClick={() => handleEditSupplier(supplier)}
                            >
                              <IconEdit size={16} stroke={1.5} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Eliminar">
                            <ActionIcon 
                              variant="subtle" 
                              color="red" 
                              size="sm"
                              onClick={() => handleDeleteSupplier(supplier.id, supplier.name)}
                            >
                              <IconTrash size={16} stroke={1.5} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={8} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconTruck size={40} color="#9A968A" opacity={0.4} />
                        <Text size="sm" c="dimmed">No hay proveedores registrados</Text>
                        <Text size="xs" c="dimmed">Comienza creando un nuevo proveedor</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      </motion.div>

      {/* Tabla de Productos */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconPackage size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Productos</Text>
                <Text size="xs" c="dimmed">{products.length} productos registrados</Text>
              </Stack>
            </Group>
            <Button 
              size="xs" 
              color="teal"
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconPlus size={14} />}
              onClick={() => {
                resetProductForm();
                setProductModalOpen(true);
              }}
            >
              Alta de Producto
            </Button>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>SKU</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Producto</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Familia</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Unidad</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Proveedor</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Últ. Precio</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Mín</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Máx</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Categoría</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <Table.Tr key={product.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                      <Table.Td fw={700} c="#1F5C3A" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                        {product.sku}
                      </Table.Td>
                      <Table.Td fw={600} c="#3A3A34">{product.name}</Table.Td>
                      <Table.Td>{product.category}</Table.Td>
                      <Table.Td c="dimmed">{product.unit}</Table.Td>
                      <Table.Td>{product.supplier}</Table.Td>
                      <Table.Td ta="right" fw={700} c="#1F5C3A">${product.last_price}</Table.Td>
                      <Table.Td ta="center">
                        <Badge color="blue" variant="light" size="sm" radius="sm">
                          {product.min_stock}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Badge color="orange" variant="light" size="sm" radius="sm">
                          {product.max_stock}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="xs" variant="light" color="gray" radius="sm">
                          {product.category}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} justify="center">
                          <Tooltip label="Editar">
                            <ActionIcon 
                              variant="subtle" 
                              color="blue" 
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <IconEdit size={16} stroke={1.5} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Eliminar">
                            <ActionIcon 
                              variant="subtle" 
                              color="red" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                            >
                              <IconTrash size={16} stroke={1.5} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={11} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconPackage size={40} color="#9A968A" opacity={0.4} />
                        <Text size="sm" c="dimmed">No hay productos registrados</Text>
                        <Text size="xs" c="dimmed">Comienza creando un nuevo producto</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      </motion.div>

      {/* Modal de Producto */}
      <Modal
        opened={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          resetProductForm();
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconPackage size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</Text>
              <Text size="xs" c="dimmed">SKU: {productForm.sku || 'Nuevo'}</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={handleProductSubmit}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="SKU"
                placeholder="Ej: FER-001"
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.currentTarget.value })}
                required
              />
              <TextInput
                label="Nombre"
                placeholder="Ej: Urea 46-0-0"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.currentTarget.value })}
                required
              />
            </SimpleGrid>

            <TextInput
              label="Descripción"
              placeholder="Descripción del producto"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.currentTarget.value })}
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Select
                label="Categoría"
                data={['FERTILIZANTES', 'AGROQUÍMICOS', 'SEMILLA', 'COMBUSTIBLE', 'EMPAQUE', 'OTROS']}
                value={productForm.category}
                onChange={(value) => setProductForm({ ...productForm, category: value || 'FERTILIZANTES' })}
                required
              />
              <TextInput
                label="Subcategoría"
                placeholder="Ej: Nitrogenados"
                value={productForm.subcategory}
                onChange={(e) => setProductForm({ ...productForm, subcategory: e.currentTarget.value })}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <Select
                label="Unidad"
                data={['bulto 50kg', 'L', 'kg', 'unidad', 'caja', 'lb']}
                value={productForm.unit}
                onChange={(value) => setProductForm({ ...productForm, unit: value || 'bulto 50kg' })}
                required
              />
              <NumberInput
                label="Stock Mínimo"
                value={productForm.min_stock}
                onChange={(value) => setProductForm({ ...productForm, min_stock: Number(value) || 0 })}
                min={0}
              />
              <NumberInput
                label="Stock Máximo"
                value={productForm.max_stock}
                onChange={(value) => setProductForm({ ...productForm, max_stock: Number(value) || 0 })}
                min={0}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <TextInput
                label="Proveedor"
                placeholder="Nombre del proveedor"
                value={productForm.supplier}
                onChange={(e) => setProductForm({ ...productForm, supplier: e.currentTarget.value })}
                required
              />
              <NumberInput
                label="Último Precio"
                value={productForm.last_price}
                onChange={(value) => setProductForm({ ...productForm, last_price: Number(value) || 0 })}
                min={0}
                prefix="$"
              />
              <Select
                label="Moneda"
                data={['MXN', 'USD']}
                value={productForm.currency}
                onChange={(value) => setProductForm({ ...productForm, currency: value || 'MXN' })}
              />
            </SimpleGrid>

            <Divider />

            <Group justify="space-between">
              <Button variant="subtle" color="gray" onClick={() => setProductModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconCheck size={16} />}
              >
                {editingProduct ? 'Actualizar' : 'Crear'} Producto
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal de Proveedor */}
      <Modal
        opened={supplierModalOpen}
        onClose={() => {
          setSupplierModalOpen(false);
          resetSupplierForm();
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconTruck size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>{editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}</Text>
              <Text size="xs" c="dimmed">{supplierForm.name || 'Nuevo proveedor'}</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={handleSupplierSubmit}>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Nombre del proveedor"
              value={supplierForm.name}
              onChange={(e) => setSupplierForm({ ...supplierForm, name: e.currentTarget.value })}
              required
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Razón Social"
                placeholder="Razón social"
                value={supplierForm.business_name}
                onChange={(e) => setSupplierForm({ ...supplierForm, business_name: e.currentTarget.value })}
              />
              <TextInput
                label="RFC"
                placeholder="RFC"
                value={supplierForm.rfc}
                onChange={(e) => setSupplierForm({ ...supplierForm, rfc: e.currentTarget.value })}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Select
                label="Tipo"
                data={['Fertilizante', 'Agroquímico', 'Semilla', 'Combustible', 'Empaque', 'Fletes', 'Otros']}
                value={supplierForm.type}
                onChange={(value) => setSupplierForm({ ...supplierForm, type: value || 'Fertilizante' })}
                required
              />
              <Select
                label="Condiciones de Pago"
                data={['Factura', 'Semanal', 'Quincenal', 'Mensual', 'Anticipo 50%']}
                value={supplierForm.payment_terms}
                onChange={(value) => setSupplierForm({ ...supplierForm, payment_terms: value || 'Factura' })}
                required
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <NumberInput
                label="Días de Crédito"
                value={supplierForm.credit_days}
                onChange={(value) => setSupplierForm({ ...supplierForm, credit_days: Number(value) || 0 })}
                min={0}
              />
              <NumberInput
                label="Lead Time (días)"
                value={supplierForm.lead_time}
                onChange={(value) => setSupplierForm({ ...supplierForm, lead_time: Number(value) || 0 })}
                min={0}
              />
              <Select
                label="Moneda"
                data={['MXN', 'USD']}
                value={supplierForm.currency}
                onChange={(value) => setSupplierForm({ ...supplierForm, currency: value || 'MXN' })}
              />
            </SimpleGrid>

            <Divider label="Contacto" labelPosition="center" />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Persona de Contacto"
                placeholder="Nombre del contacto"
                value={supplierForm.contact_name}
                onChange={(e) => setSupplierForm({ ...supplierForm, contact_name: e.currentTarget.value })}
              />
              <TextInput
                label="Teléfono de Contacto"
                placeholder="Teléfono"
                value={supplierForm.contact_phone}
                onChange={(e) => setSupplierForm({ ...supplierForm, contact_phone: e.currentTarget.value })}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Email"
                placeholder="Email"
                type="email"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm({ ...supplierForm, email: e.currentTarget.value })}
              />
              <TextInput
                label="Dirección"
                placeholder="Dirección"
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({ ...supplierForm, address: e.currentTarget.value })}
              />
            </SimpleGrid>

            <Divider />

            <Group justify="space-between">
              <Button variant="subtle" color="gray" onClick={() => setSupplierModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconCheck size={16} />}
              >
                {editingSupplier ? 'Actualizar' : 'Crear'} Proveedor
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}

export default GrowerCatalog;