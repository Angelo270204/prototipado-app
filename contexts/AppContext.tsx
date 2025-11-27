/**
 * App Context Provider
 * Manejo de estado global de la aplicación DTP-AR
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, mockUsers, Project, mockProjects } from '@/data/mockData';
import { useAuth } from './AuthContext';
import { useChat } from './ChatContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProjectStatus =
  | 'draft'           // Diseñador trabajando
  | 'pending_client'  // Esperando aprobación cliente
  | 'approved'        // Cliente aprobó
  | 'rejected'        // Cliente rechazó
  | 'in_assembly'     // Operador ensamblando
  | 'completed';      // Terminado

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  selectedRole: User['role'] | null;
  setSelectedRole: (role: User['role'] | null) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  addAndShareProject: (
    project: Omit<Project, 'id'>,
    options?: { shareWithRoles?: User['role'][]; createChat?: boolean; notify?: boolean }
  ) => Promise<Project>;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  shareProjectWithClient: (projectId: string, clientId?: string) => void;
  approveProject: (projectId: string) => void;
  rejectProject: (projectId: string, reason: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<User['role'] | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  // Acceder a Auth y Chat contexts para enviar notificaciones y crear chat rooms
  const auth = useAuth();
  const chat = useChat();

  // Cargar proyectos persistidos (si existen)
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const stored = await AsyncStorage.getItem('@app_projects');
        if (stored) {
          const parsed: Project[] = JSON.parse(stored);
          console.log('📥 [AppContext] Proyectos cargados de storage:', parsed.length);
          setProjects(parsed);
        } else {
          console.log('ℹ️ [AppContext] No hay proyectos en storage, usando mocks iniciales');
        }
      } catch (e) {
        console.warn('⚠️ [AppContext] Error cargando proyectos:', e);
      }
    };
    loadProjects();
  }, []);

  // Guardar proyectos cuando cambien
  useEffect(() => {
    const saveProjects = async () => {
      try {
        await AsyncStorage.setItem('@app_projects', JSON.stringify(projects));
        console.log('💾 [AppContext] Proyectos guardados:', projects.length);
      } catch (e) {
        console.warn('⚠️ [AppContext] Error guardando proyectos:', e);
      }
    };
    saveProjects();
  }, [projects]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: `p${Date.now()}`,
      sharedRoles: ['designer', 'client', 'operator', 'production'],
    };
    setProjects((prev) => [newProject, ...prev]);
    console.log('🆕 [AppContext] Proyecto creado (addProject):', newProject.id, newProject.name);
  };

  const addAndShareProject = async (
    project: Omit<Project, 'id'>,
    options?: { shareWithRoles?: User['role'][]; createChat?: boolean; notify?: boolean }
  ) => {
    const shareWithRoles = options?.shareWithRoles ?? ['designer', 'client', 'operator', 'production'];
    const createChat = options?.createChat ?? true;
    const notify = options?.notify ?? true;

    const newProject: Project = {
      ...project,
      id: `p${Date.now()}`,
      sharedRoles: shareWithRoles as any,
    };

    // Añadir al state
    setProjects(prev => [newProject, ...prev]);
    console.log('🆕 [AppContext] Proyecto creado (addAndShareProject):', newProject.id, newProject.name, 'Roles:', newProject.sharedRoles);

    // Crear sala de chat para el proyecto (si chat disponible)
    try {
      if (createChat && chat && chat.createChatRoom) {
        const participants = mockUsers.map(u => ({ id: u.id, name: u.name, role: u.role }));
        chat.createChatRoom({ projectId: newProject.id, projectName: newProject.name, participants });
      }
    } catch (error) {
      console.warn('⚠️ [AppContext] No se pudo crear chat room:', error);
    }

    // Enviar notificaciones a usuarios por rol
    try {
      if (notify && auth && auth.addNotification) {
         // Enviar a cada usuario que cumpla los roles
         mockUsers.forEach(u => {
           if (shareWithRoles.includes(u.role)) {
             auth.addNotification({
               userId: u.id,
               type: 'project_shared',
               title: 'Nuevo Proyecto Compartido',
               message: `${mockUsers.find(mu => mu.role === 'designer')?.name || 'Un diseñador'} ha compartido el proyecto "${newProject.name}"`,
               projectId: newProject.id,
               projectName: newProject.name,
               fromUserId: currentUser?.id || mockUsers.find(mu => mu.role === 'designer')?.id,
               fromUserName: currentUser?.name || mockUsers.find(mu => mu.role === 'designer')?.name,
             });
           }
         });
       }
     } catch (error) {
       console.warn('⚠️ [AppContext] Error enviando notificaciones:', error);
     }

    return newProject;
  };

  const updateProjectStatus = (projectId: string, status: ProjectStatus) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, status: status as any } : p))
    );
  };

  const shareProjectWithClient = (projectId: string, _clientId?: string) => {
    updateProjectStatus(projectId, 'pending_client');
    // Aquí se enviaría una notificación al cliente
  };

  const approveProject = (projectId: string) => {
    updateProjectStatus(projectId, 'approved');
    // Notificar a producción
  };

  const rejectProject = (projectId: string, _reason: string) => {
    updateProjectStatus(projectId, 'rejected');
    // Notificar al diseñador
  };

  const value = {
    currentUser,
    setCurrentUser,
    selectedRole,
    setSelectedRole,
    projects,
    addProject,
    addAndShareProject,
    updateProjectStatus,
    shareProjectWithClient,
    approveProject,
    rejectProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
