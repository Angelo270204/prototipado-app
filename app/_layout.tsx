import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';
import { ChatProvider } from '../contexts/ChatContext';
import { TestMetricsProvider } from '../contexts/TestMetricsContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <ChatProvider>
                <AppProvider>
                    <TestMetricsProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="auth/login" />
                            <Stack.Screen name="role-selection" />
                            <Stack.Screen name="designer/projects" />
                            <Stack.Screen name="client/projects" />
                            <Stack.Screen name="operator/work-orders" />
                            <Stack.Screen name="production/dashboard" />
                            <Stack.Screen name="shared/project-comments" />
                            <Stack.Screen name="shared/test-setup" />
                            <Stack.Screen name="shared/test-results" />
                        </Stack>
                    </TestMetricsProvider>
                </AppProvider>
            </ChatProvider>
        </AuthProvider>
    );
}
