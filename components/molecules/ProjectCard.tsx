/**
 * ProjectCard Component - Molecular Design
 * Tarjeta de proyecto para diseñadores y clientes
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Project } from '@/data/mockData';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return Colors.functional.success; // Verde industrial
      case 'in_progress':
        return Colors.functional.info; // Azul funcional
      case 'validation':
        return Colors.functional.warning; // Amarillo
      case 'pending':
        return Colors.grays.dark; // Gris oscuro
      default:
        return Colors.grays.dark;
    }
  };

  const getStatusText = (status: Project['status']) => {
    const statusMap = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      validation: 'En Validación',
      approved: 'Aprobado',
      completed: 'Completado',
    };
    return statusMap[status];
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.projectName} numberOfLines={1}>
            {project.name}
          </Text>
          <Text style={styles.client}>{project.client}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
          <Text style={styles.statusText}>{getStatusText(project.status)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${project.progress}%`,
                backgroundColor: getStatusColor(project.status),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{project.progress}%</Text>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Piezas:</Text>
          <Text style={styles.infoValue}>{project.parts}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Actualizado:</Text>
          <Text style={styles.infoValue}>
            {new Date(project.updatedAt).toLocaleDateString('es-PE')}
          </Text>
        </View>
      </View>

      {project.validationRequired && (project.status === 'pending' || project.status === 'in_progress' || project.status === 'validation') && (
        <View style={styles.validationBadge}>
          <Text style={styles.validationText}>⚠️ Requiere Validación AR</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.base.blackPrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  projectName: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
    marginBottom: Spacing.xs,
  },
  client: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.light,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    textAlign: 'center',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.grays.medium,
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
    color: Colors.base.whitePrimary,
    minWidth: 40,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.grays.medium,
    marginRight: Spacing.xs,
  },
  infoValue: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.base.whitePrimary,
  },
  validationBadge: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.warning.background,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.functional.warning,
  },
  validationText: {
    fontSize: Typography.sizes.caption,
    color: Colors.base.blackPrimary,
    fontWeight: Typography.weights.semibold,
  },
});
