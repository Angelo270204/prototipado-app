/**
 * Mock Data para DTP-AR
 * Datos de ejemplo coherentes con manufactura en Áncash y Chimbote
 */

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'pending' | 'in_progress' | 'validation' | 'approved' | 'completed';
  progress: number;
  cadFile?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  parts: number;
  validationRequired: boolean;
  // Roles con los que se comparte este proyecto (opcional)
  sharedRoles?: ('designer' | 'client' | 'operator' | 'production')[];
}

export interface WorkOrder {
  id: string;
  projectId: string;
  projectName: string;
  operatorId?: string;
  operatorName?: string;
  priority: 'high' | 'medium' | 'low' | 'normal';
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  progress: number;
  startDate?: string;
  dueDate: string;
  completedSteps: number;
  totalSteps: number;
  qrCode: string;
}

export interface AssemblyStep {
  id: string;
  workOrderId: string;
  stepNumber: number;
  title: string;
  description: string;
  modelUrl?: string;
  completed: boolean;
  verificationRequired: boolean;
  estimatedTime: number; // en minutos
  tools: string[];
  warnings?: string[];
}

export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userRole: 'designer' | 'client' | 'operator' | 'production';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'designer' | 'client' | 'operator' | 'production';
  avatar?: string;
  company?: string;
}

// MOCK USERS
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Yardy Diseñador',
    email: 'yardy12@gmail.com',
    role: 'designer',
    company: 'Sider Perú',
  },
  {
    id: 'u2',
    name: 'Renzo Cliente',
    email: 'renzozv@gmail.com',
    role: 'client',
    company: 'Minera Áncash',
  },
  {
    id: 'u3',
    name: 'Angelo Operador',
    email: 'angelo77@gmail.com',
    role: 'operator',
    company: 'Sider Perú',
  },
  {
    id: 'u4',
    name: 'Stephano Centeno',
    email: 'steph12@gmail.com',
    role: 'production',
    company: 'Sider Perú',
  },
];

// MOCK PROJECTS
export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Estructura de Soporte HSE-2024',
    client: 'Minera Áncash',
    status: 'validation',
    progress: 75,
    thumbnail: '',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-15',
    parts: 12,
    validationRequired: true,
    sharedRoles: ['designer', 'client', 'operator', 'production'],
  },
  {
    id: 'p2',
    name: 'Prototipo Chute Transferencia',
    client: 'Sider Perú',
    status: 'in_progress',
    progress: 45,
    thumbnail: '',
    createdAt: '2025-01-08',
    updatedAt: '2025-01-14',
    parts: 8,
    validationRequired: true,
    sharedRoles: ['designer', 'client', 'operator', 'production'],
  },
  {
    id: 'p3',
    name: 'Sistema de Anclaje Modular',
    client: 'Construcciones del Norte',
    status: 'approved',
    progress: 100,
    thumbnail: '',
    createdAt: '2025-01-05',
    updatedAt: '2025-01-12',
    parts: 15,
    validationRequired: false,
    sharedRoles: ['designer', 'client', 'operator', 'production'],
  },
  {
    id: 'p4',
    name: 'Bastidor de Maquinaria Pesada',
    client: 'Minera Chimbote S.A.',
    status: 'pending',
    progress: 10,
    thumbnail: '',
    createdAt: '2025-01-12',
    updatedAt: '2025-01-12',
    parts: 20,
    validationRequired: true,
    sharedRoles: ['designer', 'client'],
  },
];

// MOCK WORK ORDERS
export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo1',
    projectId: 'p1',
    projectName: 'Estructura de Soporte HSE-2024',
    operatorId: 'u3',
    operatorName: 'Roberto Castillo',
    priority: 'high',
    status: 'in_progress',
    progress: 60,
    startDate: '2024-01-18',
    dueDate: '2024-01-25',
    completedSteps: 6,
    totalSteps: 10,
    qrCode: 'WO-HSE2024-001',
  },
  {
    id: 'wo2',
    projectId: 'p2',
    projectName: 'Prototipo Chute Transferencia',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    dueDate: '2024-01-30',
    completedSteps: 0,
    totalSteps: 8,
    qrCode: 'WO-CHUTE-002',
  },
  {
    id: 'wo3',
    projectId: 'p3',
    projectName: 'Sistema de Anclaje Modular',
    operatorId: 'u3',
    operatorName: 'Roberto Castillo',
    priority: 'normal',
    status: 'completed',
    progress: 100,
    startDate: '2024-01-12',
    dueDate: '2024-01-20',
    completedSteps: 12,
    totalSteps: 12,
    qrCode: 'WO-ANCLAJE-003',
  },
  {
    id: 'wo4',
    projectId: 'p4',
    projectName: 'Bastidor de Maquinaria Pesada',
    priority: 'high',
    status: 'pending',
    progress: 0,
    dueDate: '2024-02-05',
    completedSteps: 0,
    totalSteps: 15,
    qrCode: 'WO-BASTIDOR-004',
  },
];

// MOCK ASSEMBLY STEPS
export const mockAssemblySteps: AssemblyStep[] = [
  {
    id: 's1',
    workOrderId: 'wo1',
    stepNumber: 1,
    title: 'Verificación de base de montaje',
    description: 'Inspeccionar placa base y verificar nivelación según especificaciones técnicas.',
    completed: true,
    verificationRequired: true,
    estimatedTime: 15,
    tools: ['Nivel láser', 'Calibrador', 'Escuadra metálica'],
  },
  {
    id: 's2',
    workOrderId: 'wo1',
    stepNumber: 2,
    title: 'Instalación de columnas verticales',
    description: 'Montar las 4 columnas principales asegurando verticalidad y espaciamiento correcto.',
    completed: true,
    verificationRequired: true,
    estimatedTime: 30,
    tools: ['Grúa', 'Nivel', 'Llave torquimétrica', 'EPP altura'],
    warnings: ['Uso obligatorio de arnés', 'Zona restringida durante montaje'],
  },
  {
    id: 's3',
    workOrderId: 'wo1',
    stepNumber: 3,
    title: 'Anclaje de vigas horizontales',
    description: 'Instalar vigas tipo IPE-200 siguiendo patrón de diseño aprobado.',
    completed: true,
    verificationRequired: false,
    estimatedTime: 45,
    tools: ['Llave de impacto', 'Taladro', 'Pernos grado 8.8'],
  },
  {
    id: 's4',
    workOrderId: 'wo1',
    stepNumber: 4,
    title: 'Soldadura de refuerzos estructurales',
    description: 'Aplicar cordones de soldadura MIG en puntos críticos según plano de detalle.',
    completed: false,
    verificationRequired: true,
    estimatedTime: 60,
    tools: ['Soldadora MIG', 'Máscara de soldar', 'Amoladora'],
    warnings: ['Área de soldadura señalizada', 'Extractor de humos activo'],
  },
  {
    id: 's5',
    workOrderId: 'wo1',
    stepNumber: 5,
    title: 'Instalación de sistema de arriostramiento',
    description: 'Colocar diagonales de arriostramiento para estabilidad lateral.',
    completed: false,
    verificationRequired: true,
    estimatedTime: 40,
    tools: ['Llave torquimétrica', 'Medidor de ángulos', 'Tensor de cables'],
  },
];

// MOCK COMMENTS
export const mockComments: Comment[] = [
  // Proyecto p1 - Estructura de Soporte HSE-2024
  {
    id: 'c1',
    projectId: 'p1',
    userId: 'u2',
    userName: 'Renzo Cliente',
    userRole: 'client',
    content: 'El diseño se ve sólido, pero necesitamos validar resistencia a sismos zona 4.',
    timestamp: '2025-01-15T10:30:00Z',
  },
  {
    id: 'c2',
    projectId: 'p1',
    userId: 'u1',
    userName: 'Yardy Diseñador',
    userRole: 'designer',
    content: 'Entendido. Adjunto análisis FEM con cargas sísmicas actualizadas. El factor de seguridad cumple con norma E.090.',
    timestamp: '2025-01-15T14:15:00Z',
  },
  {
    id: 'c3',
    projectId: 'p1',
    userId: 'u4',
    userName: 'Stephano Centeno',
    userRole: 'production',
    content: 'He revisado el diseño. Podemos iniciar la fabricación la próxima semana. Necesitamos confirmación del cliente.',
    timestamp: '2025-01-16T09:00:00Z',
  },
  {
    id: 'c4',
    projectId: 'p1',
    userId: 'u2',
    userName: 'Renzo Cliente',
    userRole: 'client',
    content: 'Perfecto, aprobado. Pueden proceder con la fabricación.',
    timestamp: '2025-01-16T10:45:00Z',
  },
  {
    id: 'c5',
    projectId: 'p1',
    userId: 'u3',
    userName: 'Angelo Operador',
    userRole: 'operator',
    content: 'He recibido la orden de trabajo WO-HSE2024-001. Comenzamos mañana con la base de montaje.',
    timestamp: '2025-01-17T08:00:00Z',
  },
  {
    id: 'c6',
    projectId: 'p1',
    userId: 'u3',
    userName: 'Angelo Operador',
    userRole: 'operator',
    content: 'Reporte de avance: Base verificada, columnas instaladas. Todo según especificaciones. 60% completado.',
    timestamp: '2025-01-18T16:30:00Z',
  },

  // Proyecto p2 - Prototipo Chute Transferencia
  {
    id: 'c7',
    projectId: 'p2',
    userId: 'u3',
    userName: 'Angelo Operador',
    userRole: 'operator',
    content: 'El ángulo de descarga en la zona B está muy cerrado para el montaje. ¿Podemos ajustarlo a 35°?',
    timestamp: '2025-01-12T08:45:00Z',
  },
  {
    id: 'c8',
    projectId: 'p2',
    userId: 'u1',
    userName: 'Yardy Diseñador',
    userRole: 'designer',
    content: 'Buena observación Angelo. He ajustado el ángulo a 35° y actualizado el modelo CAD. Por favor revisa la nueva versión.',
    timestamp: '2025-01-12T11:20:00Z',
  },
  {
    id: 'c9',
    projectId: 'p2',
    userId: 'u4',
    userName: 'Stephano Centeno',
    userRole: 'production',
    content: 'El cambio de ángulo afecta el material requerido. Necesitamos 2 planchas adicionales de 6mm.',
    timestamp: '2025-01-13T09:15:00Z',
  },
  {
    id: 'c10',
    projectId: 'p2',
    userId: 'u2',
    userName: 'Renzo Cliente',
    userRole: 'client',
    content: 'Aprobado el cambio. La funcionalidad es más importante. Proceder con las planchas adicionales.',
    timestamp: '2025-01-13T14:00:00Z',
  },
];

export default {
  mockUsers,
  mockProjects,
  mockWorkOrders,
  mockAssemblySteps,
  mockComments,
};
