/**
 * Progress Overview Screen
 * Vista general del progreso de órdenes de trabajo del operario
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { mockWorkOrders } from '@/data/mockData';

export default function ProgressOverviewScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Cálculos de estadísticas
  const totalOrders = mockWorkOrders.length;
  const completedOrders = mockWorkOrders.filter(wo => wo.status === 'completed').length;
  const inProgressOrders = mockWorkOrders.filter(wo => wo.status === 'in_progress').length;
  const pendingOrders = mockWorkOrders.filter(wo => wo.status === 'pending').length;

  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  const stats = [
    {
      label: 'Total Órdenes',
      value: totalOrders.toString(),
      icon: 'document-text-outline',
      color: Colors.primary.main,
      subtitle: 'Asignadas'
    },
    {
      label: 'Completadas',
      value: completedOrders.toString(),
      icon: 'checkmark-circle-outline',
      color: Colors.success.main,
      subtitle: `${completionRate}% completado`
    },
    {
      label: 'En Progreso',
      value: inProgressOrders.toString(),
      icon: 'time-outline',
      color: Colors.info.main,
      subtitle: 'Trabajando'
    },
    {
      label: 'Pendientes',
      value: pendingOrders.toString(),
      icon: 'hourglass-outline',
      color: Colors.warning.main,
      subtitle: 'Por iniciar'
    },
  ];

  const recentActivity = [
    {
      id: '1',
      orderId: 'WO-HSE2024-001',
      projectName: 'Sistema Hidráulico B',
      action: 'Completó 8 de 10 pasos',
      progress: 80,
      time: 'Hace 2 horas',
      status: 'in_progress' as const,
    },
    {
      id: '2',
      orderId: 'WO-MOTOR-003',
      projectName: 'Motor Industrial V3',
      action: 'Orden completada',
      progress: 100,
      time: 'Hace 5 horas',
      status: 'completed' as const,
    },
    {
      id: '3',
      orderId: 'WO-CHUTE-002',
      projectName: 'Estructura de Apoyo',
      action: 'Iniciado - Paso 1 de 6',
      progress: 16,
      time: 'Hace 1 día',
      status: 'in_progress' as const,
    },
  ];

  const periods = [
    { key: 'today', label: 'Hoy' },
    { key: 'week', label: 'Esta Semana' },
    { key: 'month', label: 'Este Mes' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success.main;
      case 'in_progress':
        return Colors.info.main;
      case 'pending':
        return Colors.warning.main;
      default:
        return Colors.text.secondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Progreso</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {}}
        >
          <Ionicons name="options-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.key && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Progress Card */}
        <View style={styles.mainProgressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.mainProgressTitle}>Progreso General</Text>
            <Text style={styles.mainProgressPercentage}>{completionRate}%</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
            </View>
          </View>

          <View style={styles.progressDetails}>
            <View style={styles.progressDetailItem}>
              <View style={[styles.progressDot, { backgroundColor: Colors.success.main }]} />
              <Text style={styles.progressDetailText}>
                {completedOrders} Completadas
              </Text>
            </View>
            <View style={styles.progressDetailItem}>
              <View style={[styles.progressDot, { backgroundColor: Colors.info.main }]} />
              <Text style={styles.progressDetailText}>
                {inProgressOrders} En Progreso
              </Text>
            </View>
            <View style={styles.progressDetailItem}>
              <View style={[styles.progressDot, { backgroundColor: Colors.warning.main }]} />
              <Text style={styles.progressDetailText}>
                {pendingOrders} Pendientes
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={28} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
            </View>
          ))}
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas de Rendimiento</Text>
          <View style={styles.metricsCard}>
            <View style={styles.metricItem}>
              <View style={styles.metricLeft}>
                <Ionicons name="speedometer-outline" size={24} color={Colors.success.main} />
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Eficiencia</Text>
                  <Text style={styles.metricValue}>94%</Text>
                </View>
              </View>
              <View style={styles.trendUp}>
                <Ionicons name="trending-up" size={20} color={Colors.success.main} />
                <Text style={styles.trendText}>+5%</Text>
              </View>
            </View>

            <View style={styles.metricItem}>
              <View style={styles.metricLeft}>
                <Ionicons name="time-outline" size={24} color={Colors.info.main} />
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Tiempo Promedio</Text>
                  <Text style={styles.metricValue}>4.2 hrs/orden</Text>
                </View>
              </View>
            </View>

            <View style={styles.metricItem}>
              <View style={styles.metricLeft}>
                <Ionicons name="star-outline" size={24} color={Colors.warning.main} />
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Calidad</Text>
                  <Text style={styles.metricValue}>4.8/5.0</Text>
                </View>
              </View>
              <View style={styles.stars}>
                <Ionicons name="star" size={16} color={Colors.warning.main} />
                <Ionicons name="star" size={16} color={Colors.warning.main} />
                <Ionicons name="star" size={16} color={Colors.warning.main} />
                <Ionicons name="star" size={16} color={Colors.warning.main} />
                <Ionicons name="star-half" size={16} color={Colors.warning.main} />
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          {recentActivity.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              onPress={() => router.push(`/operator/assembly-guide?id=${activity.orderId}`)}
            >
              <View style={styles.activityHeader}>
                <View style={styles.activityLeft}>
                  <Text style={styles.activityOrderId}>{activity.orderId}</Text>
                  <Text style={styles.activityProjectName}>{activity.projectName}</Text>
                </View>
                <View style={[styles.activityStatus, { backgroundColor: getStatusColor(activity.status) + '20' }]}>
                  <Text style={[styles.activityStatusText, { color: getStatusColor(activity.status) }]}>
                    {activity.status === 'completed' ? 'Completada' : 'En Progreso'}
                  </Text>
                </View>
              </View>

              <Text style={styles.activityAction}>{activity.action}</Text>

              <View style={styles.activityProgressContainer}>
                <View style={styles.activityProgressBar}>
                  <View
                    style={[
                      styles.activityProgressFill,
                      { width: `${activity.progress}%`, backgroundColor: getStatusColor(activity.status) }
                    ]}
                  />
                </View>
                <Text style={styles.activityProgressText}>{activity.progress}%</Text>
              </View>

              <View style={styles.activityFooter}>
                <View style={styles.activityTime}>
                  <Ionicons name="time-outline" size={14} color={Colors.text.tertiary} />
                  <Text style={styles.activityTimeText}>{activity.time}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/operator/work-orders')}
            >
              <Ionicons name="document-text-outline" size={32} color={Colors.primary.main} />
              <Text style={styles.quickActionLabel}>Mis Órdenes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/operator/report-issue')}
            >
              <Ionicons name="alert-circle-outline" size={32} color={Colors.warning.main} />
              <Text style={styles.quickActionLabel}>Reportar</Text>
            </TouchableOpacity>
          </View>
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
  filterButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.background.border,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.base.blackPrimary,
    borderColor: Colors.base.blackPrimary,
  },
  periodText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  periodTextActive: {
    color: Colors.base.whitePrimary,
    fontWeight: Typography.weights.bold,
  },
  mainProgressCard: {
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  mainProgressTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
  mainProgressPercentage: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
  progressBarContainer: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.sm,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  progressDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.xs,
  },
  progressDetailText: {
    fontSize: Typography.sizes.caption,
    color: Colors.base.whitePrimary,
    fontWeight: Typography.weights.medium,
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
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs / 2,
  },
  statLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xs / 2,
  },
  statSubtitle: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.tertiary,
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
  metricsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricInfo: {
    marginLeft: Spacing.md,
  },
  metricLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
  },
  metricValue: {
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
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  activityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  activityLeft: {
    flex: 1,
  },
  activityOrderId: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.main,
    marginBottom: Spacing.xs / 2,
  },
  activityProjectName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  activityStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  activityStatusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
  activityAction: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  activityProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  activityProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  activityProgressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  activityProgressText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.text.secondary,
    minWidth: 35,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  activityTimeText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.tertiary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  quickActionLabel: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});

