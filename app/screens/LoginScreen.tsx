/**
 * Login Screen
 * Pantalla de selección de rol para DTP-AR
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { Button } from '@/components/atoms/Button';
import { useApp } from '@/contexts/AppContext';
import { mockUsers, User } from '@/data/mockData';

export default function LoginScreen() {
  const router = useRouter();
  const { setCurrentUser, setSelectedRole } = useApp();

  const handleRoleSelect = (role: User['role']) => {
    // Encontrar un usuario mock con ese rol
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      setSelectedRole(role);
      
      // Navegar según el rol
      switch (role) {
        case 'designer':
          router.push('/designer/projects');
          break;
        case 'client':
          router.push('/client/projects');
          break;
        case 'operator':
          router.push('/operator/work-orders');
          break;
        case 'production':
          router.push('/production/dashboard');
          break;
      }
    }
  };

  const roles = [
    {
      role: 'designer' as const,
      title: 'Diseñador',
      description: 'Gestión de proyectos y validación CAD',
      icon: '📐',
      color: Colors.focus,
    },
    {
      role: 'client' as const,
      title: 'Cliente',
      description: 'Visualización y aprobación de diseños',
      icon: '👔',
      color: Colors.success,
    },
    {
      role: 'operator' as const,
      title: 'Operario',
      description: 'Guías de ensamblaje en RA',
      icon: '🔧',
      color: Colors.warning,
    },
    {
      role: 'production' as const,
      title: 'Producción',
      description: 'Órdenes de trabajo y métricas',
      icon: '📊',
      color: Colors.priority.medium,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>DTP-AR</Text>
          <Text style={styles.subtitle}>
            Diseño, Prototipado y Validación
          </Text>
          <Text style={styles.subtitle}>en Realidad Aumentada</Text>
          <Text style={styles.location}>Manufactura · Áncash · Chimbote</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.rolesContainer}>
          <Text style={styles.instructionText}>Selecciona tu rol para continuar</Text>
          
          {roles.map((roleItem) => (
            <TouchableOpacity
              key={roleItem.role}
              style={[styles.roleCard, { borderLeftColor: roleItem.color }]}
              onPress={() => handleRoleSelect(roleItem.role)}
              activeOpacity={0.7}
            >
              <View style={styles.roleIconContainer}>
                <Text style={styles.roleIcon}>{roleItem.icon}</Text>
              </View>
              <View style={styles.roleInfo}>
                <Text style={styles.roleTitle}>{roleItem.title}</Text>
                <Text style={styles.roleDescription}>{roleItem.description}</Text>
              </View>
              <Text style={styles.roleArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Versión 1.0.0 · DTP-AR System
          </Text>
          <Text style={styles.footerText}>
            © 2024 Manufactura Digital Perú
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  logo: {
    fontSize: 48,
    fontWeight: Typography.weights.bold,
    color: Colors.success,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.h3,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  location: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  rolesContainer: {
    flex: 1,
    marginTop: Spacing.xl,
  },
  instructionText: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
  },
  roleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  roleIcon: {
    fontSize: 28,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  roleArrow: {
    fontSize: 24,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.background.secondary,
  },
  footerText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.disabled,
    marginBottom: Spacing.xs,
  },
});
