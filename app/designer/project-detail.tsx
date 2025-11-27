/**
 * Designer Project Detail Screen
 * Pantalla de detalle de proyecto para diseñadores
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { useApp } from '@/contexts/AppContext';

export default function DesignerProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { projects } = useApp();
  const [activeTab, setActiveTab] = useState<'info' | 'progress' | 'files'>('info');

  // Encontrar el proyecto
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Proyecto no encontrado</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return Colors.functional.success;
      case 'in_progress':
        return Colors.functional.info;
      case 'validation':
        return Colors.functional.warning;
      case 'pending':
        return Colors.grays.dark;
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
      completed: 'Completado',
    };
    return statusMap[status] || status;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Project Header */}
        <View style={styles.projectHeader}>
          <View style={styles.projectTitleContainer}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.clientName}>{project.client}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
            <Text style={styles.statusText}>{getStatusText(project.status)}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso General</Text>
            <Text style={styles.progressPercentage}>{project.progress}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${project.progress}%`,
                  backgroundColor: getStatusColor(project.status),
                },
              ]}
            />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.tabActive]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
              Información
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'progress' && styles.tabActive]}
            onPress={() => setActiveTab('progress')}
          >
            <Text style={[styles.tabText, activeTab === 'progress' && styles.tabTextActive]}>
              Progreso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'files' && styles.tabActive]}
            onPress={() => setActiveTab('files')}
          >
            <Text style={[styles.tabText, activeTab === 'files' && styles.tabTextActive]}>
              Archivos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'info' && (
            <View style={styles.infoTab}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Detalles del Proyecto</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ID:</Text>
                  <Text style={styles.infoValue}>{project.id.toUpperCase()}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cliente:</Text>
                  <Text style={styles.infoValue}>{project.client}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Total de Piezas:</Text>
                  <Text style={styles.infoValue}>{project.parts}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fecha de Creación:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(project.createdAt).toLocaleDateString('es-PE')}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Última Actualización:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(project.updatedAt).toLocaleDateString('es-PE')}
                  </Text>
                </View>
                {(project.status === 'pending' || project.status === 'in_progress' || project.status === 'validation') && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Validación AR:</Text>
                    <Text style={[styles.infoValue, { color: project.validationRequired ? '#F59E0B' : '#10B981' }]}>
                      {project.validationRequired ? '⚠️ Pendiente' : '✅ Completada'}
                    </Text>
                  </View>
                )}
              </View>

              {project.validationRequired && (project.status === 'pending' || project.status === 'in_progress' || project.status === 'validation') && (
                <View style={[styles.infoCard, { backgroundColor: '#FEF3C7', borderLeftWidth: 4, borderLeftColor: '#F59E0B' }]}>
                  <Text style={[styles.infoCardTitle, { color: '#92400E' }]}>⚠️ Validación AR Requerida</Text>
                  <Text style={[styles.descriptionText, { color: '#78350F' }]}>
                    Este proyecto requiere validación en Realidad Aumentada antes de continuar con la producción.
                    Importa el modelo CAD y valida en AR para detectar colisiones y generar guías de ensamblaje.
                  </Text>
                </View>
              )}

              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Descripción del Proyecto</Text>
                <Text style={styles.descriptionText}>
                  Proyecto de diseño industrial para {project.client}. Incluye {project.parts} piezas
                  con especificaciones técnicas detalladas y modelos CAD completos para validación AR.
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'progress' && (
            <View style={styles.progressTab}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Estado de las Piezas</Text>
                <View style={styles.piecesList}>
                  {[...Array(Math.min(project.parts, 5))].map((_, index) => (
                    <View key={index} style={styles.pieceItem}>
                      <View style={styles.pieceInfo}>
                        <Text style={styles.pieceName}>Pieza #{index + 1}</Text>
                        <Text style={styles.pieceStatus}>
                          {index < project.parts * (project.progress / 100) ? '✓ Completada' : '◯ Pendiente'}
                        </Text>
                      </View>
                      <View style={styles.pieceProgressBar}>
                        <View
                          style={[
                            styles.pieceProgressFill,
                            {
                              width: index < project.parts * (project.progress / 100) ? '100%' : '0%',
                              backgroundColor: '#10B981',
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                  {project.parts > 5 && (
                    <Text style={styles.moreItemsText}>
                      +{project.parts - 5} piezas más
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Historial de Cambios</Text>
                <View style={styles.historyItem}>
                  <View style={styles.historyDot} />
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>Proyecto actualizado</Text>
                    <Text style={styles.historyDate}>
                      {new Date(project.updatedAt).toLocaleDateString('es-PE')}
                    </Text>
                  </View>
                </View>
                <View style={styles.historyItem}>
                  <View style={styles.historyDot} />
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>Proyecto creado</Text>
                    <Text style={styles.historyDate}>
                      {new Date(project.createdAt).toLocaleDateString('es-PE')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'files' && (
            <View style={styles.filesTab}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Archivos CAD</Text>
                <View style={styles.filesList}>
                  <TouchableOpacity style={styles.fileItem} onPress={() => Alert.alert('Archivo CAD', 'Abriendo modelo 3D...')}>
                    <Text style={styles.fileIcon}>📐</Text>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>{project.name}.dwg</Text>
                      <Text style={styles.fileSize}>2.4 MB</Text>
                    </View>
                    <Text style={styles.fileAction}>→</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.fileItem} onPress={() => Alert.alert('Archivo CAD', 'Abriendo modelo 3D...')}>
                    <Text style={styles.fileIcon}>🔷</Text>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>{project.name}.step</Text>
                      <Text style={styles.fileSize}>3.1 MB</Text>
                    </View>
                    <Text style={styles.fileAction}>→</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Documentos</Text>
                <View style={styles.filesList}>
                  <TouchableOpacity style={styles.fileItem} onPress={() => Alert.alert('Documento', 'Abriendo PDF...')}>
                    <Text style={styles.fileIcon}>📄</Text>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>Especificaciones.pdf</Text>
                      <Text style={styles.fileSize}>1.2 MB</Text>
                    </View>
                    <Text style={styles.fileAction}>→</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.fileItem} onPress={() => Alert.alert('Documento', 'Abriendo PDF...')}>
                    <Text style={styles.fileIcon}>📊</Text>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>Planos.pdf</Text>
                      <Text style={styles.fileSize}>4.8 MB</Text>
                    </View>
                    <Text style={styles.fileAction}>→</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.actionsSectionTitle}>Acciones</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/designer/ar-viewer')}
            >
              <Text style={styles.actionButtonIcon}>🥽</Text>
              <Text style={styles.actionButtonText}>Validar AR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10B981' }]}
              onPress={() => router.push(`/shared/project-comments?projectId=${id}`)}
            >
              <Text style={styles.actionButtonIcon}>💬</Text>
              <Text style={styles.actionButtonText}>Comentarios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#1E40AF' }]}
              onPress={() => Alert.alert('Editar', 'Abriendo editor de proyecto...')}
            >
              <Text style={styles.actionButtonIcon}>✏️</Text>
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#7C3AED' }]}
              onPress={() => Alert.alert('Compartir', 'Compartiendo proyecto...')}
            >
              <Text style={styles.actionButtonIcon}>📤</Text>
              <Text style={styles.actionButtonText}>Compartir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#DC2626' }]}
              onPress={() => Alert.alert('Eliminar', '¿Seguro que deseas eliminar este proyecto?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive' },
              ])}
            >
              <Text style={styles.actionButtonIcon}>🗑️</Text>
              <Text style={styles.actionButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
    backgroundColor: Colors.base.whitePrimary,
  },
  backButton: {
    paddingVertical: Spacing.xs,
  },
  backButtonText: {
    fontSize: Typography.sizes.h2,
    color: Colors.base.blackPrimary,
    fontWeight: Typography.weights.semibold,
  },
  projectHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  projectTitleContainer: {
    marginBottom: Spacing.sm,
  },
  projectName: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  clientName: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  progressSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  progressPercentage: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: '#10B981',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#10B981',
  },
  tabText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: '#10B981',
    fontWeight: Typography.weights.bold,
  },
  tabContent: {
    paddingHorizontal: Spacing.lg,
  },
  infoTab: {
    gap: Spacing.md,
  },
  progressTab: {
    gap: Spacing.md,
  },
  filesTab: {
    gap: Spacing.md,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoCardTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  infoValue: {
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semibold,
  },
  descriptionText: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  piecesList: {
    gap: Spacing.md,
  },
  pieceItem: {
    gap: Spacing.xs,
  },
  pieceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pieceName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  pieceStatus: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  pieceProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  pieceProgressFill: {
    height: '100%',
  },
  moreItemsText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    marginTop: 4,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  historyDate: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  filesList: {
    gap: Spacing.sm,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.sm,
    gap: Spacing.md,
  },
  fileIcon: {
    fontSize: 28,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  fileAction: {
    fontSize: Typography.sizes.h3,
    color: '#10B981',
  },
  actionsSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  actionsSectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionButton: {
    width: '48.5%',
    backgroundColor: '#059669',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  actionButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.sizes.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  backLink: {
    fontSize: Typography.sizes.body,
    color: '#10B981',
    fontWeight: Typography.weights.semibold,
  },
});