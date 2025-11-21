/**
 * Root Layout
 * Configuración principal de navegación y contexto global
 */

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppProvider } from '@/contexts/AppContext';
import { Colors } from '@/constants/DesignSystem';

// Tema claro personalizado
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary.main,
    background: Colors.background.primary,
    card: Colors.background.secondary,
    text: Colors.text.primary,
    border: Colors.background.border,
    notification: Colors.error.main,
  },
};

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemeProvider value={LightTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background.primary },
          }}
        >
          {/* Entry Point */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          
          {/* Authentication Screens */}
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          
          {/* Role Selection */}
          <Stack.Screen name="role-selection" options={{ headerShown: false }} />
          
          {/* Designer Screens */}
          <Stack.Screen name="designer/projects" options={{ headerShown: false }} />
          <Stack.Screen name="designer/project-detail" options={{ headerShown: false }} />
          <Stack.Screen name="designer/new-project" options={{ headerShown: false }} />
          <Stack.Screen name="designer/ar-viewer" options={{ headerShown: false }} />
          <Stack.Screen name="designer/profile" options={{ headerShown: false }} />
          
          {/* Client Screens */}
          <Stack.Screen name="client/projects" options={{ headerShown: false }} />
          <Stack.Screen name="client/project-detail" options={{ headerShown: false }} />
          <Stack.Screen name="client/ar-view" options={{ headerShown: false }} />
          <Stack.Screen name="client/profile" options={{ headerShown: false }} />
          
          {/* Operator Screens */}
          <Stack.Screen name="operator/work-orders" options={{ headerShown: false }} />
          <Stack.Screen name="operator/assembly-guide" options={{ headerShown: false }} />
          <Stack.Screen name="operator/qr-scanner" options={{ headerShown: false }} />
          <Stack.Screen name="operator/ar-assembly" options={{ headerShown: false }} />
          <Stack.Screen name="operator/profile" options={{ headerShown: false }} />
          
          {/* Production Screens */}
          <Stack.Screen name="production/dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="production/work-orders" options={{ headerShown: false }} />
          <Stack.Screen name="production/metrics" options={{ headerShown: false }} />
          <Stack.Screen name="production/profile" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </AppProvider>
  );
}