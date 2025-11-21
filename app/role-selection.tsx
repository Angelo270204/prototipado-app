import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

type RoleOption = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  buttonLabels: string[];
};

const roles: RoleOption[] = [
  {
    id: 'designer',
    title: 'Diseñador',
    description: 'Importa CAD, valida en AR, detecta colisiones y genera guías de ensamblaje',
    icon: 'folder-outline',
    route: '/designer/projects',
    buttonLabels: ['Importar CAD', 'Validar AR'],
  },
  {
    id: 'client',
    title: 'Cliente B2B',
    description: 'Visualiza modelos en AR, mide, escala y aprueba diseños',
    icon: 'folder-outline',
    route: '/client/projects',
    buttonLabels: ['Ver AR', 'Aprobar'],
  },
  {
    id: 'production',
    title: 'Producción',
    description: 'Guías AR paso a paso, validación en tiempo real y reportes',
    icon: 'folder-outline',
    route: '/production/dashboard',
    buttonLabels: ['Ensamblaje', 'Reportes'],
  },
];

const stats = [
  { label: 'Proyecto', value: '24' },
  { label: 'Tasa de aprobación', value: '85%' },
  { label: 'Pendiente', value: '5' },
];

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleRoleSelect = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <Text style={styles.headerTitle}>DTP AR</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>SELECCIONA TU ROL</Text>
          <Text style={styles.subtitle}>
            Accede al módulo correspondiente a tu función
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={styles.roleCard}
              onPress={() => handleRoleSelect(role.route)}
              activeOpacity={0.8}
            >
              <View style={styles.roleCardContent}>
                <View style={styles.roleHeader}>
                  <View style={styles.folderIconContainer}>
                    <Ionicons name={role.icon} size={40} color={Colors.text.onCard} />
                  </View>
                  <TouchableOpacity style={styles.arrowButton}>
                    <Ionicons name="arrow-forward" size={20} color={Colors.text.onCard} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.roleInfo}>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </View>

                <View style={styles.roleActions}>
                  {role.buttonLabels.map((label, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.actionButton}
                      onPress={() => handleRoleSelect(role.route)}
                    >
                      <Text style={styles.actionButtonText}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.base.blackPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: Typography.weights.bold,
    color: Colors.text.onDark,
  },
  headerTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    flex: 1,
    marginLeft: Spacing.md,
    fontStyle: 'italic',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.base.whitePrimary,
  },
  titleSection: {
    marginBottom: Spacing.xl,
  },
  mainTitle: {
    fontSize: Typography.sizes.h4,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  rolesContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  roleCard: {
    backgroundColor: Colors.base.blackPrimary,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  roleCardContent: {
    padding: Spacing.lg,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  folderIconContainer: {
    padding: Spacing.xs,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleInfo: {
    marginBottom: Spacing.lg,
  },
  roleTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.onCard,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.label,
    lineHeight: Typography.sizes.bodySmall * Typography.lineHeight.normal,
  },
  roleActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.base.blackPrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  statValue: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.stats.value,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.stats.text,
    textAlign: 'center',
  },
});