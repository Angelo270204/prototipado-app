/**
 * Test Results Screen
 * Pantalla de resultados del test de interacción con métricas y SUS
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import SUSSurvey from '@/components/molecules/SUSSurvey';
import { useTestMetrics } from '@/contexts/TestMetricsContext';

export default function TestResultsScreen() {
  const router = useRouter();
  const { currentSession, getAllMetrics, recordSUSResults, recordQualitativeFeedback, endSession } = useTestMetrics();
  const [showSurvey, setShowSurvey] = useState(false);
  const [feedback, setFeedback] = useState({
    easiest: '',
    hardest: '',
    changeRequest: '',
    comments: [] as string[],
  });
  const [newComment, setNewComment] = useState('');

  const metrics = getAllMetrics();

  const handleAddComment = () => {
    if (newComment.trim()) {
      setFeedback({
        ...feedback,
        comments: [...feedback.comments, newComment.trim()],
      });
      setNewComment('');
    }
  };

  const handleSUSComplete = (score: number, answers: number[]) => {
    recordSUSResults(score, answers);
    setShowSurvey(false);
  };

  const handleFinishTest = () => {
    if (!currentSession?.susScore) {
      Alert.alert(
        'Cuestionario SUS',
        '¿Deseas completar el cuestionario SUS antes de finalizar?',
        [
          { text: 'Sí', onPress: () => setShowSurvey(true) },
          { text: 'Finalizar sin SUS', onPress: () => finishTest() },
        ]
      );
      return;
    }
    finishTest();
  };

  const finishTest = () => {
    recordQualitativeFeedback(feedback);
    endSession();
    Alert.alert(
      'Test Completado',
      'Los resultados han sido registrados exitosamente.\n\nGracias por participar.',
      [
        {
          text: 'Volver al inicio',
          onPress: () => router.push('/role-selection'),
        },
      ]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.functional.success;
    if (score >= 70) return Colors.functional.info;
    if (score >= 50) return Colors.functional.warning;
    return Colors.functional.error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 70) return 'Bueno';
    if (score >= 50) return 'Aceptable';
    return 'Necesita mejoras';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.base.blackPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Resultados del Test</Text>
          <Text style={styles.headerSubtitle}>
            Perfil: {currentSession?.participantProfile || 'No definido'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Metrics Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Métricas de Interacción</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Ionicons name="time-outline" size={32} color={Colors.functional.info} />
              <Text style={styles.metricValue}>{formatTime(metrics.totalTime)}</Text>
              <Text style={styles.metricLabel}>Tiempo Total</Text>
              <Text style={styles.metricGoal}>Meta: &lt;3 min/tarea</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="finger-print-outline" size={32} color={Colors.functional.warning} />
              <Text style={styles.metricValue}>{metrics.totalClicks}</Text>
              <Text style={styles.metricLabel}>Clics Totales</Text>
              <Text style={styles.metricGoal}>Meta: 3-5 pasos/tarea</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="alert-circle-outline" size={32} color={Colors.functional.error} />
              <Text style={styles.metricValue}>{metrics.totalErrors}</Text>
              <Text style={styles.metricLabel}>Errores</Text>
              <Text style={styles.metricGoal}>Meta: 0 errores</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="help-circle-outline" size={32} color={Colors.grays.dark} />
              <Text style={styles.metricValue}>{metrics.helpUsagePercent.toFixed(0)}%</Text>
              <Text style={styles.metricLabel}>Uso de Ayuda</Text>
              <Text style={styles.metricGoal}>Meta: &lt;20%</Text>
            </View>
          </View>

          <View style={styles.completionCard}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionLabel}>Tasa de Éxito</Text>
              <Text style={[styles.completionValue, { color: metrics.taskCompletionRate >= 70 ? Colors.functional.success : Colors.functional.error }]}>
                {metrics.taskCompletionRate.toFixed(0)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${metrics.taskCompletionRate}%`, backgroundColor: metrics.taskCompletionRate >= 70 ? Colors.functional.success : Colors.functional.error }]} />
            </View>
            <Text style={styles.completionGoal}>Objetivo: 70-80% sin asistencia</Text>
          </View>
        </View>

        {/* SUS Score */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Puntuación SUS</Text>
            {!currentSession?.susScore && (
              <TouchableOpacity 
                style={styles.startSurveyButton}
                onPress={() => setShowSurvey(true)}
              >
                <Text style={styles.startSurveyButtonText}>Completar Cuestionario</Text>
              </TouchableOpacity>
            )}
          </View>

          {currentSession?.susScore ? (
            <View style={styles.susCard}>
              <View style={styles.susScoreContainer}>
                <Text style={[styles.susScore, { color: getScoreColor(currentSession.susScore) }]}>
                  {currentSession.susScore.toFixed(1)}
                </Text>
                <Text style={styles.susMaxScore}>/100</Text>
              </View>
              <Text style={[styles.susLabel, { color: getScoreColor(currentSession.susScore) }]}>
                {getScoreLabel(currentSession.susScore)}
              </Text>
              <View style={styles.susScale}>
                <Text style={styles.susScaleText}>&gt;70 = Bueno · &gt;80 = Excelente</Text>
              </View>
            </View>
          ) : (
            <View style={styles.pendingCard}>
              <Ionicons name="document-text-outline" size={48} color={Colors.grays.medium} />
              <Text style={styles.pendingText}>Cuestionario pendiente</Text>
              <Text style={styles.pendingSubtext}>
                Completa el cuestionario SUS de 10 preguntas
              </Text>
            </View>
          )}
        </View>

        {/* Qualitative Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Retroalimentación Cualitativa</Text>

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackLabel}>¿Qué fue lo más fácil?</Text>
            <TextInput
              style={styles.feedbackInput}
              value={feedback.easiest}
              onChangeText={(text) => setFeedback({ ...feedback, easiest: text })}
              placeholder="Describe la tarea o función más fácil de usar..."
              placeholderTextColor={Colors.grays.medium}
              multiline
            />
          </View>

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackLabel}>¿Qué fue lo más difícil?</Text>
            <TextInput
              style={styles.feedbackInput}
              value={feedback.hardest}
              onChangeText={(text) => setFeedback({ ...feedback, hardest: text })}
              placeholder="Describe la tarea o función más difícil..."
              placeholderTextColor={Colors.grays.medium}
              multiline
            />
          </View>

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackLabel}>Si pudieras cambiar una sola cosa, ¿cuál sería?</Text>
            <TextInput
              style={styles.feedbackInput}
              value={feedback.changeRequest}
              onChangeText={(text) => setFeedback({ ...feedback, changeRequest: text })}
              placeholder="Sugiere una mejora..."
              placeholderTextColor={Colors.grays.medium}
              multiline
            />
          </View>

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackLabel}>Comentarios adicionales</Text>
            <View style={styles.commentInputRow}>
              <TextInput
                style={[styles.feedbackInput, styles.commentInput]}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Agrega un comentario..."
                placeholderTextColor={Colors.grays.medium}
              />
              <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
                <Ionicons name="add" size={24} color={Colors.base.whitePrimary} />
              </TouchableOpacity>
            </View>
            {feedback.comments.map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <Text style={styles.commentText}>• {comment}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tasks Summary */}
        {currentSession && currentSession.tasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Resumen de Tareas</Text>
            {currentSession.tasks.map((task, index) => (
              <View key={index} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <View style={styles.taskStatus}>
                    <Ionicons
                      name={task.completed ? 'checkmark-circle' : 'close-circle'}
                      size={20}
                      color={task.completed ? Colors.functional.success : Colors.functional.error}
                    />
                    <Text style={styles.taskName}>{task.taskName}</Text>
                  </View>
                  <Text style={styles.taskTime}>
                    {task.endTime ? formatTime((task.endTime - task.startTime) / 1000) : 'En progreso'}
                  </Text>
                </View>
                <View style={styles.taskMetrics}>
                  <Text style={styles.taskMetric}>👆 {task.clicks} clics</Text>
                  <Text style={styles.taskMetric}>❌ {task.errors} errores</Text>
                  <Text style={styles.taskMetric}>❓ {task.helpRequests} ayudas</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinishTest}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.base.whitePrimary} />
          <Text style={styles.finishButtonText}>Finalizar Test</Text>
        </TouchableOpacity>
      </View>

      {/* SUS Survey Modal */}
      <Modal visible={showSurvey} animationType="slide" presentationStyle="fullScreen">
        <SUSSurvey onComplete={handleSUSComplete} onClose={() => setShowSurvey(false)} />
      </Modal>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metricCard: {
    width: '47%',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grays.light,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginTop: Spacing.sm,
  },
  metricLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  metricGoal: {
    fontSize: Typography.sizes.caption,
    color: Colors.grays.dark,
    marginTop: Spacing.xs,
  },
  completionCard: {
    backgroundColor: Colors.grays.light,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  completionLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
  },
  completionValue: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.grays.medium,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  completionGoal: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  startSurveyButton: {
    backgroundColor: Colors.base.blackPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  startSurveyButtonText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
  },
  susCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.grays.light,
  },
  susScoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  susScore: {
    fontSize: 64,
    fontWeight: Typography.weights.bold,
  },
  susMaxScore: {
    fontSize: Typography.sizes.h2,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  susLabel: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.sm,
  },
  susScale: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
  },
  susScaleText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  pendingCard: {
    backgroundColor: Colors.grays.light,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  pendingText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  pendingSubtext: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.dark,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  feedbackCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  feedbackLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.sm,
  },
  feedbackInput: {
    backgroundColor: Colors.grays.light,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  commentInput: {
    flex: 1,
    minHeight: 44,
  },
  addCommentButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.base.blackPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentItem: {
    marginTop: Spacing.sm,
  },
  commentText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  taskCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  taskName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.base.blackPrimary,
  },
  taskTime: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  taskMetrics: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  taskMetric: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.base.whitePrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  finishButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
});
