/**
 * Perfil de Producción
 * Pantalla de perfil con información y configuraciones del supervisor de producción
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Button } from '@/components/atoms/Button';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductionProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);

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

  const stats = [
    { label: 'Órdenes Totales', value: '48', icon: 'document-text-outline', color: Colors.primary.main },
    { label: 'Activas', value: '12', icon: 'time-outline', color: Colors.info.main },
    { label: 'Completadas', value: '36', icon: 'checkmark-circle-outline', color: Colors.success.main },
    { label: 'Operarios', value: '15', icon: 'people-outline', color: Colors.warning.main },
  ];

  const teamMembers = [
    { name: 'Angelo Operador', role: 'Operario Senior', status: 'active', tasks: 3 },
    { name: 'Ana Martínez', role: 'Operario', status: 'active', tasks: 2 },
    { name: 'Juan Pérez', role: 'Operario Junior', status: 'break', tasks: 1 },
    { name: 'María López', role: 'Operario', status: 'active', tasks: 4 },
  ];

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
                {(user?.name || 'Luis Sánchez').split(' ').map(n => n[0]).join('').substring(0, 2)}
              </Text>
            </View>
            <View style={styles.roleBadge}>
              <Ionicons name="briefcase" size={16} color={Colors.background.secondary} />
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name || 'Luis Sánchez'}</Text>
          <Text style={styles.profileRole}>Supervisor de Producción</Text>
          <Text style={styles.profileId}>ID: PROD-2024-089</Text>
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

        {/* Department Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rendimiento del Departamento</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceItem}>
              <View style={styles.performanceLeft}>
                <Ionicons name="trending-up-outline" size={24} color={Colors.success.main} />
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceLabel}>Eficiencia Global</Text>
                  <Text style={styles.performanceValue}>91%</Text>
                </View>
              </View>
              <View style={styles.trendUp}>
                <Ionicons name="trending-up" size={20} color={Colors.success.main} />
                <Text style={styles.trendText}>+3%</Text>
              </View>
            </View>

            <View style={styles.performanceItem}>
              <View style={styles.performanceLeft}>
                <Ionicons name="calendar-outline" size={24} color={Colors.info.main} />
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceLabel}>Entregas a Tiempo</Text>
                  <Text style={styles.performanceValue}>87%</Text>
                </View>
              </View>
            </View>

            <View style={styles.performanceItem}>
              <View style={styles.performanceLeft}>
                <Ionicons name="checkmark-done-outline" size={24} color={Colors.warning.main} />
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceLabel}>Calidad (Sin Defectos)</Text>
                  <Text style={styles.performanceValue}>95%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Team Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Equipo de Trabajo</Text>
            <TouchableOpacity onPress={() => router.push('/production/dashboard')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.teamCard}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <View style={styles.memberLeft}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                </View>
                <View style={styles.memberRight}>
                  <View style={[
                    styles.memberStatus,
                    { backgroundColor: member.status === 'active' ? Colors.success.background : Colors.warning.background }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: member.status === 'active' ? Colors.success.main : Colors.warning.main }
                    ]} />
                    <Text style={[
                      styles.statusText,
                      { color: member.status === 'active' ? Colors.success.main : Colors.warning.main }
                    ]}>
                      {member.status === 'active' ? 'Activo' : 'Pausa'}
                    </Text>
                  </View>
                  <Text style={styles.taskCount}>{member.tasks} tareas</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <View style={styles.preferencesCard}>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="notifications-outline" size={24} color={Colors.primary.main} />
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Notificaciones de Órdenes</Text>
                  <Text style={styles.preferenceDescription}>
                    Alertas de nuevas órdenes y cambios
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
                <Ionicons name="git-branch-outline" size={24} color={Colors.primary.main} />
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Asignación Automática</Text>
                  <Text style={styles.preferenceDescription}>
                    Distribuir órdenes automáticamente
                  </Text>
                </View>
              </View>
              <Switch
                value={autoAssign}
                onValueChange={setAutoAssign}
                trackColor={{ false: Colors.background.border, true: Colors.primary.light }}
                thumbColor={autoAssign ? Colors.primary.main : Colors.background.tertiary}
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/production/metrics')}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="analytics-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Ver Métricas Detalladas</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Reportes', 'Generar reportes de producción')}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="document-text-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Generar Reportes</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Exportar', 'Exportar datos de producción')}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="download-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Exportar Datos</Text>
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

        <Text style={styles.versionText}>Versión 1.0.0 • DTP-AR Production</Text>
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
    backgroundColor: Colors.warning.main,
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
  teamCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  memberAvatarText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.bold,
    color: Colors.background.secondary,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  memberRole: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  memberRight: {
    alignItems: 'flex-end',
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs / 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.xs / 2,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
  taskCount: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.tertiary,
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