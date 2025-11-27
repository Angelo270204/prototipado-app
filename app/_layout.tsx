import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';
import { ChatProvider } from '../contexts/ChatContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <ChatProvider>
                <AppProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="auth/login" />
                        <Stack.Screen name="role-selection" />
                        <Stack.Screen name="designer/projects" />
                        <Stack.Screen name="client/projects" />
                        <Stack.Screen name="operator/work-orders" />
                        <Stack.Screen name="production/dashboard" />
                        <Stack.Screen name="shared/project-comments" />
                    </Stack>
                </AppProvider>
            </ChatProvider>
        </AuthProvider>
    );
}
