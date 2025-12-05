/**
 * Designer Profile Screen
 * Pantalla de perfil del diseñador - Similar al perfil de Stephano (Producción)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Button } from '@/components/atoms/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

export default function DesignerProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { projects } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  // Estadísticas del diseñador
  const designerProjects = projects.filter(p => p.sharedRoles?.includes('designer'));
  const stats = [
    { label: 'Proyectos', value: designerProjects.length.toString(), icon: 'layers-outline', color: Colors.primary.main },
    { label: 'En Progreso', value: designerProjects.filter(p => p.status === 'in_progress').length.toString(), icon: 'time-outline', color: Colors.info.main },
    { label: 'Validación', value: designerProjects.filter(p => p.status === 'validation').length.toString(), icon: 'checkmark-circle-outline', color: Colors.warning.main },
    { label: 'Completados', value: designerProjects.filter(p => p.status === 'completed' || p.status === 'approved').length.toString(), icon: 'trophy-outline', color: Colors.success.main },
  ];

  // Proyectos recientes
  const recentProjects = designerProjects.slice(0, 3).map(p => ({
    name: p.name,
    client: p.client,
    status: p.status,
    progress: p.progress,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => Alert.alert('Configuración', 'Función en desarrollo')}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.name || 'Yardy Diseñador').split(' ').map(n => n[0]).join('').substring(0, 2)}
              </Text>
            </View>
            <View style={styles.roleBadge}>
              <Ionicons name="color-palette" size={16} color={Colors.background.secondary} />
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name || 'Yardy Diseñador'}</Text>
          <Text style={styles.profileRole}>Diseñador CAD</Text>
          <Text style={styles.profileId}>ID: {user?.id?.toUpperCase() || 'DES-2024-001'}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={28} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rendimiento Este Mes</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceItem}>
              <View style={styles.performanceLeft}>
                <Ionicons name="trending-up-outline" size={24} color={Colors.success.main} />
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceLabel}>Tasa de Aprobación</Text>
                  <Text style={styles.performanceValue}>92%</Text>
                </View>
              </View>
              <View style={styles.trendUp}>
                <Ionicons name="trending-up" size={20} color={Colors.success.main} />
                <Text style={styles.trendText}>+8%</Text>
              </View>
            </View>

            <View style={styles.performanceItem}>
              <View style={styles.performanceLeft}>
                <Ionicons name="document-outline" size={24} color={Colors.info.main} />
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceLabel}>Diseños Creados</Text>
                  <Text style={styles.performanceValue}>12</Text>
                </View>
              </View>
            </View>

            <View style={styles.performanceItem}>
              <View style={styles.performanceLeft}>
                <Ionicons name="time-outline" size={24} color={Colors.warning.main} />
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceLabel}>Tiempo Promedio</Text>
                  <Text style={styles.performanceValue}>2.5 días</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Proyectos Recientes</Text>
            <TouchableOpacity onPress={() => router.push('/designer/projects')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.projectsCard}>
            {recentProjects.length === 0 ? (
              <Text style={styles.emptyText}>No hay proyectos recientes</Text>
            ) : (
              recentProjects.map((project, index) => (
                <View key={index} style={styles.projectItem}>
                  <View style={styles.projectLeft}>
                    <View style={styles.projectIcon}>
                      <Ionicons name="cube-outline" size={20} color={Colors.primary.main} />
                    </View>
                    <View style={styles.projectInfo}>
                      <Text style={styles.projectName}>{project.name}</Text>
                      <Text style={styles.projectClient}>{project.client}</Text>
                    </View>
                  </View>
                  <View style={styles.projectProgress}>
                    <Text style={styles.projectProgressText}>{project.progress}%</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <View style={styles.preferencesCard}>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="notifications-outline" size={24} color={Colors.primary.main} />
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Notificaciones</Text>
                  <Text style={styles.preferenceDescription}>
                    Alertas de aprobaciones y comentarios
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.background.border, true: Colors.primary.light }}
                thumbColor={notifications ? Colors.primary.main : Colors.background.tertiary}
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="save-outline" size={24} color={Colors.primary.main} />
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Auto-guardado</Text>
                  <Text style={styles.preferenceDescription}>
                    Guardar cambios automáticamente
                  </Text>
                </View>
              </View>
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: Colors.background.border, true: Colors.primary.light }}
                thumbColor={autoSave ? Colors.primary.main : Colors.background.tertiary}
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/designer/projects')}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="folder-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Ver Mis Proyectos</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/shared/project-comments?projectId=p1')}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="chatbubbles-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Chat con Equipo</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Ayuda', 'Centro de ayuda')}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="help-circle-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Ayuda y Soporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          variant="secondary"
          fullWidth
          style={styles.logoutButton}
        />

        <Text style={styles.versionText}>Versión 1.0.0 • DTP-AR Diseñador</Text>
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
    borderBottomColor: Colors.background.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  settingsButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  profileCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.background.secondary,
  },
  roleBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.success.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background.secondary,
  },
  profileName: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  profileRole: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
  },
  profileId: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.tertiary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  statValue: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  seeAllText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.primary.main,
    fontWeight: Typography.weights.semibold,
  },
  performanceCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  performanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  performanceInfo: {
    marginLeft: Spacing.md,
  },
  performanceLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
  },
  performanceValue: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  trendUp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  trendText: {
    fontSize: Typography.sizes.caption,
    color: Colors.success.main,
    fontWeight: Typography.weights.semibold,
    marginLeft: Spacing.xs / 2,
  },
  projectsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  emptyText: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    padding: Spacing.lg,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  projectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary.light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  projectClient: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  projectProgress: {
    backgroundColor: Colors.success.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  projectProgressText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.success.main,
  },
  preferencesCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  preferenceLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  preferenceInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  preferenceLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  preferenceDescription: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  versionText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
