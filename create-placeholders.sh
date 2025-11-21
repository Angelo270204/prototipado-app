#!/bin/bash

# Helper function to create placeholder screens
create_placeholder() {
  local path=$1
  local title=$2
  local module=$3
  
  cat > "$path" << EOF
/**
 * $title
 * Pantalla placeholder - pendiente de implementación
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/DesignSystem';
import { Button } from '@/components/atoms/Button';

export default function PlaceholderScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.icon}>🚧</Text>
        <Text style={styles.title}>$title</Text>
        <Text style={styles.subtitle}>Esta pantalla está en desarrollo</Text>
        <Text style={styles.description}>
          La funcionalidad completa estará disponible próximamente.
        </Text>

        <Button
          title="Volver"
          onPress={() => router.back()}
          variant="primary"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  backButton: {
    marginBottom: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.sizes.body,
    color: Colors.success,
    fontWeight: Typography.weights.semibold,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.h3,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});
EOF
}

# Designer screens
create_placeholder "app/designer/project-detail.tsx" "Detalle de Proyecto" "designer"
create_placeholder "app/designer/new-project.tsx" "Nuevo Proyecto" "designer"
create_placeholder "app/designer/ar-viewer.tsx" "Visor RA" "designer"
create_placeholder "app/designer/profile.tsx" "Perfil de Diseñador" "designer"

# Client screens
create_placeholder "app/client/project-detail.tsx" "Detalle de Proyecto (Cliente)" "client"
create_placeholder "app/client/ar-view.tsx" "Vista RA (Cliente)" "client"
create_placeholder "app/client/profile.tsx" "Perfil de Cliente" "client"

# Operator screens
create_placeholder "app/operator/qr-scanner.tsx" "Escáner QR" "operator"
create_placeholder "app/operator/ar-assembly.tsx" "Ensamblaje en RA" "operator"
create_placeholder "app/operator/profile.tsx" "Perfil de Operario" "operator"

# Production screens
create_placeholder "app/production/work-orders.tsx" "Órdenes de Trabajo (Producción)" "production"
create_placeholder "app/production/metrics.tsx" "Métricas y Reportes" "production"
create_placeholder "app/production/profile.tsx" "Perfil de Producción" "production"

echo "Placeholder screens created successfully!"
