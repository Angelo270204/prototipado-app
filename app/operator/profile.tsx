/**
 * Perfil de Operario
 * Pantalla de perfil con información y estadísticas del operario
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
import { useApp } from '@/contexts/AppContext';

export default function OperatorProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currentUser } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  const operatorName = user?.name || currentUser?.name || 'Angelo Operador';

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
    { label: 'Órdenes', value: '24', icon: 'document-text-outline', color: Colors.primary.main },
    { label: 'Completadas', value: '18', icon: 'checkmark-circle-outline', color: Colors.success.main },
    { label: 'En Progreso', value: '6', icon: 'time-outline', color: Colors.info.main },
    { label: 'Horas', value: '156', icon: 'hourglass-outline', color: Colors.warning.main },
  ];

  const certifications = [
    { name: 'Soldadura Especializada', date: 'Válido hasta: Dic 2024', verified: true },
    { name: 'Seguridad Industrial', date: 'Válido hasta: Jun 2025', verified: true },
    { name: 'Operación de Maquinaria', date: 'Válido hasta: Mar 2025', verified: true },
  ];

  const recentActivity = [
    { order: 'WO-HSE2024-001', action: 'Completó paso 8/10', time: 'Hace 2 horas' },
    { order: 'WO-CHUTE-002', action: 'Inició ensamblaje', time: 'Hace 5 horas' },
    { order: 'WO-FRAME-003', action: 'Verificación de calidad', time: 'Ayer' },
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
                {operatorName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Activo</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{operatorName}</Text>
          <Text style={styles.profileRole}>Operario de Manufactura</Text>
          <Text style={styles.profileId}>ID: {user?.id.toUpperCase() || 'OP-2024-156'}</Text>
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

        {/* Performance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rendimiento Este Mes</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceItem}>
              <View style={styles.performanceLeft}>
                <Ionicons name="speedometer-outline" size={24} color={Colors.success.main} />
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceLabel}>Eficiencia</Text>
                  <Text style={styles.performanceValue}>94%</Text>
                </View>
              </View>
              <View style={styles.trendUp}>
                <Ionicons name="trending-up" size={20} color={Colors.success.main} />
                <Text style={styles.trendText}>+5%</Text>
              </View>
            </View>

            <View style={styles.performanceItem}>
              <View style={styles.performanceLeft}>
                <Ionicons name="star-outline" size={24} color={Colors.warning.main} />
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceLabel}>Calificación</Text>
                  <Text style={styles.performanceValue}>4.8/5.0</Text>
                </View>
              </View>
              <View style={styles.rating}>
                <Ionicons name="star" size={16} color={Colors.warning.main} />
                <Ionicons name="star" size={16} color={Colors.warning.main} />
                <Ionicons name="star" size={16} color={Colors.warning.main} />
                <Ionicons name="star" size={16} color={Colors.warning.main} />
                <Ionicons name="star-half" size={16} color={Colors.warning.main} />
              </View>
            </View>

            <View style={styles.performanceItem}>
              <View style={styles.performanceLeft}>
                <Ionicons name="time-outline" size={24} color={Colors.info.main} />
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceLabel}>Tiempo Promedio</Text>
                  <Text style={styles.performanceValue}>4.2 hrs/orden</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificaciones</Text>
          <View style={styles.certificationsCard}>
            {certifications.map((cert, index) => (
              <View key={index} style={styles.certificationItem}>
                <View style={styles.certificationLeft}>
                  <View style={styles.certificationIcon}>
                    <Ionicons name="ribbon-outline" size={24} color={Colors.primary.main} />
                  </View>
                  <View style={styles.certificationInfo}>
                    <Text style={styles.certificationName}>{cert.name}</Text>
                    <Text style={styles.certificationDate}>{cert.date}</Text>
                  </View>
                </View>
                {cert.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success.main} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityCard}>
            {recentActivity.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityOrder}>{activity.order}</Text>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          <View style={styles.preferencesCard}>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Ionicons name="notifications-outline" size={24} color={Colors.primary.main} />
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Notificaciones</Text>
                  <Text style={styles.preferenceDescription}>
                    Recibir alertas de nuevas órdenes
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
                <Ionicons name="volume-high-outline" size={24} color={Colors.primary.main} />
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Alertas Sonoras</Text>
                  <Text style={styles.preferenceDescription}>
                    Sonido para pasos críticos
                  </Text>
                </View>
              </View>
              <Switch
                value={soundAlerts}
                onValueChange={setSoundAlerts}
                trackColor={{ false: Colors.background.border, true: Colors.primary.light }}
                thumbColor={soundAlerts ? Colors.primary.main : Colors.background.tertiary}
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Historial', 'Ver historial completo')}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="time-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Historial de Órdenes</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Reportes', 'Descargar reportes')}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="document-text-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Mis Reportes</Text>
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

        <Text style={styles.versionText}>Versión 1.0.0 • DTP-AR</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
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
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.success.main,
    marginRight: Spacing.xs / 2,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    color: Colors.success.main,
    fontWeight: Typography.weights.semibold,
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
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
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
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  certificationsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  certificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  certificationIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary.light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  certificationInfo: {
    flex: 1,
  },
  certificationName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  certificationDate: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  verifiedBadge: {
    marginLeft: Spacing.sm,
  },
  activityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary.main,
    marginTop: 6,
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityOrder: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary.main,
    marginBottom: Spacing.xs / 2,
  },
  activityAction: {
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  activityTime: {
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