/**
 * App Context Provider
 * Manejo de estado global de la aplicación DTP-AR
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, mockUsers } from '@/data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  selectedRole: User['role'] | null;
  setSelectedRole: (role: User['role'] | null) => void;
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

  const value = {
    currentUser,
    setCurrentUser,
    selectedRole,
    setSelectedRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
