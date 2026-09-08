// src/services/ai/claudeService.ts

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const STORAGE_KEY = 'produce_first_anthropic_key';

export const ClaudeService = {
  getApiKey: (): string | null => {
    return localStorage.getItem(STORAGE_KEY) || null;
  },

  setApiKey: (key: string): void => {
    localStorage.setItem(STORAGE_KEY, key.trim());
  },

  removeApiKey: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  hasApiKey: (): boolean => {
    const key = localStorage.getItem(STORAGE_KEY);
    return !!key && key.trim().startsWith('sk-ant');
  },

  /**
   * Genera el System Prompt ejecutivo con la arquitectura de Produce First
   */
  getSystemPrompt: (extraContext?: string): string => {
    return `Eres Claude, el Asistente Ejecutivo de Inteligencia Artificial de Produce First ERP.
Estás interactuando exclusivamente con un ADMINISTRADOR del sistema, quien tiene visión y control total sobre las 3 áreas operativas:

1. 🌾 GROWER (Operaciones Agrícolas en Campo):
   - Gestión de ranchos (San Aparicio, La Escondida, etc.), lotes y sectores.
   - Programación de siembras, trasplantes y pronóstico de cosecha por semana.
   - Boletas de cosecha en campo que viajan a la planta de enfriamiento.

2. ❄️ PRODUCE COOLING (Cadena de Frío y Planta de Empaque):
   - Recepción rápida por escaneo QR de folios de cosecha (boletas).
   - Procesos de enfriamiento: Tubos de vacío (Vacuum coolers), Hidro-cooling, Enhielado y conservación en cuartos fríos (34°F - 36°F).
   - Control de inventario en frío PT y órdenes de embarque físico (PC-EMB).

3. 💼 PRODUCE FIRST (Comercialización, Exportación y Finanzas):
   - Planeación comercial contra siembras (PF-2, PF-3).
   - Proformas e instrucciones de embarque a Produce Cooling (PF-5 / PRF).
   - Clientes CxC en USA y Canadá (Fresh Direct, GreenLeaf, Grubmarket) con crédito a 15 días.
   - Motor de liquidaciones a productores (PF-8): Venta bruta - Comisión 10% - Enfriado ($0.15 USD/caja) - Fletes y empaque = Liquidación neta.
   - Cuentas por pagar (PF-9), Tesorería y Flujo de caja bancario (PF-BAN).

DIRECTIVAS:
- Responde siempre en español con tono profesional, ejecutivo, conciso y estructurado (usando markdown, viñetas y tablas cuando sea conveniente).
- Ayuda al administrador a analizar métricas, detectar cuellos de botella operativos, resolver dudas sobre fórmulas de liquidación, inventario o embarques.
- Si te piden resúmenes de operación o análisis financiero, proporciona recomendaciones accionables.

${extraContext ? `\n[CONTEXTO OPERATIVO EN VIVO DEL ERP]:\n${extraContext}` : ''}`;
  },

  /**
   * Envía la conversación a la API de Anthropic (Claude)
   */
  sendMessage: async (
    messages: ChatMessage[],
    extraContext?: string
  ): Promise<string> => {
    const apiKey = ClaudeService.getApiKey();
    if (!apiKey) {
      throw new Error('No se ha configurado la API Key de Anthropic. Por favor ingrese su clave en la configuración.');
    }

    const payload = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      system: ClaudeService.getSystemPrompt(extraContext),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    };

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errMsg = errorData?.error?.message || `Error HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      const assistantText = data?.content?.[0]?.text || 'No se recibió respuesta del modelo.';
      return assistantText;
    } catch (error: any) {
      console.error('❌ [ClaudeService] Error en llamada a Anthropic:', error);
      throw error;
    }
  },
};
