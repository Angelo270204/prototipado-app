/**
 * WorkOrderCard Component - Molecular Design
 * Tarjeta de orden de trabajo con borde lateral según prioridad
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WorkOrder } from '@/data/mockData';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onPress: () => void;
}

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder, onPress }) => {
  const getPriorityColor = (priority: WorkOrder['priority']) => {
    return Colors.priority[priority];
  };

  const getPriorityText = (priority: WorkOrder['priority']) => {
    const priorityMap = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      normal: 'Normal',
    };
    return priorityMap[priority];
  };

  const getStatusColor = (status: WorkOrder['status']) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'in_progress':
        return Colors.focus;
      case 'paused':
        return Colors.warning;
      case 'pending':
        return Colors.text.secondary;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.text.secondary;
    }
  };

  const getStatusText = (status: WorkOrder['status']) => {
    const statusMap = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      paused: 'Pausada',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };
    return statusMap[status];
  };

  const isOverdue = () => {
    const dueDate = new Date(workOrder.dueDate);
    const today = new Date();
    return dueDate < today && workOrder.status !== 'completed';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Borde lateral según prioridad */}
      <View
        style={[
          styles.priorityBorder,
          { backgroundColor: getPriorityColor(workOrder.priority) },
        ]}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.orderNumber}>OT-{workOrder.id.toUpperCase()}</Text>
            <Text style={styles.projectName} numberOfLines={1}>
              {workOrder.projectName}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(workOrder.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(workOrder.status)}</Text>
          </View>
        </View>

        {/* Operario asignado */}
        {workOrder.operatorName && (
          <View style={styles.operatorSection}>
            <Text style={styles.operatorLabel}>Operario:</Text>
            <Text style={styles.operatorName}>{workOrder.operatorName}</Text>
          </View>
        )}

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${workOrder.progress}%`,
                  backgroundColor: getStatusColor(workOrder.status),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {workOrder.completedSteps}/{workOrder.totalSteps}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prioridad:</Text>
            <Text
              style={[
                styles.priorityText,
                { color: getPriorityColor(workOrder.priority) },
              ]}
            >
              {getPriorityText(workOrder.priority)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vencimiento:</Text>
            <Text
              style={[
                styles.dueDateText,
                isOverdue() && styles.overdueText,
              ]}
            >
              {new Date(workOrder.dueDate).toLocaleDateString('es-PE')}
            </Text>
          </View>
        </View>

        {/* QR Code Info */}
        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>QR:</Text>
          <Text style={styles.qrCode}>{workOrder.qrCode}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.cardDark,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  priorityBorder: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  orderNumber: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  projectName: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.background.darker,
  },
  operatorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  operatorLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  operatorName: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background.darker,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  priorityText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
  },
  dueDateText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
  },
  overdueText: {
    color: Colors.error,
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.background.darker,
  },
  qrLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  qrCode: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.focus,
    fontFamily: 'monospace',
  },
});
