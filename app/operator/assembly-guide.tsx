/**
 * Assembly Guide Screen
 * Guía paso a paso de ensamblaje para operarios
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { Button } from '@/components/atoms/Button';
import { mockWorkOrders, mockAssemblySteps } from '@/data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function AssemblyGuideScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const workOrder = mockWorkOrders.find((wo) => wo.id === id);
  const steps = mockAssemblySteps.filter((s) => s.workOrderId === id);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Actualizar el progreso cuando se completan pasos
  useEffect(() => {
    // Este efecto se ejecuta cada vez que cambia completedSteps
  }, [completedSteps]);

  if (!workOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Orden de trabajo no encontrada</Text>
      </SafeAreaView>
    );
  }

  const currentStep = steps[currentStepIndex];
  const completedCount = completedSteps.length;
  const progress = (completedCount / steps.length) * 100;

  const handleCompleteStep = () => {
    if (currentStep && !completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Última paso completado
      router.back();
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleARView = () => {
    router.push(`/operator/ar-assembly?stepId=${currentStep.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.orderNumber}>OT-{workOrder.id.toUpperCase()}</Text>
          <Text style={styles.projectName}>{workOrder.projectName}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progreso General</Text>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.progressStats}>
          <Text style={styles.progressStatsText}>
            {completedCount} de {steps.length} completados
          </Text>
          <Text style={styles.progressStatsText}>
            Paso actual: {currentStepIndex + 1}/{steps.length}
          </Text>
        </View>
      </View>

      {/* Step Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {currentStep && (
          <>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{currentStep.stepNumber}</Text>
              </View>
              <View style={styles.stepTitleContainer}>
                <Text style={styles.stepTitle}>{currentStep.title}</Text>
                <View style={styles.stepMeta}>
                  <Text style={styles.estimatedTime}>⏱ {currentStep.estimatedTime} min</Text>
                  {completedSteps.includes(currentStep.id) && (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={Colors.success.main} />
                      <Text style={styles.completedText}>Completado</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.descriptionCard}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{currentStep.description}</Text>
            </View>

            {/* Tools Required */}
            {currentStep.tools && currentStep.tools.length > 0 && (
              <View style={styles.toolsCard}>
                <Text style={styles.sectionTitle}>🔧 Herramientas Requeridas</Text>
                {currentStep.tools.map((tool, index) => (
                  <View key={index} style={styles.toolItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.toolText}>{tool}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Warnings */}
            {currentStep.warnings && currentStep.warnings.length > 0 && (
              <View style={styles.warningsCard}>
                <Text style={styles.warningTitle}>⚠ Advertencias de Seguridad</Text>
                {currentStep.warnings.map((warning, index) => (
                  <View key={index} style={styles.warningItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.warningText}>{warning}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* AR View Button */}
            <Button
              title="Ver en Realidad Aumentada 🥽"
              onPress={handleARView}
              variant="primary"
              fullWidth
              style={styles.arButton}
            />

            {/* Verification Required */}
            {currentStep.verificationRequired && (
              <View style={styles.verificationCard}>
                <Text style={styles.verificationText}>
                  ✓ Este paso requiere verificación del supervisor
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.actionButtons}>
          <Button
            title="← Anterior"
            onPress={handlePreviousStep}
            variant="secondary"
            size="small"
            disabled={currentStepIndex === 0}
            style={styles.navButton}
          />
          
          <Button
            title={
              completedSteps.includes(currentStep?.id || '')
                ? '✓ Completado'
                : 'Marcar Completo'
            }
            onPress={handleCompleteStep}
            variant={completedSteps.includes(currentStep?.id || '') ? 'primary' : 'secondary'}
            size="small"
            style={styles.completeButton}
          />

          <Button
            title={currentStepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente →'}
            onPress={handleNextStep}
            variant="primary"
            size="small"
            disabled={!completedSteps.includes(currentStep?.id || '')}
            style={styles.navButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  backButton: {
    marginBottom: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.sizes.body,
    color: Colors.functional.success,
    fontWeight: Typography.weights.semibold,
  },
  headerInfo: {
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  projectName: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  progressPercentage: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.functional.success,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.grays.light,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.functional.success,
    borderRadius: BorderRadius.sm,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatsText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.functional.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  estimatedTime: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs / 2,
  },
  completedText: {
    fontSize: Typography.sizes.caption,
    color: Colors.functional.success,
    fontWeight: Typography.weights.semibold,
  },
  descriptionCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.sizes.body,
  },
  toolsCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  bullet: {
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  toolText: {
    flex: 1,
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
  },
  warningsCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.functional.warning,
  },
  warningTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    color: Colors.functional.warning,
    marginBottom: Spacing.sm,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  warningText: {
    flex: 1,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  arButton: {
    marginVertical: Spacing.md,
  },
  verificationCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.functional.success,
    marginBottom: Spacing.md,
  },
  verificationText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.functional.success,
    fontWeight: Typography.weights.medium,
  },
  bottomActions: {
    backgroundColor: Colors.base.whitePrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
    padding: Spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  navButton: {
    flex: 1,
  },
  completeButton: {
    flex: 1.5,
  },
  errorText: {
    fontSize: Typography.sizes.body,
    color: Colors.functional.error,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
