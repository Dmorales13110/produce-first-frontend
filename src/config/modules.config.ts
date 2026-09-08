// src/config/modules.config.ts

export interface ModuleConfig {
  id: string;
  label: string;
  path: string;
  icon: string;
  roles: ('admin' | 'grower' | 'cooling' | 'comercial' | 'customer')[];
}

export const modulesConfig: ModuleConfig[] = [
  // GRP1 · Dashboard
  {
    id: 'GRP1',
    label: 'Dashboard PF',
    path: '/produce-first',
    icon: 'IconDashboard',
    roles: ['admin'],
  },
  
  // PLANEACIÓN COMERCIAL
  {
    id: 'PF1',
    label: 'PF1 · Catálogos',
    path: '/produce-first/pf1',
    icon: 'IconShoppingCart',
    roles: ['admin'],
  },
  {
    id: 'PF2',
    label: 'PF2 · Ventas vs Siembra',
    path: '/produce-first/pf2',
    icon: 'IconCalendar',
    roles: ['admin'],
  },
  {
    id: 'PF3',
    label: 'PF3 · Pronóstico Semanal',
    path: '/produce-first/pf3',
    icon: 'IconChartBar',
    roles: ['admin'],
  },
  
  // VENTA Y EMBARQUE
  {
    id: 'PF4',
    label: 'PF4 · Planificador de Carga',
    path: '/produce-first/pf4',
    icon: 'IconTruck',
    roles: ['admin'],
  },
  {
    id: 'PF5',
    label: 'PF5 · Proforma',
    path: '/produce-first/pf5',
    icon: 'IconFileInvoice',
    roles: ['admin'],
  },
  {
    id: 'PF6',
    label: 'PF6 · CxC de Clientes',
    path: '/produce-first/pf6',
    icon: 'IconCreditCardHand',
    roles: ['admin'],
  },
  {
    id: 'PFLQC',
    label: 'PFLQC · Liquidaciones y Quejas',
    path: '/produce-first/pflqc',
    icon: 'IconReceipt',
    roles: ['admin'],
  },
  
  // COMPRAS Y MATERIAL
  {
    id: 'PFOC',
    label: 'PFOC · Órdenes de Compra',
    path: '/produce-first/pfoc',
    icon: 'IconClipboardList',
    roles: ['admin'],
  },
  {
    id: 'PFMAT',
    label: 'PFMAT · Material de Empaque',
    path: '/produce-first/pfmat',
    icon: 'IconPackage',
    roles: ['admin'],
  },
  
  // PRODUCTORES
  {
    id: 'PF7',
    label: 'PF7 · Cuenta Corriente',
    path: '/produce-first/pf7',
    icon: 'IconUsers',
    roles: ['admin'],
  },
  {
    id: 'PF8',
    label: 'PF8 · Motor de Liquidaciones',
    path: '/produce-first/pf8',
    icon: 'IconCalculator',
    roles: ['admin'],
  },
  
  // DINERO PF
  {
    id: 'PF10',
    label: 'PF10 · Resultados Semanales',
    path: '/produce-first/pf10',
    icon: 'IconTrendingUp',
    roles: ['admin'],
  },
  {
    id: 'PF9',
    label: 'PF9 · CxP Gastos de Venta',
    path: '/produce-first/pf9',
    icon: 'IconCreditCard',
    roles: ['admin'],
  },
  {
    id: 'PFBAN',
    label: 'PFBAN · Bancos y Tesorería',
    path: '/produce-first/pfban',
    icon: 'IconBuildingBank',
    roles: ['admin'],
  },
  {
    id: 'PFNOM',
    label: 'PFNOM · Nómina y Gastos',
    path: '/produce-first/pfnom',
    icon: 'IconList',
    roles: ['admin'],
  },
  {
    id: 'PFCONT',
    label: 'PFCONT · Contpaqi PF',
    path: '/produce-first/pfcont',
    icon: 'IconDatabase',
    roles: ['admin'],
  },
  
  // RESULTADO
  {
    id: 'PFREG',
    label: 'PFREG · Registro Liquidaciones',
    path: '/produce-first/pfreg',
    icon: 'IconReportMoney',
    roles: ['admin'],
  },
  {
    id: 'PFDASH',
    label: 'PFDASH · Dashboard PF',
    path: '/produce-first/pfdash',
    icon: 'IconChartPie',
    roles: ['admin'],
  },
  
  // ADMINISTRACIÓN
  {
    id: 'PFUSR',
    label: 'PFUSR · Usuarios y Permisos',
    path: '/produce-first/pfusr',
    icon: 'IconUserCheck',
    roles: ['admin'],
  },
  
  // PORTAL DE CLIENTES
  {
    id: 'PFW1',
    label: 'PFW1 · Client Portal',
    path: '/produce-first/pfw1',
    icon: 'IconWorld',
    roles: ['admin', 'customer'],
  },
];

export const getModulesByRole = (role: string | null): ModuleConfig[] => {
  if (!role) return [];
  return modulesConfig.filter(mod => mod.roles.includes(role as any));
};

export const isModuleAllowed = (moduleId: string, role: string | null): boolean => {
  if (!role) return false;
  const module = modulesConfig.find(m => m.id === moduleId);
  if (!module) return false;
  return module.roles.includes(role as any);
};