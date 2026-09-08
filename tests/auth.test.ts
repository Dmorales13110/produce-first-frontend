import { describe, it } from 'node:test';
import assert from 'node:assert';

// Mock simple de localStorage y window para el entorno de test Node.js
const mockStorage: Record<string, string> = {};

(global as any).localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

let eventFired = false;
(global as any).window = {
  dispatchEvent: (event: any) => {
    if (event?.type === 'auth:unauthorized') {
      eventFired = true;
    }
  },
  location: {
    pathname: '/dashboard',
    href: '',
    replace: (url: string) => { (global as any).window.location.href = url; }
  }
};
(global as any).Event = class Event {
  type: string;
  constructor(type: string) { this.type = type; }
};

// Helper para crear JWT simulado con fecha exp específica
function createMockJwt(expTimestampSeconds: number): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({
    id: 'user-123',
    email: 'test@producefirst.com',
    role: 'admin',
    exp: expTimestampSeconds
  })).toString('base64');
  const signature = 'mockSignature';
  return `${header}.${payload}.${signature}`;
}

describe('Auth & Session Expiration Suite', () => {

  it('debe detectar que un token sin valor o nulo está expirado', async () => {
    const { AuthService } = await import('../src/services/auth/index.js');
    assert.strictEqual(AuthService.isTokenExpired(null), true);
    assert.strictEqual(AuthService.isTokenExpired(undefined), true);
    assert.strictEqual(AuthService.isTokenExpired(''), true);
  });

  it('debe validar que los tokens demo nunca expiran', async () => {
    const { AuthService } = await import('../src/services/auth/index.js');
    assert.strictEqual(AuthService.isTokenExpired('demo-jwt-token-admin'), false);
    assert.strictEqual(AuthService.isTokenExpired('demo-jwt-token-customer'), false);
    assert.strictEqual(AuthService.isTokenExpired('demo-jwt-token-grower'), false);
  });

  it('debe detectar correctamente un token JWT expirado en el pasado', async () => {
    const { AuthService } = await import('../src/services/auth/index.js');
    // Expiró hace 1 hora
    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    const expiredToken = createMockJwt(pastExp);

    assert.strictEqual(AuthService.isTokenExpired(expiredToken), true);
  });

  it('debe validar un token JWT con vigencia activa en el futuro', async () => {
    const { AuthService } = await import('../src/services/auth/index.js');
    // Expira en 2 horas
    const futureExp = Math.floor(Date.now() / 1000) + 7200;
    const validToken = createMockJwt(futureExp);

    assert.strictEqual(AuthService.isTokenExpired(validToken), false);
  });

  it('debe limpiar las claves de sesión y emitir evento auth:unauthorized con clearSession', async () => {
    const { AuthService } = await import('../src/services/auth/index.js');
    localStorage.setItem('produce_first_token', 'sample-token');
    localStorage.setItem('produce_first_refresh_token', 'sample-refresh');
    localStorage.setItem('produce_first_user', JSON.stringify({ name: 'Admin' }));
    eventFired = false;

    AuthService.clearSession();

    assert.strictEqual(localStorage.getItem('produce_first_token'), null);
    assert.strictEqual(localStorage.getItem('produce_first_refresh_token'), null);
    assert.strictEqual(localStorage.getItem('produce_first_user'), null);
    assert.strictEqual(eventFired, true);
  });

  it('isAuthenticated debe devolver false y limpiar sesión automáticamente si el token está vencido', async () => {
    const { AuthService } = await import('../src/services/auth/index.js');
    const pastExp = Math.floor(Date.now() / 1000) - 60;
    const expiredToken = createMockJwt(pastExp);

    localStorage.setItem('produce_first_token', expiredToken);
    localStorage.setItem('produce_first_user', JSON.stringify({ name: 'Expirado' }));

    const authenticated = AuthService.isAuthenticated();

    assert.strictEqual(authenticated, false);
    assert.strictEqual(localStorage.getItem('produce_first_token'), null);
  });
});
