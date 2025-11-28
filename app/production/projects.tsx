/**
 * Production Projects Screen
 * Vista de todos los proyectos para supervisor de producción
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import NotificationBadge from '@/components/molecules/NotificationBadge';

export default function ProductionProjectsScreen() {
  const router = useRouter();
  const { unreadCount, addNotification } = useAuth();
  const { projects } = useApp();
  const [filter, setFilter] = useState<'all' | 'approved' | 'in_assembly' | 'completed'>('all');

  // Proyectos compartidos con producción (solo los que incluyen 'production' en sharedRoles)
  const productionProjects = projects.filter(p => p.sharedRoles?.includes('production'));
  const filteredProjects = filter === 'all'
    ? productionProjects
    : productionProjects.filter(p => p.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return Colors.functional.success;
      case 'in_progress':
      case 'in_assembly':
        return Colors.functional.info;
      case 'validation':
      case 'pending':
        return Colors.functional.warning;
      default:
        return Colors.grays.dark;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      validation: 'En Validación',
      approved: 'Aprobado',
      in_assembly: 'En Ensamblaje',
      completed: 'Completado',
      draft: 'Borrador',
      pending_client: 'Revisión Cliente',
      rejected: 'Rechazado',
    };
    return statusMap[status] || status;
  };

  const handleAssignWorkOrder = (projectId: string, projectName: string) => {
    Alert.alert(
      'Asignar Orden de Trabajo',
      `¿Crear orden de trabajo para "${projectName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Asignar',
          onPress: () => {
            const woId = `WO-${Date.now()}`;
            // Simular notificación al operador
            addNotification({
              userId: 'u3', // Angelo Operador
              type: 'work_order_assigned',
              title: 'Nueva Orden de Trabajo',
              message: `Se te ha asignado la orden ${woId} para el proyecto "${projectName}"`,
              projectId,
              projectName,
              fromUserId: 'u4',
              fromUserName: 'Stephano Centeno',
            });
            Alert.alert('Éxito', `Orden de trabajo ${woId} creada y asignada`);
          },
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.base.blackPrimary} />
            </TouchableOpacity>
            <Text style={styles.title}>Proyectos</Text>
            <Text style={styles.subtitle}>{filteredProjects.length} proyectos</Text>
          </View>
          <NotificationBadge
            count={unreadCount}
            onPress={() => router.push('/production/dashboard')}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {[
            { key: 'all', label: 'Todos' },
            { key: 'approved', label: 'Aprobados' },
            { key: 'in_assembly', label: 'En Ensamblaje' },
            { key: 'completed', label: 'Completados' },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterChip,
                filter === f.key && styles.filterChipActive,
              ]}
              onPress={() => setFilter(f.key as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f.key && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Projects List */}
        <View style={styles.projectsList}>
          {filteredProjects.map((project) => (
            <View key={project.id} style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <View style={styles.projectTitleRow}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(project.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(project.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.projectClient}>Cliente: {project.client}</Text>
              </View>

              <View style={styles.projectDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="cube-outline" size={16} color={Colors.grays.dark} />
                  <Text style={styles.detailText}>{project.parts} piezas</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.grays.dark} />
                  <Text style={styles.detailText}>{project.createdAt}</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${project.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{project.progress}%</Text>
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push(`/shared/project-comments?projectId=${project.id}`)}
                >
                  <Ionicons name="chatbubbles" size={18} color={Colors.base.whitePrimary} />
                  <Text style={styles.actionButtonText}>Chat</Text>
                </TouchableOpacity>

                {project.status === 'approved' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryActionButton]}
                    onPress={() => handleAssignWorkOrder(project.id, project.name)}
                  >
                    <Ionicons name="add-circle" size={18} color={Colors.base.whitePrimary} />
                    <Text style={styles.actionButtonText}>Asignar OT</Text>
                  </TouchableOpacity>
                )}
              </View>
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
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
  },
  backButton: {
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  filtersContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  filterChipActive: {
    backgroundColor: Colors.base.blackPrimary,
    borderColor: Colors.base.blackPrimary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.base.whitePrimary,
  },
  projectsList: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  projectCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  projectHeader: {
    gap: Spacing.xs,
  },
  projectTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  projectName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  projectClient: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  projectDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: Colors.grays.dark,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.grays.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.functional.info,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    minWidth: 35,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.grays.dark,
    borderRadius: BorderRadius.sm,
  },
  primaryActionButton: {
    backgroundColor: Colors.functional.success,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
});
