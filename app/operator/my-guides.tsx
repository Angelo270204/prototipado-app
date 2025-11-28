/**
 * My Guides Screen
 * Vista que lista todas las guías de ensamblaje asignadas al operario
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
import { mockWorkOrders, mockAssemblySteps } from '@/data/mockData';

export default function MyGuidesScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Obtener las guías asociadas a las órdenes de trabajo
  const guidesData = mockWorkOrders.map((workOrder) => {
    const steps = mockAssemblySteps.filter((step) => step.workOrderId === workOrder.id);
    const completedSteps = steps.filter((step) => step.completed).length;
    const progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

    return {
      id: workOrder.id,
      workOrderId: workOrder.id,
      projectName: workOrder.projectName,
      status: workOrder.status,
      priority: workOrder.priority,
      totalSteps: steps.length,
      completedSteps,
      progress,
      dueDate: workOrder.dueDate,
      estimatedTime: 8, // Tiempo estimado por defecto
    };
  });

  const filteredGuides = selectedFilter === 'all'
    ? guidesData
    : guidesData.filter(guide => guide.status === selectedFilter);

  const filters = [
    { key: 'all', label: 'Todas', count: guidesData.length },
    { key: 'in_progress', label: 'En Progreso', count: guidesData.filter(g => g.status === 'in_progress').length },
    { key: 'completed', label: 'Completadas', count: guidesData.filter(g => g.status === 'completed').length },
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completada', color: Colors.success.main, icon: 'checkmark-circle' };
      case 'in_progress':
        return { label: 'En Progreso', color: Colors.info.main, icon: 'time' };
      case 'pending':
        return { label: 'Pendiente', color: Colors.warning.main, icon: 'hourglass' };
      default:
        return { label: 'Desconocido', color: Colors.text.secondary, icon: 'help-circle' };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { label: 'Alta', color: Colors.error.main };
      case 'medium':
        return { label: 'Media', color: Colors.warning.main };
      case 'low':
        return { label: 'Baja', color: Colors.success.main };
      default:
        return { label: 'Normal', color: Colors.text.secondary };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Guías de Ensamblaje</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {}}
        >
          <Ionicons name="search-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="book-outline" size={32} color={Colors.primary.main} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryTitle}>Total de Guías</Text>
              <Text style={styles.summaryValue}>{guidesData.length}</Text>
            </View>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>
                {guidesData.filter(g => g.status === 'in_progress').length}
              </Text>
              <Text style={styles.summaryStatLabel}>En Progreso</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatValue, { color: Colors.success.main }]}>
                {guidesData.filter(g => g.status === 'completed').length}
              </Text>
              <Text style={styles.summaryStatLabel}>Completadas</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatValue, { color: Colors.warning.main }]}>
                {guidesData.filter(g => g.status === 'pending').length}
              </Text>
              <Text style={styles.summaryStatLabel}>Pendientes</Text>
            </View>
          </View>
        </View>

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
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Guides List */}
        <View style={styles.guidesContainer}>
          {filteredGuides.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color={Colors.text.tertiary} />
              <Text style={styles.emptyStateTitle}>No hay guías</Text>
              <Text style={styles.emptyStateText}>
                No tienes guías de ensamblaje en esta categoría
              </Text>
            </View>
          ) : (
            filteredGuides.map((guide) => {
              const statusInfo = getStatusInfo(guide.status);
              const priorityInfo = getPriorityInfo(guide.priority);

              return (
                <TouchableOpacity
                  key={guide.id}
                  style={styles.guideCard}
                  onPress={() => router.push(`/operator/assembly-guide?id=${guide.workOrderId}`)}
                >
                  {/* Header */}
                  <View style={styles.guideHeader}>
                    <View style={styles.guideHeaderLeft}>
                      <Text style={styles.guideOrderId}>OT-{guide.workOrderId.toUpperCase()}</Text>
                      <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.color + '20' }]}>
                        <Text style={[styles.priorityText, { color: priorityInfo.color }]}>
                          {priorityInfo.label}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
                      <Ionicons name={statusInfo.icon as any} size={16} color={statusInfo.color} />
                      <Text style={[styles.statusText, { color: statusInfo.color }]}>
                        {statusInfo.label}
                      </Text>
                    </View>
                  </View>

                  {/* Project Name */}
                  <Text style={styles.guideProjectName}>{guide.projectName}</Text>

                  {/* Progress */}
                  <View style={styles.guideProgress}>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressLabel}>Progreso</Text>
                      <Text style={styles.progressText}>
                        {guide.completedSteps} de {guide.totalSteps} pasos
                      </Text>
                    </View>
                    <Text style={styles.progressPercentage}>{guide.progress}%</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${guide.progress}%`, backgroundColor: statusInfo.color }
                        ]}
                      />
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={styles.guideFooter}>
                    <View style={styles.guideFooterItem}>
                      <Ionicons name="time-outline" size={16} color={Colors.text.tertiary} />
                      <Text style={styles.guideFooterText}>
                        ~{guide.estimatedTime}h estimadas
                      </Text>
                    </View>
                    <View style={styles.guideFooterItem}>
                      <Ionicons name="calendar-outline" size={16} color={Colors.text.tertiary} />
                      <Text style={styles.guideFooterText}>
                        {new Date(guide.dueDate).toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  <View style={styles.guideAction}>
                    <Text style={styles.guideActionText}>
                      {guide.status === 'completed'
                        ? 'Ver Detalles'
                        : guide.status === 'in_progress'
                        ? 'Continuar'
                        : 'Iniciar'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.primary.main} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Quick Actions */}
        {filteredGuides.length > 0 && (
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push('/operator/qr-scanner')}
              >
                <Ionicons name="qr-code-outline" size={28} color={Colors.primary.main} />
                <Text style={styles.quickActionLabel}>Escanear QR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push('/operator/progress')}
              >
                <Ionicons name="stats-chart-outline" size={28} color={Colors.info.main} />
                <Text style={styles.quickActionLabel}>Ver Progreso</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  searchButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  summaryCard: {
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryInfo: {
    marginLeft: Spacing.md,
  },
  summaryTitle: {
    fontSize: Typography.sizes.body,
    color: Colors.base.whitePrimary,
    opacity: 0.9,
  },
  summaryValue: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
    marginBottom: Spacing.xs / 2,
  },
  summaryStatLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.base.whitePrimary,
    opacity: 0.9,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.background.border,
  },
  filterChipActive: {
    backgroundColor: Colors.base.blackPrimary,
    borderColor: Colors.base.blackPrimary,
  },
  filterText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.base.whitePrimary,
    fontWeight: Typography.weights.bold,
  },
  guidesContainer: {
    gap: Spacing.md,
  },
  guideCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.background.border,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  guideHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  guideOrderId: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.main,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  priorityText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
  guideProjectName: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  guideProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs / 2,
  },
  progressText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  progressPercentage: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.main,
  },
  progressBarContainer: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  guideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.background.primary,
  },
  guideFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  guideFooterText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.tertiary,
  },
  guideAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary.light + '20',
    borderRadius: BorderRadius.md,
  },
  guideActionText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary.main,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.secondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: Typography.sizes.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  quickActionsSection: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
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

