// src/utils/rbac.ts
import type { UserRole } from '../context/AuthContext';

/**
 * Matriz de Permisos Granulares por Rol:
 * - canView: Visibilidad y acceso a la interfaz/módulo
 * - canRead: Capacidad de consultar registros, métricas y datos
 * - canWrite: Capacidad de crear, editar, autorizar o eliminar información
 */

export type AppDomain = 
  | 'dashboard'
  | 'grower'
  | 'produce-cooling'
  | 'produce-first'
  | 'portal-clientes'
  | 'users-management'
  | 'settlements'
  | 'sales-orders'
  | 'expenses'
  | 'complaints';

export interface RolePermissions {
  canView: boolean;
  canRead: boolean;
  canWrite: boolean;
}

const DEFAULT_PERMISSIONS: Record<UserRole, Record<AppDomain, RolePermissions>> = {
  admin: {
    dashboard: { canView: true, canRead: true, canWrite: true },
    grower: { canView: true, canRead: true, canWrite: true },
    'produce-cooling': { canView: true, canRead: true, canWrite: true },
    'produce-first': { canView: true, canRead: true, canWrite: true },
    'portal-clientes': { canView: true, canRead: true, canWrite: true },
    'users-management': { canView: true, canRead: true, canWrite: true },
    settlements: { canView: true, canRead: true, canWrite: true },
    'sales-orders': { canView: true, canRead: true, canWrite: true },
    expenses: { canView: true, canRead: true, canWrite: true },
    complaints: { canView: true, canRead: true, canWrite: true },
  },
  comercial: {
    dashboard: { canView: true, canRead: true, canWrite: false },
    grower: { canView: false, canRead: false, canWrite: false },
    'produce-cooling': { canView: false, canRead: false, canWrite: false },
    'produce-first': { canView: false, canRead: false, canWrite: false }, // EXCLUSIVO ADMIN
    'portal-clientes': { canView: true, canRead: true, canWrite: false },
    'users-management': { canView: false, canRead: false, canWrite: false },
    settlements: { canView: false, canRead: false, canWrite: false },
    'sales-orders': { canView: true, canRead: true, canWrite: true },
    expenses: { canView: false, canRead: false, canWrite: false },
    complaints: { canView: true, canRead: true, canWrite: true },
  },
  cooling: {
    dashboard: { canView: true, canRead: true, canWrite: false },
    grower: { canView: false, canRead: false, canWrite: false },
    'produce-cooling': { canView: true, canRead: true, canWrite: true },
    'produce-first': { canView: false, canRead: false, canWrite: false }, // EXCLUSIVO ADMIN
    'portal-clientes': { canView: false, canRead: false, canWrite: false },
    'users-management': { canView: false, canRead: false, canWrite: false },
    settlements: { canView: false, canRead: false, canWrite: false },
    'sales-orders': { canView: false, canRead: false, canWrite: false },
    expenses: { canView: false, canRead: false, canWrite: false },
    complaints: { canView: false, canRead: false, canWrite: false },
  },
  grower: {
    dashboard: { canView: true, canRead: true, canWrite: false },
    grower: { canView: true, canRead: true, canWrite: true },
    'produce-cooling': { canView: false, canRead: false, canWrite: false },
    'produce-first': { canView: false, canRead: false, canWrite: false }, // EXCLUSIVO ADMIN
    'portal-clientes': { canView: false, canRead: false, canWrite: false },
    'users-management': { canView: false, canRead: false, canWrite: false },
    settlements: { canView: false, canRead: false, canWrite: false },
    'sales-orders': { canView: false, canRead: false, canWrite: false },
    expenses: { canView: true, canRead: true, canWrite: true },
    complaints: { canView: false, canRead: false, canWrite: false },
  },
  customer: {
    dashboard: { canView: false, canRead: false, canWrite: false },
    grower: { canView: false, canRead: false, canWrite: false },
    'produce-cooling': { canView: false, canRead: false, canWrite: false },
    'produce-first': { canView: false, canRead: false, canWrite: false },
    'portal-clientes': { canView: true, canRead: true, canWrite: true },
    'users-management': { canView: false, canRead: false, canWrite: false },
    settlements: { canView: false, canRead: false, canWrite: false },
    'sales-orders': { canView: false, canRead: true, canWrite: false },
    expenses: { canView: false, canRead: false, canWrite: false },
    complaints: { canView: true, canRead: true, canWrite: true },
  },
};

/**
 * Valida si un rol tiene permiso de vista
 */
export function hasViewPermission(role: UserRole | null | undefined, domain: AppDomain): boolean {
  if (!role) return false;
  return DEFAULT_PERMISSIONS[role]?.[domain]?.canView ?? false;
}

/**
 * Valida si un rol tiene permiso de lectura
 */
export function hasReadPermission(role: UserRole | null | undefined, domain: AppDomain): boolean {
  if (!role) return false;
  return DEFAULT_PERMISSIONS[role]?.[domain]?.canRead ?? false;
}

/**
 * Valida si un rol tiene permiso de escritura/mutación
 */
export function hasWritePermission(role: UserRole | null | undefined, domain: AppDomain): boolean {
  if (!role) return false;
  return DEFAULT_PERMISSIONS[role]?.[domain]?.canWrite ?? false;
}

/**
 * Obtiene el resumen de permisos de un rol para un dominio
 */
export function getDomainPermissions(role: UserRole | null | undefined, domain: AppDomain): RolePermissions {
  if (!role) {
    return { canView: false, canRead: false, canWrite: false };
  }
  return DEFAULT_PERMISSIONS[role]?.[domain] ?? { canView: false, canRead: false, canWrite: false };
}
