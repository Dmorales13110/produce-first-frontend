// UsersPermissions/hooks/useUsersPermissions.ts

import { useState, useCallback, useEffect } from 'react';
import { UsersService } from '../../../../services/users';
import type { User, UserRole } from '../../../../services/users';

interface UsuarioPC {
  id: string;
  usuario: string;
  rol: string;
  pantallas: string;
  pin: string;
  estado: string;
  turno: string;
}

interface UsersPermissionsStats {
  totalUsuarios: number;
  activos: number;
  conPin: number;
  perfiles: number;
}

export const useUsersPermissions = () => {
  const [usuarios, setUsuarios] = useState<UsuarioPC[]>([]);
  const [perfiles, setPerfiles] = useState<UserRole[]>([]);
  const [stats, setStats] = useState<UsersPermissionsStats>({
    totalUsuarios: 0,
    activos: 0,
    conPin: 0,
    perfiles: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener usuarios
      const users = await UsersService.getUsers();
      const roles = await UsersService.getRoles();

      // Mapear a UsuarioPC
      const usuariosData: UsuarioPC[] = users.map(u => ({
        id: u.id,
        usuario: u.full_name || u.name || u.email,
        rol: u.role || 'Sin rol',
        pantallas: u.device_type || '—',
        pin: u.pin_code ? '✓' : '—',
        estado: u.is_active ? 'activo' : 'inactivo',
        turno: 'Turno Completo',
      }));
      setUsuarios(usuariosData);
      setPerfiles(roles);

      // Calcular estadísticas
      setStats({
        totalUsuarios: users.length,
        activos: users.filter(u => u.is_active).length,
        conPin: users.filter(u => u.pin_code).length,
        perfiles: roles.length,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUsuario = useCallback(async (data: any) => {
    try {
      const nuevo = await UsersService.createUser({
        email: data.email || `${data.usuario?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'usuario'}@producecooling.com`,
        full_name: data.usuario || 'Nuevo Usuario',
        name: data.usuario || 'Nuevo Usuario',
        role: data.rol || 'cooling',
        pin_code: data.pin || undefined,
        device_type: data.device_type || 'computadora',
      });
      await loadData();
      return {
        id: nuevo.id,
        usuario: nuevo.full_name || nuevo.name,
        rol: nuevo.role,
        pantallas: nuevo.device_type || '—',
        pin: nuevo.pin_code ? '✓' : '—',
        estado: 'activo',
        turno: 'Turno Completo',
      };
    } catch (e) {
      console.warn('⚠️ [useUsersPermissions] createUser backend error, local fallback:', e);
      const fallback: UsuarioPC = {
        id: String(Date.now()),
        usuario: data.usuario || 'Nuevo usuario',
        rol: data.rol || 'Sin rol',
        pantallas: data.pantallas || '—',
        pin: data.pin || '—',
        estado: 'activo',
        turno: data.turno || 'Turno Completo',
      };
      setUsuarios(prev => [fallback, ...prev]);
      return fallback;
    }
  }, [loadData]);

  return {
    usuarios,
    perfiles,
    stats,
    isLoading,
    error,
    createUsuario,
    refresh: loadData,
  };
};