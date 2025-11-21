/**
 * Root Layout
 * Configuración principal de navegación y contexto global
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppProvider } from '@/contexts/AppContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1A1A1A' },
          }}
        >
          {/* Login / Role Selection */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          
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
        <StatusBar style="light" />
      </ThemeProvider>
    </AppProvider>
  );
}
