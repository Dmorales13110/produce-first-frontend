/**
 * Suite de Pruebas Unitarias: RBAC, Roles y Aislamiento de Clientes
 * Valida que los permisos de Vista, Lectura y Escritura se cumplan estrictamente,
 * y que el rol 'customer' quede 100% aislado a su portal.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  hasViewPermission, 
  hasReadPermission, 
  hasWritePermission, 
  getDomainPermissions 
} from '../src/utils/rbac.ts';
import { isModuleAllowed } from '../src/config/modules.config.ts';

describe('RBAC & Role Permissions Suite', () => {
  
  describe('Rol: customer (Cliente Comercial)', () => {
    it('debe tener permiso exclusivo de vista en portal-clientes', () => {
      assert.equal(hasViewPermission('customer', 'portal-clientes'), true);
      assert.equal(hasViewPermission('customer', 'dashboard'), false);
      assert.equal(hasViewPermission('customer', 'grower'), false);
      assert.equal(hasViewPermission('customer', 'produce-cooling'), false);
      assert.equal(hasViewPermission('customer', 'produce-first'), false);
      assert.equal(hasViewPermission('customer', 'users-management'), false);
    });

    it('debe tener permiso de escritura solo para quejas y reclamos', () => {
      assert.equal(hasWritePermission('customer', 'complaints'), true);
      assert.equal(hasWritePermission('customer', 'expenses'), false);
      assert.equal(hasWritePermission('customer', 'settlements'), false);
      assert.equal(hasWritePermission('customer', 'sales-orders'), false);
    });

    it('no debe tener acceso a módulos internos en modules.config', () => {
      assert.equal(isModuleAllowed('GRP1', 'customer'), false); // Dashboard interno
      assert.equal(isModuleAllowed('PF1', 'customer'), false);  // Catálogos internos
      assert.equal(isModuleAllowed('PF8', 'customer'), false);  // Motor de liquidaciones
      assert.equal(isModuleAllowed('PFUSR', 'customer'), false);// Permisos
      assert.equal(isModuleAllowed('PFW1', 'customer'), true);  // Portal del Cliente
    });
  });

  describe('Rol: admin (Administrador General)', () => {
    it('debe tener permisos totales de vista, lectura y escritura en todos los dominios', () => {
      const domains = ['dashboard', 'grower', 'produce-cooling', 'produce-first', 'portal-clientes', 'users-management'] as const;
      for (const d of domains) {
        const perms = getDomainPermissions('admin', d);
        assert.equal(perms.canView, true, `admin debe ver ${d}`);
        assert.equal(perms.canRead, true, `admin debe leer ${d}`);
        assert.equal(perms.canWrite, true, `admin debe escribir ${d}`);
      }
    });
  });

  describe('Rol: grower (Productor / Agrícola)', () => {
    it('debe acceder a grower y captura de gastos, pero no a cuartos de frío ni usuarios', () => {
      assert.equal(hasViewPermission('grower', 'grower'), true);
      assert.equal(hasWritePermission('grower', 'expenses'), true);
      assert.equal(hasViewPermission('grower', 'produce-cooling'), false);
      assert.equal(hasViewPermission('grower', 'users-management'), false);
    });
  });

  describe('Rol: cooling (Operador de Frío)', () => {
    it('debe gestionar produce-cooling pero no alterar liquidaciones financieras', () => {
      assert.equal(hasViewPermission('cooling', 'produce-cooling'), true);
      assert.equal(hasWritePermission('cooling', 'produce-cooling'), true);
      assert.equal(hasWritePermission('cooling', 'settlements'), false);
      assert.equal(hasViewPermission('cooling', 'grower'), false);
    });
  });

  describe('Depuración de Portales Obsoletos', () => {
    it('no debe permitir PFW2 (Portal Productor) ni R07 (Visitas Agrónomo)', () => {
      assert.equal(isModuleAllowed('PFW2', 'admin'), false);
      assert.equal(isModuleAllowed('PFW2', 'grower'), false);
      assert.equal(isModuleAllowed('R07', 'admin'), false);
      assert.equal(isModuleAllowed('R07', 'grower'), false);
    });
  });

  describe('Exclusividad de Produce First para Rol Admin', () => {
    it('solo admin debe tener permiso de vista en produce-first; ningún otro rol puede verlo', () => {
      assert.equal(hasViewPermission('admin', 'produce-first'), true, 'admin debe poder ver produce-first');
      assert.equal(hasViewPermission('comercial', 'produce-first'), false, 'comercial NO debe ver produce-first');
      assert.equal(hasViewPermission('cooling', 'produce-first'), false, 'cooling NO debe ver produce-first');
      assert.equal(hasViewPermission('grower', 'produce-first'), false, 'grower NO debe ver produce-first');
      assert.equal(hasViewPermission('customer', 'produce-first'), false, 'customer NO debe ver produce-first');
    });

    it('los submódulos internos de Produce First solo están permitidos para admin en modules.config', () => {
      const internalPfModules = ['GRP1', 'PF1', 'PF2', 'PF3', 'PF4', 'PF5', 'PF6', 'PFLQC', 'PFOC', 'PFMAT', 'PF7', 'PF8', 'PF10', 'PF9', 'PFBAN', 'PFNOM', 'PFCONT', 'PFREG', 'PFDASH', 'PFUSR'];
      for (const modId of internalPfModules) {
        assert.equal(isModuleAllowed(modId, 'admin'), true, `admin debe acceder a ${modId}`);
        assert.equal(isModuleAllowed(modId, 'comercial'), false, `comercial NO debe acceder a ${modId}`);
        assert.equal(isModuleAllowed(modId, 'cooling'), false, `cooling NO debe acceder a ${modId}`);
        assert.equal(isModuleAllowed(modId, 'grower'), false, `grower NO debe acceder a ${modId}`);
        assert.equal(isModuleAllowed(modId, 'customer'), false, `customer NO debe acceder a ${modId}`);
      }
    });
  });
});
