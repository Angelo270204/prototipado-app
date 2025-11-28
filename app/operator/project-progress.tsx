/**
 * Pantalla de Progreso del Proyecto - Operario
 * Permite al operario ver y actualizar el progreso del proyecto compartido
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';

export default function ProjectProgressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const projectId = params.projectId as string;
  const { projects, updateProjectProgress } = useApp();
  
  const project = projects.find(p => p.id === projectId);
  const [localProgress, setLocalProgress] = useState(project?.progress || 0);
  const [notes, setNotes] = useState('');

  if (!project) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Proyecto no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSaveProgress = () => {
    updateProjectProgress(projectId, localProgress);
    Alert.alert(
      '✅ Progreso Guardado',
      `El progreso del proyecto "${project.name}" se ha actualizado a ${localProgress}%`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const progressSteps = [
    { value: 0, label: 'Sin iniciar' },
    { value: 25, label: 'Preparación' },
    { value: 50, label: 'En proceso' },
    { value: 75, label: 'Por terminar' },
    { value: 100, label: 'Completado' },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return Colors.functional.success;
    if (progress >= 75) return Colors.functional.info;
    if (progress >= 50) return Colors.functional.warning;
    return Colors.grays.dark;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Progreso del Proyecto</Text>
          <Text style={styles.headerSubtitle}>{project.name}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info del Proyecto */}
        <View style={styles.projectCard}>
          <View style={styles.projectIcon}>
            <Ionicons name="construct" size={32} color={Colors.base.whitePrimary} />
          </View>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.projectClient}>Cliente: {project.client}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getProgressColor(project.progress) }]}>
            <Text style={styles.statusText}>
              {project.progress === 100 ? 'Completado' : project.progress >= 50 ? 'En Progreso' : 'Pendiente'}
            </Text>
          </View>
        </View>

        {/* Progreso Actual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso Actual</Text>
          <View style={styles.currentProgressCard}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>{project.progress}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${project.progress}%`, backgroundColor: getProgressColor(project.progress) }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>

        {/* Actualizar Progreso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actualizar Progreso</Text>
          <View style={styles.updateCard}>
            <Text style={styles.newProgressLabel}>Nuevo Progreso: {localProgress}%</Text>
            
            {/* Controles de Progreso */}
            <View style={styles.progressControlContainer}>
              <TouchableOpacity 
                style={styles.progressControlButton}
                onPress={() => setLocalProgress(Math.max(0, localProgress - 5))}
              >
                <Ionicons name="remove-circle" size={32} color={Colors.primary.main} />
              </TouchableOpacity>
              <View style={styles.progressDisplayContainer}>
                <Text style={[styles.progressDisplayText, { color: getProgressColor(localProgress) }]}>
                  {localProgress}%
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.progressControlButton}
                onPress={() => setLocalProgress(Math.min(100, localProgress + 5))}
              >
                <Ionicons name="add-circle" size={32} color={Colors.primary.main} />
              </TouchableOpacity>
            </View>

            {/* Quick Progress Buttons */}
            <View style={styles.quickProgressButtons}>
              {progressSteps.map((step) => (
                <TouchableOpacity
                  key={step.value}
                  style={[
                    styles.quickButton,
                    localProgress === step.value && styles.quickButtonActive,
                  ]}
                  onPress={() => setLocalProgress(step.value)}
                >
                  <Text 
                    style={[
                      styles.quickButtonText,
                      localProgress === step.value && styles.quickButtonTextActive,
                    ]}
                  >
                    {step.value}%
                  </Text>
                  <Text 
                    style={[
                      styles.quickButtonLabel,
                      localProgress === step.value && styles.quickButtonLabelActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notas */}
            <Text style={styles.notesLabel}>Notas (opcional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Agrega observaciones sobre el progreso..."
              placeholderTextColor={Colors.text.secondary}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />

            {/* Botón Guardar */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProgress}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.base.whitePrimary} />
              <Text style={styles.saveButtonText}>Guardar Progreso</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Historial (simulado) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Actualizaciones</Text>
          <View style={styles.historyCard}>
            <View style={styles.historyItem}>
              <View style={styles.historyDot} />
              <View style={styles.historyContent}>
                <Text style={styles.historyAction}>Progreso actualizado a {project.progress}%</Text>
                <Text style={styles.historyTime}>Última actualización</Text>
              </View>
            </View>
            <View style={styles.historyItem}>
              <View style={styles.historyDot} />
              <View style={styles.historyContent}>
                <Text style={styles.historyAction}>Proyecto compartido con operario</Text>
                <Text style={styles.historyTime}>{project.createdAt}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push(`/shared/project-comments?projectId=${projectId}`)}
            >
              <Ionicons name="chatbubbles-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Ver Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push(`/operator/ar-assembly?projectId=${projectId}`)}
            >
              <Ionicons name="scan-outline" size={24} color={Colors.primary.main} />
              <Text style={styles.actionLabel}>Ver en AR</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  projectCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  projectIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  projectName: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  projectClient: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
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
  currentProgressCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.small,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.round,
    borderWidth: 8,
    borderColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressPercentage: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.main,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.grays.light,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  updateCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  newProgressLabel: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  progressControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  progressControlButton: {
    padding: Spacing.sm,
  },
  progressDisplayContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  progressDisplayText: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
  },
  quickProgressButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickButton: {
    flex: 1,
    minWidth: '18%',
    backgroundColor: Colors.grays.light,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  quickButtonActive: {
    backgroundColor: Colors.primary.main,
  },
  quickButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  quickButtonTextActive: {
    color: Colors.base.whitePrimary,
  },
  quickButtonLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  quickButtonLabelActive: {
    color: Colors.base.whitePrimary,
  },
  notesLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  notesInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.background.border,
    padding: Spacing.md,
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.functional.success,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  saveButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
  historyCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary.main,
    marginTop: 5,
    marginRight: Spacing.md,
  },
  historyContent: {
    flex: 1,
  },
  historyAction: {
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  historyTime: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.tertiary,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.small,
  },
  actionLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
  },
});
