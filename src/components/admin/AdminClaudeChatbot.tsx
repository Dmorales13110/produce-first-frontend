// src/components/admin/AdminClaudeChatbot.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClaudeService, type ChatMessage } from '../../services/ai/claudeService';
import {
  Affix,
  Button,
  Drawer,
  Stack,
  Group,
  Text,
  Paper,
  ScrollArea,
  TextInput,
  PasswordInput,
  ActionIcon,
  Badge,
  ThemeIcon,
  Tooltip,
  Alert,
  Loader,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconSparkles,
  IconSend,
  IconKey,
  IconTrash,
  IconRobot,
  IconUser,
  IconInfoCircle,
  IconCheck,
  IconAlertCircle,
  IconRefresh,
} from '@tabler/icons-react';

export function AdminClaudeChatbot() {
  const { user } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);

  // Solo administradores tienen acceso
  if (user?.role !== 'admin') {
    return null;
  }

  const [apiKey, setApiKey] = useState<string>('');
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isConfiguringKey, setIsConfiguringKey] = useState<boolean>(false);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy Claude, tu asistente ejecutivo para Produce First ERP. Como administrador, tienes control total sobre Grower, Produce Cooling y Produce First. ¿En qué puedo apoyarte hoy con los datos de campo, frío, finanzas o embarques?',
      timestamp: 'Ahora',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingKey = ClaudeService.getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
      setHasKey(true);
    } else {
      setHasKey(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSaveKey = () => {
    if (!apiKey.trim().startsWith('sk-ant')) {
      notifications.show({
        title: 'Formato Inválido',
        message: 'La clave de Anthropic debe comenzar con "sk-ant-...".',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    ClaudeService.setApiKey(apiKey);
    setHasKey(true);
    setIsConfiguringKey(false);
    notifications.show({
      title: 'Clave Guardada',
      message: 'Tu clave de Claude ha sido configurada localmente.',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
  };

  const handleRemoveKey = () => {
    ClaudeService.removeApiKey();
    setApiKey('');
    setHasKey(false);
    setIsConfiguringKey(true);
    notifications.show({
      title: 'Clave Removida',
      message: 'Se ha eliminado la clave de Claude de tu navegador.',
      color: 'blue',
    });
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || isLoading) return;

    if (!hasKey) {
      setIsConfiguringKey(true);
      notifications.show({
        title: 'Credencial Requerida',
        message: 'Por favor ingresa tu clave de Anthropic (Claude) para comenzar.',
        color: 'yellow',
      });
      return;
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    // Recopilación de contexto operativo en vivo
    const contextSummary = `
- Administrador actual: ${user.name || user.email}
- Acceso: Visualización total de 3 áreas (Grower, Produce Cooling, Produce First)
- Estatus Operativo Clave:
  * Produce Cooling: Planta activa a 34°F, recepción continua por escaneo QR.
  * Produce First: Proformas emitidas para Fresh Direct, GreenLeaf y Grubmarket. Términos a 15 días.
  * Motor de Liquidaciones: Comisión pactada al 10% + tarifa de enfriamiento $0.15 USD/caja.
  * Bancos y Tesorería: Flujo proyectado positivo para las próximas 4 semanas.
`;

    try {
      const reply = await ClaudeService.sendMessage(newHistory, contextSummary);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      notifications.show({
        title: 'Error de Claude API',
        message: err.message || 'No se pudo conectar con el modelo Claude de Anthropic.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      const errorAssistantMsg: ChatMessage = {
        role: 'assistant',
        content: `⚠️ Ocurrió un error al contactar a Claude: ${err.message || 'Error de conexión'}. Verifica que tu API key de Anthropic tenga créditos disponibles y permisos válidos.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorAssistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '📊 Resumen ejecutivo de las 3 áreas operativas hoy',
    '💵 Proyección de flujo de efectivo y cobranza',
    '🚛 Estatus de camiones en tránsito a Produce Cooling',
    '📝 Resumen de liquidaciones a productores y comisión 10%',
  ];

  return (
    <>
      {/* BOTÓN FLOTANTE EXCLUSIVO PARA ADMINISTRADORES */}
      <Affix position={{ bottom: 24, right: 24 }} zIndex={1000}>
        <Button
          onClick={open}
          size="md"
          radius="xl"
          leftSection={
            <ThemeIcon size="sm" radius="xl" color="violet" variant="filled">
              <IconSparkles size={14} />
            </ThemeIcon>
          }
          style={{
            backgroundColor: '#1E1B4B',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(30, 27, 75, 0.35)',
            border: '1px solid #4338CA',
            fontWeight: 700,
          }}
        >
          Claude AI · Admin Assistant
        </Button>
      </Affix>

      {/* DRAWER / PANEL LATERAL DEL ASISTENTE */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="md"
        padding="md"
        title={
          <Group gap="xs">
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
              <IconSparkles size={20} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="15px" fw={800} c="#1E1B4B">
                Claude AI · Asistente Ejecutivo
              </Text>
              <Text size="10px" c="dimmed">
                Exclusivo para Administradores · Produce First ERP
              </Text>
            </Stack>
          </Group>
        }
      >
        <Stack gap="sm" style={{ height: 'calc(100vh - 85px)', display: 'flex' }}>

          {/* BARRA DE ESTADO DE CLAVE */}
          <Paper p="xs" radius="md" withBorder style={{ backgroundColor: '#F8FAFC' }}>
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <IconKey size={16} color={hasKey ? '#16A34A' : '#D97706'} />
                <Text size="xs" fw={600} c="#334155">
                  Credencial Anthropic:
                </Text>
                <Badge size="xs" color={hasKey ? 'green' : 'yellow'} variant="light">
                  {hasKey ? 'Configurada ✓' : 'Pendiente'}
                </Badge>
              </Group>

              <Group gap={4}>
                <Button
                  size="compact-xs"
                  variant="subtle"
                  color="blue"
                  onClick={() => setIsConfiguringKey(!isConfiguringKey)}
                >
                  {isConfiguringKey ? 'Ocultar' : 'Configurar'}
                </Button>
                {hasKey && (
                  <Tooltip label="Eliminar clave">
                    <ActionIcon size="xs" color="red" variant="subtle" onClick={handleRemoveKey}>
                      <IconTrash size={12} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            </Group>

            {/* FORMULARIO DE CLAVE */}
            {isConfiguringKey && (
              <Stack gap="xs" mt="xs">
                <Divider />
                <Text size="11px" c="dimmed">
                  Tu API Key de Anthropic se guarda exclusivamente en tu navegador (localStorage) y se conecta directo con Claude.
                </Text>
                <PasswordInput
                  size="xs"
                  placeholder="sk-ant-api03-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.currentTarget.value)}
                />
                <Group justify="flex-end" gap="xs">
                  <Button size="xs" color="violet" onClick={handleSaveKey}>
                    Guardar Clave
                  </Button>
                </Group>
              </Stack>
            )}
          </Paper>

          {/* CHIPS DE PROMPTS RÁPIDOS */}
          <ScrollArea type="never">
            <Group gap={6} wrap="nowrap">
              {quickPrompts.map((p, idx) => (
                <Button
                  key={idx}
                  size="compact-xs"
                  variant="light"
                  color="indigo"
                  radius="xl"
                  style={{ whiteSpace: 'nowrap', fontSize: '10px' }}
                  onClick={() => handleSendMessage(p)}
                  disabled={isLoading}
                >
                  {p}
                </Button>
              ))}
            </Group>
          </ScrollArea>

          {/* HISTORIAL DE MENSAJES */}
          <Paper
            p="sm"
            radius="md"
            withBorder
            style={{
              flex: 1,
              backgroundColor: '#FAFAFA',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ScrollArea style={{ flex: 1 }} p="xs">
              <Stack gap="sm">
                {messages.map((msg, idx) => (
                  <Group
                    key={idx}
                    align="flex-start"
                    gap="xs"
                    justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                  >
                    {msg.role === 'assistant' && (
                      <ThemeIcon size="sm" radius="xl" color="violet" variant="light" style={{ marginTop: 4 }}>
                        <IconRobot size={14} />
                      </ThemeIcon>
                    )}

                    <Paper
                      p="xs"
                      radius="md"
                      style={{
                        maxWidth: '85%',
                        backgroundColor: msg.role === 'user' ? '#1E1B4B' : '#FFFFFF',
                        color: msg.role === 'user' ? '#FFFFFF' : '#1E293B',
                        border: msg.role === 'assistant' ? '1px solid #E2E8F0' : undefined,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Text size="xs" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {msg.content}
                      </Text>
                      {msg.timestamp && (
                        <Text
                          size="9px"
                          c={msg.role === 'user' ? 'gray.4' : 'dimmed'}
                          ta="right"
                          mt={4}
                        >
                          {msg.timestamp}
                        </Text>
                      )}
                    </Paper>

                    {msg.role === 'user' && (
                      <ThemeIcon size="sm" radius="xl" color="dark" variant="light" style={{ marginTop: 4 }}>
                        <IconUser size={14} />
                      </ThemeIcon>
                    )}
                  </Group>
                ))}

                {isLoading && (
                  <Group gap="xs" align="center">
                    <ThemeIcon size="sm" radius="xl" color="violet" variant="light">
                      <IconRobot size={14} />
                    </ThemeIcon>
                    <Paper p="xs" radius="md" withBorder style={{ backgroundColor: '#FFFFFF' }}>
                      <Group gap="xs">
                        <Loader size="xs" color="violet" type="dots" />
                        <Text size="xs" c="dimmed">
                          Claude está analizando la operación del ERP...
                        </Text>
                      </Group>
                    </Paper>
                  </Group>
                )}

                <div ref={messagesEndRef} />
              </Stack>
            </ScrollArea>
          </Paper>

          {/* INPUT DE MENSAJE */}
          <Paper p="xs" radius="md" withBorder style={{ backgroundColor: '#FFFFFF' }}>
            <Group gap="xs">
              <TextInput
                placeholder={hasKey ? 'Pregunta a Claude sobre Grower, Cooling o Produce First...' : 'Configure su API key primero...'}
                size="xs"
                style={{ flex: 1 }}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <ActionIcon
                size="md"
                color="violet"
                variant="filled"
                onClick={() => handleSendMessage()}
                loading={isLoading}
                disabled={!inputMessage.trim()}
              >
                <IconSend size={16} />
              </ActionIcon>
            </Group>
          </Paper>

        </Stack>
      </Drawer>
    </>
  );
}
