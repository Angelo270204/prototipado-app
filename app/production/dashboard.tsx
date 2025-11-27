/**
 * Production Dashboard Screen
 * Panel de control para módulo de producción - Stephano Centeno
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { mockWorkOrders, mockProjects } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import NotificationBadge from '@/components/molecules/NotificationBadge';

export default function ProductionDashboardScreen() {
  const router = useRouter();
  const { currentUser } = useApp();
  const { notifications, markNotificationAsRead, unreadCount } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingOrders = mockWorkOrders.filter(wo => wo.status === 'pending').length;
  const inProgressOrders = mockWorkOrders.filter(wo => wo.status === 'in_progress').length;
  const completedOrders = mockWorkOrders.filter(wo => wo.status === 'completed').length;
  const activeProjects = mockProjects.filter(p => p.status === 'in_progress' || p.status === 'validation').length;

  const metrics = [
    { label: 'Órdenes Pendientes', value: pendingOrders, color: Colors.text.secondary, icon: '⏳' },
    { label: 'En Progreso', value: inProgressOrders, color: (Colors.focus as any).main || Colors.focus, icon: '🔄' },
    { label: 'Completadas Hoy', value: completedOrders, color: (Colors.success as any).main || Colors.success, icon: '✓' },
    { label: 'Proyectos Activos', value: activeProjects, color: (Colors.warning as any).main || Colors.warning, icon: '📊' },
  ];

  const handleCreateWorkOrder = () => {
    Alert.alert(
      'Crear Orden de Trabajo',
      '¿Deseas crear una nueva orden de trabajo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Crear',
          onPress: () => {
            Alert.alert('Éxito', 'Orden de trabajo creada exitosamente\nID: WO-2024-' + Math.floor(Math.random() * 1000));
          },
        },
      ]
    );
  };

  const handleManageResources = () => {
    Alert.alert(
      'Gestionar Recursos',
      'Selecciona una opción:',
      [
        { text: 'Ver Operarios', onPress: () => Alert.alert('Operarios', '15 operarios disponibles') },
        { text: 'Ver Materiales', onPress: () => Alert.alert('Materiales', 'Inventario actualizado') },
        { text: 'Ver Equipos', onPress: () => Alert.alert('Equipos', '8 equipos en operación') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleReports = () => {
    Alert.alert(
      'Reportes',
      'Selecciona el tipo de reporte:',
      [
        { text: 'Reporte Diario', onPress: () => Alert.alert('Reporte', 'Generando reporte diario...') },
        { text: 'Reporte Semanal', onPress: () => Alert.alert('Reporte', 'Generando reporte semanal...') },
        { text: 'Reporte Mensual', onPress: () => Alert.alert('Reporte', 'Generando reporte mensual...') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const quickActions = [
    { title: 'Ver Proyectos', icon: '📦', action: () => router.push('/production/projects') },
    { title: 'Crear Orden de Trabajo', icon: '➕', action: handleCreateWorkOrder },
    { title: 'Gestionar Recursos', icon: '👥', action: handleManageResources },
    { title: 'Reportes', icon: '📄', action: handleReports },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              Hola, {currentUser?.name?.split(' ')[0] || 'Stephano'}
            </Text>
            <Text style={styles.subtitle}>Panel de Control - Producción</Text>
          </View>
          <NotificationBadge
            count={unreadCount}
            onPress={() => setShowNotifications(true)}
          />
        </View>

        {/* Modal de Notificaciones */}
        <Modal
          visible={showNotifications}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowNotifications(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.notificationModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Notificaciones ({unreadCount})</Text>
                <TouchableOpacity onPress={() => setShowNotifications(false)}>
                  <Ionicons name="close" size={24} color={Colors.base.blackPrimary} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalContent}>
                {notifications.length === 0 ? (
                  <View style={styles.emptyNotifications}>
                    <Ionicons name="notifications-outline" size={64} color={Colors.grays.medium} />
                    <Text style={styles.emptyNotificationsText}>
                      No tienes notificaciones
                    </Text>
                    <Text style={styles.emptyNotificationsSubtext}>
                      Te notificaremos sobre órdenes de trabajo, recursos y alertas de producción
                    </Text>
                  </View>
                ) : (
                  notifications.map((notification) => (
                    <TouchableOpacity
                      key={notification.id}
                      style={[
                        styles.notificationItem,
                        !notification.read && styles.notificationItemUnread,
                      ]}
                      onPress={() => markNotificationAsRead(notification.id)}
                    >
                      <View style={styles.notificationIcon}>
                        <Ionicons
                          name={
                            notification.type === 'project_approved'
                              ? 'checkmark-circle-outline'
                              : notification.type === 'work_order_completed'
                              ? 'checkmark-done-outline'
                              : notification.type === 'comment_added'
                              ? 'chatbubble-outline'
                              : 'notifications-outline'
                          }
                          size={24}
                          color={Colors.functional.info}
                        />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <Text style={styles.notificationMessage}>{notification.message}</Text>
                        <Text style={styles.notificationTime}>
                          {new Date(notification.timestamp).toLocaleString('es-ES')}
                        </Text>
                      </View>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Metrics Cards */}
        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <Text style={styles.metricIcon}>{metric.icon}</Text>
              <Text style={[styles.metricValue, { color: metric.color }]}>
                {metric.value}
              </Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.action}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: (Colors.success as any).main || Colors.success }]} />
              <Text style={styles.activityText}>
                Orden WO-HSE2024-001 actualizada - Paso 4/10 completado
              </Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: (Colors.focus as any).main || Colors.focus }]} />
              <Text style={styles.activityText}>
                Nuevo proyecto &quot;Bastidor de Maquinaria Pesada&quot; creado
              </Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: (Colors.warning as any).main || Colors.warning }]} />
              <Text style={styles.activityText}>
                Orden WO-CHUTE-002 asignada a Roberto Castillo
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/dashboard')}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/work-orders')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Órdenes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/metrics')}>
          <Text style={styles.navIcon}>📈</Text>
          <Text style={styles.navLabel}>Métricas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
  },
  scrollContent: {
    paddingBottom: 100,
    backgroundColor: Colors.base.whitePrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  headerContent: {
    flex: 1,
  },
  notificationButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.base.whitePrimary,
  },
  greeting: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.base.whitePrimary,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grays.light,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: Spacing.md,
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  metricValue: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.base.whitePrimary,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grays.light,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: Spacing.md,
  },
  actionIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.base.blackPrimary,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
  activityCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grays.light,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.round,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  activityText: {
    flex: 1,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.sizes.bodySmall,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.base.whitePrimary,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  navLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  navLabelActive: {
    color: Colors.base.blackPrimary,
    fontWeight: Typography.weights.semibold,
  },
  // Estilos del Modal de Notificaciones
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  notificationModal: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.border,
  },
  modalTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  modalContent: {
    maxHeight: 500,
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    minHeight: 300,
  },
  emptyNotificationsText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  emptyNotificationsSubtext: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  notificationItemUnread: {
    backgroundColor: Colors.background.secondary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grays.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.base.blackPrimary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: Colors.grays.dark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.functional.info,
    marginTop: 6,
  },
});
