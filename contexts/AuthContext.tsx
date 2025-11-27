import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserRole = 'designer' | 'client' | 'operator' | 'production';

interface User {
    id: string;
    email: string;
    role: UserRole;
    name: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'project_shared' | 'project_approved' | 'project_rejected' | 'work_order_assigned' | 'work_order_completed' | 'comment_added' | 'chat_message';
    title: string;
    message: string;
    projectId?: string;
    projectName?: string;
    fromUserId?: string;
    fromUserName?: string;
    timestamp: string;
    read: boolean;
}

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS = [
    {
        id: 'u1',
        email: 'yardy12@gmail.com',
        password: '123456',
        role: 'designer' as UserRole,
        name: 'Yardy Diseñador'
    },
    {
        id: 'u2',
        email: 'renzozv@gmail.com',
        password: 'r12345',
        role: 'client' as UserRole,
        name: 'Renzo Cliente'
    },
    {
        id: 'u3',
        email: 'angelo77@gmail.com',
        password: 'a123456',
        role: 'operator' as UserRole,
        name: 'Angelo Operador'
    },
    {
        id: 'u4',
        email: 'steph12@gmail.com',
        password: 's12345',
        role: 'production' as UserRole,
        name: 'Stephano Centeno'
    }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Log del estado actual cada vez que cambia
    console.log('🔐 [AuthContext] Render - Usuario actual:', user);

    const login = (email: string, password: string): boolean => {
        console.log('🔐 [AuthContext] Intentando login con email:', email);

        const foundUser = USERS.find(
            u => u.email === email && u.password === password
        );

        console.log('🔐 [AuthContext] Usuario encontrado:', foundUser);

        if (foundUser) {
            const userToSet = {
                id: foundUser.id,
                email: foundUser.email,
                role: foundUser.role,
                name: foundUser.name
            };

            console.log('🔐 [AuthContext] Seteando usuario:', userToSet);
            setUser(userToSet);

            console.log('🔐 [AuthContext] Usuario seteado. Estado actual:', userToSet);

            // Agregar notificaciones de ejemplo según el rol
            const initialNotifications: Notification[] = [];

            if (foundUser.role === 'production') {
                // Notificación de proyecto aprobado
                initialNotifications.push({
                    id: `n${Date.now()}-1`,
                    userId: foundUser.id,
                    type: 'project_approved',
                    title: 'Proyecto Aprobado',
                    message: 'El cliente ha aprobado el proyecto "Motor Industrial V3". Listo para asignar orden de trabajo.',
                    projectId: 'p1',
                    projectName: 'Motor Industrial V3',
                    fromUserId: 'u2',
                    fromUserName: 'Renzo Cliente',
                    timestamp: new Date().toISOString(),
                    read: false,
                });
            } else if (foundUser.role === 'operator') {
                // Notificación de orden asignada
                initialNotifications.push({
                    id: `n${Date.now()}-1`,
                    userId: foundUser.id,
                    type: 'work_order_assigned',
                    title: 'Nueva Orden de Trabajo',
                    message: 'Se te ha asignado la orden WO-2025-001 para el proyecto "Sistema Hidráulico B"',
                    projectId: 'p2',
                    projectName: 'Sistema Hidráulico B',
                    fromUserId: 'u4',
                    fromUserName: 'Stephano Centeno',
                    timestamp: new Date().toISOString(),
                    read: false,
                });
            } else if (foundUser.role === 'designer') {
                // Notificación de comentario del cliente
                initialNotifications.push({
                    id: `n${Date.now()}-1`,
                    userId: foundUser.id,
                    type: 'comment_added',
                    title: 'Nuevo Comentario',
                    message: 'El cliente ha dejado un comentario en tu proyecto "Motor Industrial V3"',
                    projectId: 'p1',
                    projectName: 'Motor Industrial V3',
                    fromUserId: 'u2',
                    fromUserName: 'Renzo Cliente',
                    timestamp: new Date().toISOString(),
                    read: false,
                });
            } else if (foundUser.role === 'client') {
                // Notificación de proyecto compartido
                initialNotifications.push({
                    id: `n${Date.now()}-1`,
                    userId: foundUser.id,
                    type: 'project_shared',
                    title: 'Nuevo Proyecto Compartido',
                    message: 'Yardy Diseñador ha compartido el proyecto "Motor Industrial V3" contigo para revisión',
                    projectId: 'p1',
                    projectName: 'Motor Industrial V3',
                    fromUserId: 'u1',
                    fromUserName: 'Yardy Diseñador',
                    timestamp: new Date().toISOString(),
                    read: false,
                });
            }

            console.log('🔐 [AuthContext] Creadas', initialNotifications.length, 'notificaciones para', foundUser.role);
            console.log('🔐 [AuthContext] Notificaciones:', initialNotifications);
            setNotifications(initialNotifications);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setNotifications([]);
    };

    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `n${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                notifications,
                addNotification,
                markNotificationAsRead,
                unreadCount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
