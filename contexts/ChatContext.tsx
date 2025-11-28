/**
 * Chat Context
 * Sistema de chat global entre todos los roles
 */

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '@/data/mockData';
import { useAuth } from './AuthContext';

export interface ChatMessage {
  id: string;
  projectId?: string;
  senderId: string;
  senderName: string;
  senderRole: 'designer' | 'client' | 'operator' | 'production';
  recipientId?: string; // Si es null, es mensaje grupal del proyecto
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface ChatRoom {
  id: string;
  projectId: string;
  projectName: string;
  participants: {
    id: string;
    name: string;
    role: 'designer' | 'client' | 'operator' | 'production';
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

interface ChatContextType {
  messages: ChatMessage[];
  chatRooms: ChatRoom[];
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => void;
  markMessageAsRead: (messageId: string) => void;
  getProjectMessages: (projectId: string) => ChatMessage[];
  getUnreadCount: (userId: string) => number;
  createChatRoom: (room: Omit<ChatRoom, 'id' | 'unreadCount'>) => void;
  normalizeAllMessages: () => void;
  isLoaded: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

// Mensajes de ejemplo iniciales
const initialMessages: ChatMessage[] = [
  // Proyecto p1 - Comunicación Cliente → Diseñador
  {
    id: 'm1',
    projectId: 'p1',
    senderId: 'u2',
    senderName: 'Renzo Cliente',
    senderRole: 'client',
    content: 'El diseño se ve sólido, pero necesitamos validar resistencia a sismos zona 4.',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 días atrás
    read: true,
  },
  {
    id: 'm2',
    projectId: 'p1',
    senderId: 'u1',
    senderName: 'Yardy Diseñador',
    senderRole: 'designer',
    content: 'Entendido. He realizado el análisis FEM con cargas sísmicas. El factor de seguridad cumple norma E.090.',
    timestamp: new Date(Date.now() - 86400000 * 3 + 3600000 * 4).toISOString(),
    read: true,
  },
  // Diseñador → Producción
  {
    id: 'm3',
    projectId: 'p1',
    senderId: 'u4',
    senderName: 'Stephano Centeno',
    senderRole: 'production',
    content: 'He revisado el diseño actualizado. Podemos iniciar fabricación la próxima semana. ¿Cliente aprueba?',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 días atrás
    read: true,
  },
  {
    id: 'm4',
    projectId: 'p1',
    senderId: 'u2',
    senderName: 'Renzo Cliente',
    senderRole: 'client',
    content: 'Perfecto, aprobado. Pueden proceder con la fabricación.',
    timestamp: new Date(Date.now() - 86400000 * 2 + 3600000 * 2).toISOString(),
    read: true,
  },
  // Producción → Operador
  {
    id: 'm5',
    projectId: 'p1',
    senderId: 'u3',
    senderName: 'Angelo Operador',
    senderRole: 'operator',
    content: 'He recibido la orden WO-HSE2024-001. Comenzamos mañana con la base de montaje.',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
    read: true,
  },
  {
    id: 'm6',
    projectId: 'p1',
    senderId: 'u3',
    senderName: 'Angelo Operador',
    senderRole: 'operator',
    content: 'Reporte de avance: Base verificada, columnas instaladas. Todo según especificaciones. 60% completado.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 horas atrás
    read: false,
  },

  // Proyecto p2 - Operador reporta problema → Diseñador
  {
    id: 'm7',
    projectId: 'p2',
    senderId: 'u3',
    senderName: 'Angelo Operador',
    senderRole: 'operator',
    content: 'El ángulo de descarga en la zona B está muy cerrado para el montaje. ¿Podemos ajustarlo a 35°?',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 días atrás
    read: true,
  },
  {
    id: 'm8',
    projectId: 'p2',
    senderId: 'u1',
    senderName: 'Yardy Diseñador',
    senderRole: 'designer',
    content: 'Buena observación Angelo. He ajustado el ángulo a 35° y actualizado el modelo CAD.',
    timestamp: new Date(Date.now() - 86400000 * 4 + 3600000 * 3).toISOString(),
    read: true,
  },
  // Diseñador → Producción (cambio afecta materiales)
  {
    id: 'm9',
    projectId: 'p2',
    senderId: 'u4',
    senderName: 'Stephano Centeno',
    senderRole: 'production',
    content: 'El cambio de ángulo afecta el material. Necesitamos 2 planchas adicionales de 6mm.',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    read: true,
  },
  {
    id: 'm10',
    projectId: 'p2',
    senderId: 'u2',
    senderName: 'Renzo Cliente',
    senderRole: 'client',
    content: 'Aprobado el cambio. La funcionalidad es más importante. Proceder con las planchas adicionales.',
    timestamp: new Date(Date.now() - 86400000 * 3 + 3600000 * 2).toISOString(),
    read: true,
  },
  // Cliente → Operador (comunicación directa)
  {
    id: 'm11',
    projectId: 'p2',
    senderId: 'u2',
    senderName: 'Renzo Cliente',
    senderRole: 'client',
    content: 'Angelo, gracias por detectar el problema. Me gustaría revisar el avance en persona la próxima semana.',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    read: true,
  },
  {
    id: 'm12',
    projectId: 'p2',
    senderId: 'u3',
    senderName: 'Angelo Operador',
    senderRole: 'operator',
    content: 'Perfecto Renzo, estaré disponible. Coordino con Yardy para preparar la presentación del avance.',
    timestamp: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
    read: true,
  },
];

const initialChatRooms: ChatRoom[] = [
  {
    id: 'cr1',
    projectId: 'p1',
    projectName: 'Motor Industrial V3',
    participants: [
      { id: 'u1', name: 'Yardy Diseñador', role: 'designer' },
      { id: 'u2', name: 'Renzo Cliente', role: 'client' },
      { id: 'u3', name: 'Angelo Operador', role: 'operator' },
      { id: 'u4', name: 'Stephano Centeno', role: 'production' },
    ],
    unreadCount: 2,
  },
  {
    id: 'cr2',
    projectId: 'p2',
    projectName: 'Sistema Hidráulico B',
    participants: [
      { id: 'u1', name: 'Yardy Diseñador', role: 'designer' },
      { id: 'u2', name: 'Renzo Cliente', role: 'client' },
      { id: 'u3', name: 'Angelo Operador', role: 'operator' },
      { id: 'u4', name: 'Stephano Centeno', role: 'production' },
    ],
    unreadCount: 0,
  },
];

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(initialChatRooms);
  const [isLoaded, setIsLoaded] = useState(true); // Cambiar a true por defecto
  const { user } = useAuth();

  const normalizeMessages = (msgs: ChatMessage[]) => {
    return msgs.map(m => {
      if (!m.senderName || m.senderName === 'Usuario' || m.senderName === 'Desconocido') {
        const byId = mockUsers.find(u => u.id === m.senderId);
        const byRole = mockUsers.find(u => u.role === m.senderRole);
        return { ...m, senderName: byId?.name || byRole?.name || m.senderName || 'Sin Nombre' };
      }
      return m;
    });
  };

  const normalizeAllMessages = () => {
    setMessages(prev => {
      const normalized = normalizeMessages(prev);
      console.log('🛠️ [ChatContext] Normalización manual aplicada. Mensajes:', normalized.length);
      return normalized;
    });
  };

  // Cargar mensajes guardados al iniciar
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem('@chat_messages');
        if (savedMessages) {
          const parsed: ChatMessage[] = JSON.parse(savedMessages);
          console.log('📥 [ChatContext] Mensajes cargados desde storage:', parsed.length);
          setMessages(normalizeMessages(parsed));
        } else {
          console.log('📥 [ChatContext] No hay mensajes guardados, usando iniciales normalizados');
          setMessages(normalizeMessages(initialMessages));
        }
      } catch (error) {
        console.error('❌ [ChatContext] Error cargando mensajes:', error);
        setMessages(normalizeMessages(initialMessages));
      }
    };
    loadMessages();
  }, []);

  // Guardar mensajes cada vez que cambien
  useEffect(() => {
    if (isLoaded) {
      const saveMessages = async () => {
        try {
          await AsyncStorage.setItem('@chat_messages', JSON.stringify(messages));
           console.log('💾 [ChatContext] Mensajes guardados:', messages.length);
        } catch (error) {
          console.error('❌ [ChatContext] Error guardando mensajes:', error);
        }
      };
      saveMessages();
    }
  }, [messages, isLoaded]);

  const sendMessage = (message: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => {
    console.log('🟢 [ChatContext] sendMessage RECIBIDO:', message);

    // Normalizar el nombre del sender
    let senderName = message.senderName;
    console.log('🟢 [ChatContext] senderName original:', senderName);

    if (!senderName || senderName === 'Usuario' || senderName === 'Desconocido') {
      const byId = mockUsers.find(u => u.id === message.senderId);
      const byRole = mockUsers.find(u => u.role === message.senderRole);
      senderName = user?.name || byId?.name || byRole?.name || 'Sin Nombre';
      console.log('🟢 [ChatContext] senderName normalizado:', senderName);
    }

    const newMessage: ChatMessage = {
      ...message,
      senderName,
      id: `m${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    console.log('🟢 [ChatContext] Nuevo mensaje creado:', newMessage);
    console.log('🟢 [ChatContext] Estado de messages ANTES:', messages.length);

    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('🟢 [ChatContext] Estado de messages DESPUÉS:', updated.length);
      console.log('🟢 [ChatContext] Últimos 3 mensajes:', updated.slice(-3).map(m => ({id: m.id, content: m.content.substring(0, 20)})));
      return updated;
    });

    console.log('✅ [ChatContext] Mensaje guardado en estado');

    // Actualizar última mensaje en chat room
    if (message.projectId) {
      console.log('🟢 [ChatContext] Actualizando chat room para proyecto:', message.projectId);
      setChatRooms(prev =>
        prev.map(room =>
          room.projectId === message.projectId
            ? { ...room, lastMessage: newMessage, unreadCount: room.unreadCount + 1 }
            : room
        )
      );
    }
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === messageId ? { ...msg, read: true } : msg))
    );
  };

  const getProjectMessages = (projectId: string) => {
    console.log(`🔍 [ChatContext] getProjectMessages llamado para proyecto: "${projectId}"`);
    console.log(`🔍 [ChatContext] Total mensajes en contexto:`, messages.length);
    console.log(`🔍 [ChatContext] Primeros 5 projectIds:`, messages.slice(0, 5).map(m => m.projectId));

    const filtered = messages.filter(msg => {
      const match = msg.projectId === projectId;
      if (!match && messages.length < 20) {
        console.log(`🔍 [ChatContext] Mensaje "${msg.id}" no coincide: "${msg.projectId}" vs "${projectId}"`);
      }
      return match;
    });

    console.log(`🔍 [ChatContext] Mensajes filtrados para proyecto ${projectId}:`, filtered.length);
    if (filtered.length > 0) {
      console.log(`🔍 [ChatContext] Últimos 2 mensajes filtrados:`, filtered.slice(-2).map(m => ({
        id: m.id,
        sender: m.senderName,
        content: m.content.substring(0, 30)
      })));
    }

    return filtered;
  };

  const getUnreadCount = (userId: string) => {
    return messages.filter(msg => msg.recipientId === userId && !msg.read).length;
  };

  const createChatRoom = (room: Omit<ChatRoom, 'id' | 'unreadCount'>) => {
    const newRoom: ChatRoom = {
      ...room,
      id: `cr${Date.now()}`,
      unreadCount: 0,
    };
    setChatRooms(prev => [...prev, newRoom]);
  };

  const value = {
    messages,
    chatRooms,
    sendMessage,
    markMessageAsRead,
    getProjectMessages,
    getUnreadCount,
    createChatRoom,
    normalizeAllMessages,
    isLoaded,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
