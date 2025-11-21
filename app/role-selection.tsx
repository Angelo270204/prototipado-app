import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

type RoleOption = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
};

const roles: RoleOption[] = [
  {
    id: 'designer',
    title: 'Diseñador',
    description: 'Carga y gestiona proyectos CAD, visualiza en AR',
    icon: 'color-palette-outline',
    route: '/designer/projects',
    color: Colors.primary.main,
  },
  {
    id: 'client',
    title: 'Cliente',
    description: 'Revisa diseños, comenta y aprueba proyectos',
    icon: 'briefcase-outline',
    route: '/client/projects',
    color: Colors.info.main,
  },
  {
    id: 'operator',
    title: 'Operador',
    description: 'Sigue guías de ensamblaje paso a paso',
    icon: 'construct-outline',
    route: '/operator/work-orders',
    color: Colors.warning.main,
  },
  {
    id: 'production',
    title: 'Producción',
    description: 'Monitorea métricas y gestiona órdenes de trabajo',
    icon: 'stats-chart-outline',
    route: '/production/dashboard',
    color: Colors.success.main,
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleRoleSelect = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="cube-outline" size={56} color={Colors.primary.main} />
          </View>
          <Text style={styles.title}>Selecciona tu Rol</Text>
          <Text style={styles.subtitle}>
            Elige el rol con el que deseas acceder a la plataforma
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={styles.roleCard}
              onPress={() => handleRoleSelect(role.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: role.color + '15' }]}>
                <Ionicons name={role.icon} size={40} color={role.color} />
              </View>
              <View style={styles.roleContent}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.info.main} />
            <Text style={styles.infoText}>
              Puedes cambiar de rol en cualquier momento desde tu perfil
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push('/auth/login')}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error.main} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  rolesContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    lineHeight: Typography.sizes.bodySmall * Typography.lineHeight.normal,
  },
  infoContainer: {
    marginBottom: Spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.info.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    lineHeight: Typography.sizes.bodySmall * Typography.lineHeight.normal,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error.main + '30',
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  logoutText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.error.main,
  },
});