/**
 * Operator AR Assembly View
 * Vista de Realidad Aumentada para guía de ensamblaje de operadores
 * Incluye indicadores visuales: verde = correcto, rojo = error
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import ARViewer from '@/components/ar/ARViewer';
import { Ionicons } from '@expo/vector-icons';

type StepStatus = 'pending' | 'current' | 'correct' | 'error';

interface AssemblyStep {
  id: string;
  number: number;
  title: string;
  status: StepStatus;
  instruction: string;
}

export default function OperatorARAssemblyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [captureCount, setCaptureCount] = useState(0);
  const [showARView, setShowARView] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState<'correct' | 'incorrect' | null>(null);

  const stepNumber = params.step as string || '1';
  const workOrderCode = params.workOrderCode as string || 'WO-0001';
  const modelName = `Paso ${stepNumber} - ${workOrderCode}`;

  // Pasos de ensamblaje de ejemplo con estados
  const [steps, setSteps] = useState<AssemblyStep[]>([
    { id: '1', number: 1, title: 'Posicionar base', status: 'correct', instruction: 'Coloca la base en la superficie plana' },
    { id: '2', number: 2, title: 'Insertar tornillos', status: 'correct', instruction: 'Inserta los 4 tornillos en las esquinas' },
    { id: '3', number: 3, title: 'Montar estructura', status: 'current', instruction: 'Alinea la estructura con los puntos verdes' },
    { id: '4', number: 4, title: 'Ajustar conexiones', status: 'pending', instruction: 'Conecta los cables según el código de colores' },
    { id: '5', number: 5, title: 'Verificar alineación', status: 'pending', instruction: 'Verifica que todos los componentes estén alineados' },
  ]);

  const handleClose = () => {
    router.back();
  };

  const handleCapture = () => {
    setCaptureCount(prev => prev + 1);
    setEvidencePhotos(prev => [...prev, `foto_${Date.now()}.jpg`]);
    Alert.alert(
      '📸 Evidencia Capturada',
      `Se ha guardado la evidencia del paso ${stepNumber}.\nTotal de capturas: ${captureCount + 1}`,
      [{ text: 'OK' }]
    );
  };

  const handleMeasure = () => {
    Alert.alert(
      '📏 Verificación de Medidas',
      'Usa las medidas para verificar que el ensamblaje cumple con las especificaciones',
      [{ text: 'Entendido' }]
    );
  };

  const handleSelectPiece = (pieceType: 'correct' | 'incorrect') => {
    setSelectedPiece(pieceType);
    if (pieceType === 'correct') {
      Alert.alert(
        '✅ ¡Pieza Correcta!',
        'Has seleccionado la pieza correcta. El sistema confirma la coincidencia.',
        [{ text: 'Continuar' }]
      );
    } else {
      Alert.alert(
        '❌ Pieza Incorrecta',
        'Esta pieza no corresponde al paso actual. Por favor selecciona la pieza indicada en verde.',
        [{ text: 'Intentar de nuevo' }]
      );
    }
  };

  const handleCompleteStep = () => {
    const currentStepIndex = steps.findIndex(s => s.status === 'current');
    if (currentStepIndex !== -1) {
      const newSteps = [...steps];
      newSteps[currentStepIndex].status = 'correct';
      if (currentStepIndex + 1 < newSteps.length) {
        newSteps[currentStepIndex + 1].status = 'current';
      }
      setSteps(newSteps);
      Alert.alert(
        '✅ Paso Completado',
        `El paso ${currentStepIndex + 1} ha sido completado exitosamente.`,
        [{ text: 'Siguiente paso' }]
      );
    }
  };

  const handleReportError = () => {
    const currentStepIndex = steps.findIndex(s => s.status === 'current');
    if (currentStepIndex !== -1) {
      const newSteps = [...steps];
      newSteps[currentStepIndex].status = 'error';
      setSteps(newSteps);
      Alert.alert(
        '⚠️ Error Reportado',
        'Se ha registrado un problema en este paso. Un supervisor será notificado.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => router.push('/operator/report-issue') },
        ]
      );
    }
  };

  const getStatusColor = (status: StepStatus) => {
    switch (status) {
      case 'correct': return Colors.functional.success;
      case 'error': return Colors.functional.error;
      case 'current': return Colors.functional.info;
      default: return Colors.grays.medium;
    }
  };

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'correct': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'current': return 'radio-button-on';
      default: return 'radio-button-off';
    }
  };

  const currentStep = steps.find(s => s.status === 'current');
  const completedSteps = steps.filter(s => s.status === 'correct').length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.base.whitePrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Ensamblaje AR</Text>
          <Text style={styles.headerSubtitle}>{workOrderCode}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => Alert.alert('Ayuda', '• Verde = Correcto\n• Rojo = Error\n• Azul = Paso actual\n• Gris = Pendiente')}
          >
            <Ionicons name="help-circle-outline" size={24} color={Colors.base.whitePrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progreso: {completedSteps}/{steps.length} pasos</Text>
          <Text style={[styles.progressPercent, { color: progress >= 70 ? Colors.functional.success : Colors.functional.info }]}>
            {progress.toFixed(0)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* AR View Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showARView && styles.toggleButtonActive]}
          onPress={() => setShowARView(true)}
        >
          <Ionicons name="scan-outline" size={20} color={showARView ? Colors.base.whitePrimary : Colors.base.blackPrimary} />
          <Text style={[styles.toggleText, showARView && styles.toggleTextActive]}>Vista AR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showARView && styles.toggleButtonActive]}
          onPress={() => setShowARView(false)}
        >
          <Ionicons name="list-outline" size={20} color={!showARView ? Colors.base.whitePrimary : Colors.base.blackPrimary} />
          <Text style={[styles.toggleText, !showARView && styles.toggleTextActive]}>Lista de Pasos</Text>
        </TouchableOpacity>
      </View>

      {showARView ? (
        /* AR View */
        <View style={styles.arContainer}>
          <ARViewer
            modelName={modelName}
            onClose={handleClose}
            onCapture={handleCapture}
            onMeasure={handleMeasure}
          />
          
          {/* Floating Status Indicators */}
          <View style={styles.statusIndicators}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: Colors.functional.success }]} />
              <Text style={styles.statusText}>✓ Correcto</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: Colors.functional.error }]} />
              <Text style={styles.statusText}>✕ Error</Text>
            </View>
          </View>

          {/* Piece Selection Demo */}
          <View style={styles.pieceSelection}>
            <Text style={styles.pieceSelectionTitle}>Selecciona la pieza correcta:</Text>
            <View style={styles.pieceOptions}>
              <TouchableOpacity
                style={[styles.pieceOption, styles.pieceCorrect, selectedPiece === 'correct' && styles.pieceSelected]}
                onPress={() => handleSelectPiece('correct')}
              >
                <Ionicons name="cube-outline" size={32} color={Colors.base.whitePrimary} />
                <Text style={styles.pieceLabel}>Pieza A</Text>
                <Text style={styles.pieceHint}>✓ Correcta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pieceOption, styles.pieceIncorrect, selectedPiece === 'incorrect' && styles.pieceSelected]}
                onPress={() => handleSelectPiece('incorrect')}
              >
                <Ionicons name="cube-outline" size={32} color={Colors.base.whitePrimary} />
                <Text style={styles.pieceLabel}>Pieza B</Text>
                <Text style={styles.pieceHint}>✕ Incorrecta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        /* Steps List View */
        <ScrollView style={styles.stepsContainer}>
          {steps.map((step) => (
            <View
              key={step.id}
              style={[
                styles.stepCard,
                step.status === 'current' && styles.stepCardCurrent,
                step.status === 'error' && styles.stepCardError,
              ]}
            >
              <View style={[styles.stepNumber, { backgroundColor: getStatusColor(step.status) }]}>
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Ionicons
                    name={getStatusIcon(step.status)}
                    size={24}
                    color={getStatusColor(step.status)}
                  />
                </View>
                <Text style={styles.stepInstruction}>{step.instruction}</Text>
                {step.status === 'current' && (
                  <View style={styles.currentStepActions}>
                    <TouchableOpacity style={styles.viewARButton} onPress={() => setShowARView(true)}>
                      <Ionicons name="scan" size={16} color={Colors.base.whitePrimary} />
                      <Text style={styles.viewARButtonText}>Ver en AR</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {currentStep && (
          <View style={styles.currentStepInfo}>
            <Text style={styles.currentStepLabel}>Paso actual: {currentStep.number}</Text>
            <Text style={styles.currentStepTitle}>{currentStep.title}</Text>
          </View>
        )}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.errorButton} onPress={handleReportError}>
            <Ionicons name="alert-circle" size={20} color={Colors.base.whitePrimary} />
            <Text style={styles.errorButtonText}>Reportar Error</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureEvidenceButton} onPress={handleCapture}>
            <Ionicons name="camera" size={20} color={Colors.base.blackPrimary} />
            <Text style={styles.captureEvidenceText}>Evidencia ({captureCount})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.completeButton} onPress={handleCompleteStep}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.base.whitePrimary} />
            <Text style={styles.completeButtonText}>Completar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base.blackPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.blackPrimary,
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
    color: Colors.base.whitePrimary,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.light,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  helpButton: {
    padding: Spacing.xs,
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.grays.dark,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.light,
  },
  progressPercent: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.grays.medium,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.functional.success,
    borderRadius: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.grays.dark,
    gap: Spacing.sm,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.grays.medium,
    gap: Spacing.xs,
  },
  toggleButtonActive: {
    backgroundColor: Colors.base.blackPrimary,
  },
  toggleText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.medium,
    color: Colors.base.blackPrimary,
  },
  toggleTextActive: {
    color: Colors.base.whitePrimary,
  },
  arContainer: {
    flex: 1,
    position: 'relative',
  },
  statusIndicators: {
    position: 'absolute',
    top: 100,
    left: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    color: Colors.base.whitePrimary,
  },
  pieceSelection: {
    position: 'absolute',
    bottom: 180,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  pieceSelectionTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  pieceOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  pieceOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  pieceCorrect: {
    backgroundColor: Colors.functional.success,
  },
  pieceIncorrect: {
    backgroundColor: Colors.functional.error,
  },
  pieceSelected: {
    borderColor: Colors.base.whitePrimary,
  },
  pieceLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
    marginTop: Spacing.xs,
  },
  pieceHint: {
    fontSize: Typography.sizes.caption,
    color: Colors.base.whitePrimary,
    opacity: 0.8,
    marginTop: 2,
  },
  stepsContainer: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
    padding: Spacing.lg,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  stepCardCurrent: {
    borderColor: Colors.functional.info,
    borderWidth: 2,
    backgroundColor: Colors.grays.light,
  },
  stepCardError: {
    borderColor: Colors.functional.error,
    borderWidth: 2,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  stepTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
  },
  stepInstruction: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  currentStepActions: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  viewARButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.functional.info,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  viewARButtonText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
  },
  bottomActions: {
    backgroundColor: Colors.base.whitePrimary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
  },
  currentStepInfo: {
    marginBottom: Spacing.sm,
  },
  currentStepLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  currentStepTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.functional.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  errorButtonText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
  },
  captureEvidenceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grays.light,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  captureEvidenceText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.functional.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  completeButtonText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
  },
});