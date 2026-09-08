// src/config/modules.config.ts

export interface ModuleConfig {
  id: string;
  label: string;
  path: string;
  icon: string;
  roles: ('admin' | 'grower' | 'cooling' | 'comercial')[];
}

export const modulesConfig: ModuleConfig[] = [
  // GRP1 · Dashboard
  {
    id: 'GRP1',
    label: 'Dashboard PF',
    path: '/produce-first',
    icon: 'IconDashboard',
    roles: ['admin', 'grower', 'cooling', 'comercial'],
  },
  
  // PLANEACIÓN COMERCIAL
  {
    id: 'PF1',
    label: 'PF1 · Catálogos',
    path: '/produce-first/pf1',
    icon: 'IconShoppingCart',
    roles: ['admin', 'comercial', 'grower', 'cooling'],
  },
  {
    id: 'PF2',
    label: 'PF2 · Ventas vs Siembra',
    path: '/produce-first/pf2',
    icon: 'IconCalendar',
    roles: ['admin', 'comercial', 'grower'],
  },
  {
    id: 'PF3',
    label: 'PF3 · Pronóstico Semanal',
    path: '/produce-first/pf3',
    icon: 'IconChartBar',
    roles: ['admin', 'comercial', 'grower'],
  },
  
  // VENTA Y EMBARQUE
  {
    id: 'PF4',
    label: 'PF4 · Planificador de Carga',
    path: '/produce-first/pf4',
    icon: 'IconTruck',
    roles: ['admin', 'comercial', 'cooling'],
  },
  {
    id: 'PF5',
    label: 'PF5 · Proforma',
    path: '/produce-first/pf5',
    icon: 'IconFileInvoice',
    roles: ['admin', 'comercial', 'cooling'],
  },
  {
    id: 'PF6',
    label: 'PF6 · CxC de Clientes',
    path: '/produce-first/pf6',
    icon: 'IconCreditCardHand',
    roles: ['admin', 'comercial', 'cooling'],
  },
  {
    id: 'PFLQC',
    label: 'PFLQC · Liquidaciones y Quejas',
    path: '/produce-first/pflqc',
    icon: 'IconReceipt',
    roles: ['admin', 'comercial', 'cooling'],
  },
  
  // COMPRAS Y MATERIAL
  {
    id: 'PFOC',
    label: 'PFOC · Órdenes de Compra',
    path: '/produce-first/pfoc',
    icon: 'IconClipboardList',
    roles: ['admin', 'comercial', 'cooling'],
  },
  {
    id: 'PFMAT',
    label: 'PFMAT · Material de Empaque',
    path: '/produce-first/pfmat',
    icon: 'IconPackage',
    roles: ['admin', 'comercial', 'cooling'],
  },
  
  // PRODUCTORES
  {
    id: 'PF7',
    label: 'PF7 · Cuenta Corriente',
    path: '/produce-first/pf7',
    icon: 'IconUsers',
    roles: ['admin', 'comercial', 'grower'],
  },
  {
    id: 'PF8',
    label: 'PF8 · Motor de Liquidaciones',
    path: '/produce-first/pf8',
    icon: 'IconCalculator',
    roles: ['admin', 'comercial', 'grower'],
  },
  
  // DINERO PF
  {
    id: 'PF10',
    label: 'PF10 · Presupuesto y P&L',
    path: '/produce-first/pf10',
    icon: 'IconMoneybag',
    roles: ['admin', 'comercial'],
  },
  {
    id: 'PF9',
    label: 'PF9 · CxP de PF',
    path: '/produce-first/pf9',
    icon: 'IconCreditCardPay',
    roles: ['admin', 'comercial', 'cooling'],
  },
  {
    id: 'PFBAN',
    label: 'PFBAN · Bancos PF',
    path: '/produce-first/pfban',
    icon: 'IconBuildingBank',
    roles: ['admin', 'comercial'],
  },
  {
    id: 'PFNOM',
    label: 'PFNOM · Nómina y Gastos',
    path: '/produce-first/pfnom',
    icon: 'IconList',
    roles: ['admin', 'comercial'],
  },
  {
    id: 'PFCONT',
    label: 'PFCONT · Contpaqi PF',
    path: '/produce-first/pfcont',
    icon: 'IconDatabase',
    roles: ['admin', 'comercial'],
  },
  
  // RESULTADO
  {
    id: 'PFREG',
    label: 'PFREG · Registro Liquidaciones',
    path: '/produce-first/pfreg',
    icon: 'IconReportMoney',
    roles: ['admin', 'comercial'],
  },
  {
    id: 'PFDASH',
    label: 'PFDASH · Dashboard PF',
    path: '/produce-first/pfdash',
    icon: 'IconChartPie',
    roles: ['admin', 'comercial'],
  },
  
  // ADMINISTRACIÓN
  {
    id: 'PFUSR',
    label: 'PFUSR · Usuarios y Permisos',
    path: '/produce-first/pfusr',
    icon: 'IconUserCheck',
    roles: ['admin'],
  },
  
  // PORTALES
  {
    id: 'PFW1',
    label: 'PFW1 · Client Portal',
    path: '/produce-first/pfw1',
    icon: 'IconWorld',
    roles: ['admin', 'comercial', 'cooling'],
  },
  {
    id: 'PFW2',
    label: 'PFW2 · Portal del Productor',
    path: '/produce-first/pfw2',
    icon: 'IconPlant',
    roles: ['admin', 'comercial', 'grower'],
  },
  {
    id: 'R07',
    label: 'R07 · Visitas del Agrónomo',
    path: '/produce-first/r07',
    icon: 'IconMapPin',
    roles: ['admin', 'grower'],
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