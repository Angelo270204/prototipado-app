/**
 * App Context Provider
 * Manejo de estado global de la aplicación DTP-AR
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, mockUsers, Project, mockProjects } from '@/data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  selectedRole: User['role'] | null;
  setSelectedRole: (role: User['role'] | null) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
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

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: `p${Date.now()}`,
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  const value = {
    currentUser,
    setCurrentUser,
    selectedRole,
    setSelectedRole,
    projects,
    addProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
