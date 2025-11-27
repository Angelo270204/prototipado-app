/**
 * Detalle de Proyecto (Cliente)
 * Vista detallada de un proyecto para clientes
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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Button } from '@/components/atoms/Button';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';

export default function ClientProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { projects } = useApp();
  const project = projects.find((p) => p.id === id);

  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'files'>('details');

  if (!project) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Proyecto no encontrado</Text>
          <Button
            title="Volver"
            onPress={() => router.back()}
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      validation: 'En Validación',
      approved: 'Aprobado',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  // Convertir el status del proyecto a un tipo compatible con StatusBadge
  const getStatusBadgeType = (status: string): 'pending' | 'in_progress' | 'validation' | 'completed' | 'warning' => {
    if (status === 'approved') return 'completed';
    if (status === 'pending' || status === 'in_progress' || status === 'validation' || status === 'completed') {
      return status as 'pending' | 'in_progress' | 'validation' | 'completed';
    }
    return 'pending';
  };

  const timeline = [
    { date: '15 Ene 2024', event: 'Proyecto creado', status: 'completed' },
    { date: '16 Ene 2024', event: 'Diseño inicial aprobado', status: 'completed' },
    { date: '18 Ene 2024', event: 'Producción iniciada', status: 'completed' },
    { date: '22 Ene 2024', event: 'En proceso de ensamblaje', status: 'in_progress' },
    { date: 'Por definir', event: 'Revisión de calidad', status: 'pending' },
    { date: 'Por definir', event: 'Entrega final', status: 'pending' },
  ];

  const files = [
    { name: 'Plano_Principal.pdf', size: '2.4 MB', date: '15 Ene 2024', type: 'pdf' },
    { name: 'Especificaciones.docx', size: '856 KB', date: '15 Ene 2024', type: 'doc' },
    { name: 'Modelo_3D.step', size: '12.3 MB', date: '16 Ene 2024', type: '3d' },
    { name: 'Lista_Materiales.xlsx', size: '124 KB', date: '16 Ene 2024', type: 'excel' },
  ];

  const handleViewAR = () => {
    router.push(`/client/ar-view?id=${project.id}`);
  };

  const handleRequestChange = () => {
    Alert.alert(
      'Solicitar Cambio',
      'Esta función permitirá solicitar modificaciones al proyecto',
      [{ text: 'OK' }]
    );
  };

  const handleDownloadFile = (fileName: string) => {
    Alert.alert('Descargar', `Descargando ${fileName}...`, [{ text: 'OK' }]);
  };

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
        <Text style={styles.headerTitle}>Detalle del Proyecto</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Project Header Card */}
      <View style={styles.projectHeader}>
        <View style={styles.projectHeaderTop}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectId}>#{project.id.toUpperCase()}</Text>
            <Text style={styles.projectName}>{project.name}</Text>
          </View>
          <StatusBadge
            status={getStatusBadgeType(project.status)}
            label={getStatusLabel(project.status)}
          />
        </View>
        
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.metaText}>Inicio: {project.createdAt}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.metaText}>Última actualización: {project.updatedAt}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso del Proyecto</Text>
            <Text style={styles.progressValue}>{project.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${project.progress}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'details' && styles.tabActive]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
            Detalles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'timeline' && styles.tabActive]}
          onPress={() => setActiveTab('timeline')}
        >
          <Text style={[styles.tabText, activeTab === 'timeline' && styles.tabTextActive]}>
            Línea de Tiempo
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

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'details' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción del Proyecto</Text>
              <Text style={styles.description}>
                Proyecto de manufactura que incluye diseño, fabricación y ensamblaje de componentes metálicos
                de alta precisión. Este proyecto requiere soldadura especializada, maquinado CNC y acabados
                de calidad industrial.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Especificaciones Técnicas</Text>
              <View style={styles.specsList}>
                <View style={styles.specItem}>
                  <Ionicons name="cube-outline" size={20} color={Colors.primary.main} />
                  <View style={styles.specContent}>
                    <Text style={styles.specLabel}>Material Principal</Text>
                    <Text style={styles.specValue}>Acero estructural A36</Text>
                  </View>
                </View>
                <View style={styles.specItem}>
                  <Ionicons name="resize-outline" size={20} color={Colors.primary.main} />
                  <View style={styles.specContent}>
                    <Text style={styles.specLabel}>Dimensiones</Text>
                    <Text style={styles.specValue}>2.5m × 1.8m × 0.9m</Text>
                  </View>
                </View>
                <View style={styles.specItem}>
                  <Ionicons name="barbell-outline" size={20} color={Colors.primary.main} />
                  <View style={styles.specContent}>
                    <Text style={styles.specLabel}>Peso Estimado</Text>
                    <Text style={styles.specValue}>450 kg</Text>
                  </View>
                </View>
                <View style={styles.specItem}>
                  <Ionicons name="color-palette-outline" size={20} color={Colors.primary.main} />
                  <View style={styles.specContent}>
                    <Text style={styles.specLabel}>Acabado</Text>
                    <Text style={styles.specValue}>Pintura epoxi anticorrosiva</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Equipo Asignado</Text>
              <View style={styles.teamList}>
                <View style={styles.teamMember}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>MG</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>María González</Text>
                    <Text style={styles.memberRole}>Diseñadora Principal</Text>
                  </View>
                </View>
                <View style={styles.teamMember}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>RC</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>Roberto Castillo</Text>
                    <Text style={styles.memberRole}>Operario de Soldadura</Text>
                  </View>
                </View>
                <View style={styles.teamMember}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>LS</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>Luis Sánchez</Text>
                    <Text style={styles.memberRole}>Supervisor de Producción</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'timeline' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Historial del Proyecto</Text>
              <View style={styles.timeline}>
                {timeline.map((item, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineDot}>
                      {item.status === 'completed' && (
                        <Ionicons name="checkmark-circle" size={24} color={Colors.success.main} />
                      )}
                      {item.status === 'in_progress' && (
                        <Ionicons name="ellipse" size={24} color={Colors.info.main} />
                      )}
                      {item.status === 'pending' && (
                        <Ionicons name="ellipse-outline" size={24} color={Colors.text.tertiary} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineEvent}>{item.event}</Text>
                      <Text style={styles.timelineDate}>{item.date}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'files' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Documentos del Proyecto</Text>
              <View style={styles.filesList}>
                {files.map((file, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.fileItem}
                    onPress={() => handleDownloadFile(file.name)}
                  >
                    <View style={styles.fileIcon}>
                      {file.type === 'pdf' && (
                        <Ionicons name="document-text" size={32} color={Colors.error.main} />
                      )}
                      {file.type === 'doc' && (
                        <Ionicons name="document" size={32} color={Colors.info.main} />
                      )}
                      {file.type === '3d' && (
                        <Ionicons name="cube" size={32} color={Colors.success.main} />
                      )}
                      {file.type === 'excel' && (
                        <Ionicons name="grid" size={32} color={Colors.success.dark} />
                      )}
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      <Text style={styles.fileMeta}>
                        {file.size} • {file.date}
                      </Text>
                    </View>
                    <Ionicons name="download-outline" size={24} color={Colors.primary.main} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            title="Ver en Realidad Aumentada 🥽"
            onPress={handleViewAR}
            variant="primary"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="💬 Ver Comentarios del Proyecto"
            onPress={() => router.push(`/shared/project-comments?projectId=${id}`)}
            variant="secondary"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="Solicitar Cambio"
            onPress={handleRequestChange}
            variant="secondary"
            fullWidth
            style={styles.actionButton}
          />
        </View>
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
  menuButton: {
    padding: Spacing.xs,
  },
  projectHeader: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  projectHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  projectInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  projectId: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  projectName: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  metaInfo: {
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  progressSection: {
    marginTop: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  progressValue: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.main,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.sm,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary.main,
  },
  tabText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  tabTextActive: {
    color: Colors.background.secondary,
    fontWeight: Typography.weights.semibold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  tabContent: {
    flex: 1,
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
  description: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.sizes.body,
  },
  specsList: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  specContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  specLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
  },
  specValue: {
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    fontWeight: Typography.weights.medium,
  },
  teamList: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.sizes.body,
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
  timeline: {
    paddingLeft: Spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timelineDot: {
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  timelineEvent: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  timelineDate: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  filesList: {
    gap: Spacing.sm,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  fileIcon: {
    marginRight: Spacing.md,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  fileMeta: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  actionsSection: {
    marginTop: Spacing.lg,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.sizes.h3,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  errorButton: {
    minWidth: 150,
  },
});