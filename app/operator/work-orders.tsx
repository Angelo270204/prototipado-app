/**
 * Operator Work Orders Screen
 * Lista de órdenes de trabajo para operarios - Angelo Operador
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { WorkOrderCard } from '@/components/molecules/WorkOrderCard';
import NotificationBadge from '@/components/molecules/NotificationBadge';
import { mockWorkOrders } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function OperatorWorkOrdersScreen() {
  const router = useRouter();
  const { currentUser } = useApp();
  const { notifications, markNotificationAsRead, unreadCount } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in_progress'>('all');
  const [showNotifications, setShowNotifications] = useState(false);

  const filters = [
    { key: 'all', label: 'Todas' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'in_progress', label: 'En Progreso' },
  ];

  const filteredOrders = selectedFilter === 'all'
    ? mockWorkOrders
    : mockWorkOrders.filter(wo => wo.status === selectedFilter);

  // Proyectos compartidos con el operador
  const { projects } = useApp();
  const operatorProjects = projects.filter(p => p.sharedRoles?.includes('operator'));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hola, {currentUser?.name?.split(' ')[0] || 'Angelo'}</Text>
            <Text style={styles.subtitle}>{filteredOrders.length} órdenes asignadas</Text>
          </View>
          <View style={styles.headerRight}>
            <NotificationBadge
              count={unreadCount}
              onPress={() => setShowNotifications(true)}
            />
            <TouchableOpacity onPress={() => router.push('/operator/qr-scanner')}>
              <View style={styles.scanButton}>
                <Ionicons name="qr-code-outline" size={20} color={Colors.base.whitePrimary} />
                <View style={{ width: 6 }} />
                <Text style={styles.scanButtonText}>Escanear</Text>
              </View>
            </TouchableOpacity>
          </View>
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
                      Te notificaremos sobre nuevas órdenes y actualizaciones
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
                            notification.type === 'work_order_assigned'
                              ? 'document-text-outline'
                              : notification.type === 'work_order_completed'
                              ? 'checkmark-circle-outline'
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

        {/* Filters */}
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                selectedFilter === filter.key && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/operator/qr-scanner')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>📷</Text>
              </View>
              <Text style={styles.quickActionLabel}>Escanear QR</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/operator/my-guides')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>📋</Text>
              </View>
              <Text style={styles.quickActionLabel}>Mis Guías</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/operator/report-issue')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>⚠️</Text>
              </View>
              <Text style={styles.quickActionLabel}>Reportar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/operator/progress')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>📊</Text>
              </View>
              <Text style={styles.quickActionLabel}>Ver Progreso</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/shared/project-comments?projectId=p1')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>💬</Text>
              </View>
              <Text style={styles.quickActionLabel}>Chat Equipo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Work Orders List */}
        <View style={styles.ordersContainer}>
          <Text style={styles.sectionTitle}>Mis Órdenes</Text>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay órdenes en esta categoría</Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <WorkOrderCard
                key={order.id}
                workOrder={order}
                onPress={() => router.push(`/operator/assembly-guide?id=${order.id}`)}
              />
            ))
          )}
        </View>

        {/* Proyectos Compartidos */}
        <View style={styles.projectsContainer}>
          <Text style={styles.sectionTitle}>Proyectos Compartidos ({operatorProjects.length})</Text>
          {operatorProjects.length === 0 ? (
            <Text style={styles.emptyText}>No hay proyectos compartidos</Text>
          ) : (
            operatorProjects.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.projectRow}
                onPress={() => router.push(`/shared/project-comments?projectId=${p.id}`)}
              >
                <View style={styles.projectIcon}>
                  <Text style={styles.projectIconText}>🛠️</Text>
                </View>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{p.name}</Text>
                  <Text style={styles.projectMeta}>Cliente: {p.client} • {p.createdAt}</Text>
                </View>
                <View style={styles.projectStatusBadge}>
                  <Text style={styles.projectStatusText}>{p.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/operator/work-orders')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Órdenes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/operator/qr-scanner')}>
          <Text style={styles.navIcon}>📷</Text>
          <Text style={styles.navLabel}>Escanear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/operator/profile')}>
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
  scrollView: {
    flex: 1,
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
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xs,
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
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.base.blackPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  scanButtonText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.grays.light,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.base.blackPrimary,
    borderColor: Colors.base.blackPrimary,
  },
  filterText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  filterTextActive: {
    color: Colors.base.whitePrimary,
    fontWeight: Typography.weights.semibold,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.md,
  },
  quickActionsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.grays.light,
    minHeight: 110,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.base.blackPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    textAlign: 'center',
  },
  ordersContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.base.whitePrimary,
  },
  emptyText: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
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
  // Modal de Notificaciones
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  notificationModal: {
    backgroundColor: Colors.base.whitePrimary,
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
    borderBottomColor: Colors.grays.light,
  },
  modalTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
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
    color: Colors.base.blackPrimary,
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
  projectsContainer: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.base.whitePrimary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grays.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectIconText: {
    fontSize: 20,
  },
  projectInfo: { flex: 1 },
  projectName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.base.blackPrimary,
  },
  projectMeta: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  projectStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.functional.info,
    borderRadius: 12,
  },
  projectStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.base.whitePrimary,
  },
});

