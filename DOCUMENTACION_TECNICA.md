# 📚 DOCUMENTACIÓN TÉCNICA - Sistema 4 Usuarios

## 🏗️ Arquitectura Implementada

### Contextos Globales (State Management)

#### 1. AuthContext
**Ubicación:** `/contexts/AuthContext.tsx`

**Responsabilidades:**
- Autenticación de 4 usuarios
- Gestión de sesión
- Sistema de notificaciones
- Estado de notificaciones leídas/no leídas

**API:**
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  unreadCount: number;
}
```

**Usuarios configurados:**
```typescript
[
  { id: 'u1', email: 'yardy12@gmail.com', password: '123456', role: 'designer' },
  { id: 'u2', email: 'renzozv@gmail.com', password: 'r12345', role: 'client' },
  { id: 'u3', email: 'angelo77@gmail.com', password: 'a123456', role: 'operator' },
  { id: 'u4', email: 'steph12@gmail.com', password: 's12345', role: 'production' }
]
```

---

#### 2. ChatContext (NUEVO)
**Ubicación:** `/contexts/ChatContext.tsx`

**Responsabilidades:**
- Gestión de mensajes de chat
- Salas de chat por proyecto
- Historial de mensajes
- Estado de lectura de mensajes

**API:**
```typescript
interface ChatContextType {
  messages: ChatMessage[];
  chatRooms: ChatRoom[];
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => void;
  markMessageAsRead: (messageId: string) => void;
  getProjectMessages: (projectId: string) => ChatMessage[];
  getUnreadCount: (userId: string) => number;
  createChatRoom: (room: Omit<ChatRoom, 'id' | 'unreadCount'>) => void;
}
```

**Estructura de Mensaje:**
```typescript
interface ChatMessage {
  id: string;
  projectId?: string;
  senderId: string;
  senderName: string;
  senderRole: 'designer' | 'client' | 'operator' | 'production';
  recipientId?: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}
```

---

#### 3. AppContext
**Ubicación:** `/contexts/AppContext.tsx`

**Responsabilidades:**
- Gestión de proyectos
- Estados de proyecto
- Acciones de proyecto (aprobar, rechazar, compartir)

**API:**
```typescript
interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  selectedRole: User['role'] | null;
  setSelectedRole: (role: User['role'] | null) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProjectStatus: (projectId: string, status: string) => void;
  shareProjectWithClient: (projectId: string, clientId: string) => void;
  approveProject: (projectId: string) => void;
  rejectProject: (projectId: string, reason: string) => void;
}
```

**Estados de Proyecto:**
```typescript
type ProjectStatus = 
  | 'draft'           // Diseñador trabajando
  | 'pending_client'  // Esperando aprobación cliente
  | 'approved'        // Cliente aprobó
  | 'rejected'        // Cliente rechazó
  | 'in_assembly'     // Operador ensamblando
  | 'completed';      // Terminado
```

---

### Componentes Reutilizables

#### 1. ChatModal
**Ubicación:** `/components/molecules/ChatModal.tsx`

**Props:**
```typescript
interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
}
```

**Características:**
- Modal fullscreen con KeyboardAvoidingView
- Lista de mensajes con scroll automático
- Input de texto multilinea (max 500 chars)
- Identificación visual por rol (colores)
- Timestamps relativos
- Estado vacío personalizado

**Uso:**
```tsx
<ChatModal
  visible={showChat}
  onClose={() => setShowChat(false)}
  projectId="p1"
  projectName="Motor Industrial V3"
/>
```

---

#### 2. NotificationBadge
**Ubicación:** `/components/molecules/NotificationBadge.tsx`

**Props:**
```typescript
interface NotificationBadgeProps {
  count: number;
  onPress: () => void;
  size?: number;
  color?: string;
}
```

**Características:**
- Badge circular con contador
- Auto-oculta cuando count = 0
- Límite visual "99+"
- Personalizable (tamaño, color)

**Uso:**
```tsx
<NotificationBadge 
  count={unreadCount}
  onPress={() => setShowNotifications(true)}
  size={24}
  color={Colors.base.blackPrimary}
/>
```

---

### Vistas por Rol

#### 1. Cliente (`/app/client/projects.tsx`)

**Funcionalidades implementadas:**
- ✅ Ver proyectos compartidos (filtrados por `sharedProjects`)
- ✅ Visualizar en AR
- ✅ Aprobar proyecto → `approveProject(projectId)`
- ✅ Rechazar proyecto con razón → `rejectProject(projectId, reason)`
- ✅ Abrir chat por proyecto → `handleOpenChat(projectId)`
- ✅ Ver notificaciones → `notifications` from `useAuth()`
- ✅ Badge de contador → `NotificationBadge`

**Hooks utilizados:**
```typescript
const { notifications, markNotificationAsRead, unreadCount } = useAuth();
const { approveProject, rejectProject } = useApp();
```

**Acciones que generan notificaciones:**
- Aprobar proyecto → Notifica a Diseñador + Producción
- Rechazar proyecto → Notifica a Diseñador con motivo
- Enviar mensaje de chat → Notifica a participantes

---

#### 2. Producción (`/app/production/`)

**Dashboard (`dashboard.tsx`):**
- Métricas en tiempo real (órdenes pendientes, en progreso, completadas)
- Navegación a vista de proyectos
- Acceso a métricas detalladas
- Badge de notificaciones

**Projects (`projects.tsx`):**
- Lista completa de proyectos del sistema
- Filtros: Todos, Aprobados, En ensamblaje, Completados
- Asignar orden de trabajo → `handleAssignWorkOrder(projectId, projectName)`
- Chat por proyecto
- Badge de notificaciones

**Hooks utilizados:**
```typescript
const { unreadCount, addNotification } = useAuth();
const { chatRooms } = useChat();
```

**Acciones que generan notificaciones:**
- Asignar OT → Notifica a Operador + genera QR

---

#### 3. Operador (`/app/operator/work-orders.tsx`)

**Funcionalidades:**
- Lista de órdenes de trabajo asignadas
- Filtros: Todas, Pendientes, En progreso
- Badge de notificaciones
- Acciones rápidas (Escanear QR, Mis guías, Reportar)
- Navegación a guía de ensamblaje

**Hooks utilizados:**
```typescript
const { unreadCount } = useAuth();
```

**Recibe notificaciones de:**
- Órdenes de trabajo asignadas por Producción
- Mensajes de chat del proyecto

---

#### 4. Diseñador (`/app/designer/projects.tsx`)

**Funcionalidades preparadas:**
- Crear proyectos
- Importar archivos CAD
- Visualizar en AR
- (Estructura lista para) Compartir con cliente → Genera notificación

**Hooks preparados:**
```typescript
const { unreadCount, addNotification } = useAuth();
const { shareProjectWithClient } = useApp();
```

---

### Sistema de Notificaciones

#### Tipos de Notificaciones

```typescript
type NotificationType = 
  | 'project_shared'
  | 'project_approved'
  | 'project_rejected'
  | 'work_order_assigned'
  | 'work_order_completed'
  | 'comment_added'
  | 'chat_message';
```

#### Estructura de Notificación

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  projectId?: string;
  projectName?: string;
  fromUserId?: string;
  fromUserName?: string;
  timestamp: string;
  read: boolean;
}
```

#### Crear Notificación

```typescript
// Ejemplo: Asignar orden de trabajo
addNotification({
  userId: 'u3', // Angelo Operador
  type: 'work_order_assigned',
  title: 'Nueva Orden de Trabajo',
  message: `Se te ha asignado la orden ${woId} para el proyecto "${projectName}"`,
  projectId: projectId,
  projectName: projectName,
  fromUserId: 'u4', // Stephano Centeno
  fromUserName: 'Stephano Centeno',
});
```

---

### Flujo de Datos

#### 1. Aprobación de Proyecto

```typescript
// Cliente presiona APROBAR
handleApproveProject(projectId, projectName) {
  // 1. Actualizar estado del proyecto
  approveProject(projectId); // AppContext
  
  // 2. Notificar a Producción
  addNotification({
    userId: 'u4',
    type: 'project_approved',
    title: 'Proyecto Aprobado',
    message: `El cliente ha aprobado "${projectName}"`,
    projectId: projectId,
    projectName: projectName,
    fromUserId: 'u2',
    fromUserName: 'Renzo Cliente',
  });
  
  // 3. Mostrar confirmación
  Alert.alert('Proyecto Aprobado', 'Notificado al equipo de producción');
}
```

#### 2. Asignación de Orden de Trabajo

```typescript
// Producción asigna orden
handleAssignWorkOrder(projectId, projectName) {
  // 1. Crear orden de trabajo
  const woId = `WO-${Date.now()}`;
  
  // 2. Notificar a Operador
  addNotification({
    userId: 'u3', // Angelo
    type: 'work_order_assigned',
    title: 'Nueva Orden de Trabajo',
    message: `Se te ha asignado ${woId} para "${projectName}"`,
    projectId: projectId,
    projectName: projectName,
    fromUserId: 'u4', // Stephano
    fromUserName: 'Stephano Centeno',
  });
  
  // 3. Confirmar
  Alert.alert('Éxito', `Orden ${woId} creada y asignada`);
}
```

#### 3. Envío de Mensaje de Chat

```typescript
// Cualquier usuario envía mensaje
handleSendMessage() {
  const { sendMessage } = useChat();
  const { user } = useAuth();
  
  sendMessage({
    projectId: selectedProject,
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    content: messageText.trim(),
  });
  
  // El ChatContext automáticamente:
  // - Genera ID único
  // - Agrega timestamp
  // - Actualiza lastMessage en chatRoom
  // - Incrementa unreadCount
}
```

---

### Estilos y Diseño

#### Design System Usado

```typescript
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
```

#### Colores por Rol

```typescript
const getRoleColor = (role: string) => {
  switch (role) {
    case 'designer': return Colors.functional.info;      // Azul
    case 'client': return Colors.functional.success;     // Verde
    case 'operator': return Colors.functional.warning;   // Amarillo
    case 'production': return '#9333ea';                 // Morado
    default: return Colors.grays.dark;
  }
};
```

#### Estados de Proyecto

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'approved': return Colors.functional.success;   // Verde
    case 'in_progress': 
    case 'in_assembly': return Colors.functional.info;   // Azul
    case 'validation':
    case 'pending': return Colors.functional.warning;    // Amarillo
    case 'rejected': return Colors.functional.error;     // Rojo
    default: return Colors.grays.dark;
  }
};
```

---

### Testing

#### Flujo de Prueba Manual

1. **Login como Cliente**
   ```
   Email: renzozv@gmail.com
   Pass: r12345
   ```
   - Verificar proyectos compartidos
   - Presionar CHAT → Enviar mensaje
   - Presionar APROBAR → Verificar Alert

2. **Login como Producción**
   ```
   Email: steph12@gmail.com
   Pass: s12345
   ```
   - Verificar badge con 🔴 (1 notificación)
   - Ir a "Ver Proyectos"
   - Filtrar por "Aprobados"
   - Presionar ASIGNAR OT → Verificar Alert

3. **Login como Operador**
   ```
   Email: angelo77@gmail.com
   Pass: a123456
   ```
   - Verificar badge con 🔴 (1 notificación)
   - Presionar badge
   - Ver notificación "Nueva orden asignada"

---

### Limitaciones Actuales

#### Estado en Memoria
- ❌ Las notificaciones se pierden al recargar
- ❌ Los mensajes de chat se pierden al recargar
- ✅ Solución: Implementar AsyncStorage o backend

#### No hay Backend
- ❌ No hay persistencia real
- ❌ No hay sincronización entre dispositivos
- ✅ Solución: Implementar API REST o GraphQL

#### Chat Local
- ❌ No hay chat en tiempo real entre dispositivos
- ✅ Solución: Implementar WebSockets o Firebase Realtime

#### Credenciales Hardcodeadas
- ❌ No hay encriptación
- ❌ No hay recuperación de contraseña
- ✅ Solución: Implementar backend con JWT

---

### Próximas Mejoras Recomendadas

#### Corto Plazo
1. Persistir notificaciones con AsyncStorage
2. Persistir mensajes de chat con AsyncStorage
3. Agregar timestamps más descriptivos
4. Implementar búsqueda en chat

#### Mediano Plazo
1. Backend con API REST
2. Base de datos (PostgreSQL/MongoDB)
3. Autenticación con JWT
4. WebSockets para chat en tiempo real
5. Push notifications nativas

#### Largo Plazo
1. Subida real de archivos CAD
2. Conversión CAD a AR automática
3. Generación real de códigos QR
4. Analytics y reportes avanzados
5. Modo offline con sincronización

---

### Comandos Útiles

```bash
# Iniciar desarrollo
npm start

# Limpiar cache
npm start -- --clear

# Verificar tipos TypeScript
npx tsc --noEmit

# Ver errores ESLint
npx eslint .

# Instalar dependencias
npm install

# Actualizar Expo
npx expo upgrade
```

---

### Archivos de Documentación

- `/SISTEMA_4_USUARIOS.md` - Documentación completa del sistema
- `/IMPLEMENTACION_COMPLETADA.md` - Resumen ejecutivo
- `/GUIA_RAPIDA.md` - Guía de uso rápida
- `/DOCUMENTACION_TECNICA.md` - Este archivo

---

**Última actualización:** 25 de Noviembre, 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Producción Ready (Mock Data)

