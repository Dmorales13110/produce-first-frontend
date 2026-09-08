// services/usersPermissionsService.ts

import type {
  UsuarioPC,
  PermisoPC,
  UsersPermissionsStats,
} from '../../types';

// Mock data - Usuarios
const MOCK_USUARIOS: UsuarioPC[] = [
  { id: 1, usuario: 'Jose (JFNO)', rol: 'Dirección', pantallas: 'todas', pin: '✓ pagos', estado: 'activo', turno: 'Turno Completo' },
  { id: 2, usuario: 'Jefe de planta', rol: 'Operación completa', pantallas: 'ESC-1, PC-1, PC-4, PC-EMB, PC-NOM, PC-MTO', pin: '✓ cortes', estado: 'activo', turno: '13:00–01:00' },
  { id: 3, usuario: 'Báscula / recepción (turno)', rol: 'Captura de recepciones', pantallas: 'ESC-1 (escaneo + manual)', pin: '—', estado: 'activo', turno: '13:00–01:00' },
  { id: 4, usuario: 'Operador de túnel (2)', rol: 'Bitácora de vacío', pantallas: 'PC-4 (ciclos)', pin: '—', estado: 'activo', turno: '13:00–01:00' },
  { id: 5, usuario: 'Operador de hielo', rol: 'Bitácora de hielo', pantallas: 'PC-4 (producción + enhielado)', pin: '—', estado: 'activo', turno: '01:00–13:00' },
  { id: 6, usuario: 'Montacarguista (2)', rol: 'Confirmar cargas', pantallas: 'PC-EMB (checklist)', pin: '—', estado: 'activo', turno: '13:00–01:00' },
];

// Mock data - Perfiles disponibles
const MOCK_PERFILES: PermisoPC[] = [
  { id: '1', nombre: 'Dirección', descripcion: 'Acceso total a todas las pantallas', pantallas: ['todas'] },
  { id: '2', nombre: 'Operación completa', descripcion: 'Acceso a operaciones de planta', pantallas: ['ESC-1', 'PC-1', 'PC-4', 'PC-EMB', 'PC-NOM', 'PC-MTO'] },
  { id: '3', nombre: 'Captura de recepciones', descripcion: 'Escaneo y recepción de producto', pantallas: ['ESC-1'] },
  { id: '4', nombre: 'Bitácora de vacío', descripcion: 'Captura de ciclos de vacío', pantallas: ['PC-4 (ciclos)'] },
  { id: '5', nombre: 'Bitácora de hielo', descripcion: 'Captura de producción de hielo', pantallas: ['PC-4 (producción + enhielado)'] },
  { id: '6', nombre: 'Confirmar cargas', descripcion: 'Checklist de embarque', pantallas: ['PC-EMB (checklist)'] },
];

export const usersPermissionsService = {
  // Usuarios
  getUsuarios: (): UsuarioPC[] => [...MOCK_USUARIOS],
  
  createUsuario: (data: Partial<UsuarioPC>): UsuarioPC => {
    const nuevo: UsuarioPC = {
      id: MOCK_USUARIOS.length + 1,
      usuario: data.usuario || 'Nuevo usuario',
      rol: data.rol || 'Sin rol',
      pantallas: data.pantallas || '—',
      pin: data.pin || '—',
      estado: 'activo',
      turno: data.turno || 'Turno Completo',
    };
    MOCK_USUARIOS.push(nuevo);
    return nuevo;
  },

  // Perfiles
  getPerfiles: (): PermisoPC[] => [...MOCK_PERFILES],

  // Estadísticas
  getStats: (): UsersPermissionsStats => {
    const usuarios = MOCK_USUARIOS;
    return {
      totalUsuarios: usuarios.length,
      activos: usuarios.filter(u => u.estado === 'activo').length,
      conPin: usuarios.filter(u => u.pin !== '—').length,
      perfiles: MOCK_PERFILES.length,
    };
  },
};