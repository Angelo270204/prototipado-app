/**
 * SUS Survey Component
 * System Usability Scale - Cuestionario de 10 preguntas para evaluar usabilidad
 * Escala 1 (muy en desacuerdo) a 5 (muy de acuerdo)
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
import { Colors, Typography, BorderRadius } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

interface SUSSurveyProps {
  onComplete: (score: number, answers: number[]) => void;
  onClose: () => void;
}

const SUS_QUESTIONS = [
  {
    id: 1,
    text: 'Creo que me gustaría usar este sistema con frecuencia.',
    positive: true,
  },
  {
    id: 2,
    text: 'Encontré el sistema innecesariamente complejo.',
    positive: false,
  },
  {
    id: 3,
    text: 'Creo que el sistema fue fácil de usar.',
    positive: true,
  },
  {
    id: 4,
    text: 'Creo que necesitaría ayuda de una persona técnica para usar este sistema.',
    positive: false,
  },
  {
    id: 5,
    text: 'Encontré que las diversas funciones del sistema estaban bien integradas.',
    positive: true,
  },
  {
    id: 6,
    text: 'Pensé que había demasiada inconsistencia en este sistema.',
    positive: false,
  },
  {
    id: 7,
    text: 'Imagino que la mayoría de personas aprenderían a usar este sistema rápidamente.',
    positive: true,
  },
  {
    id: 8,
    text: 'Encontré el sistema muy difícil de usar.',
    positive: false,
  },
  {
    id: 9,
    text: 'Me sentí muy confiado al usar el sistema.',
    positive: true,
  },
  {
    id: 10,
    text: 'Necesité aprender muchas cosas antes de poder usar este sistema.',
    positive: false,
  },
];

export default function SUSSurvey({ onComplete, onClose }: SUSSurveyProps) {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateSUSScore = (): number => {
    let totalScore = 0;

    SUS_QUESTIONS.forEach((question) => {
      const answer = answers[question.id] || 0;
      if (question.positive) {
        // Para preguntas positivas: puntuación = respuesta - 1
        totalScore += answer - 1;
      } else {
        // Para preguntas negativas: puntuación = 5 - respuesta
        totalScore += 5 - answer;
      }
    });

    // Multiplicar por 2.5 para obtener puntuación sobre 100
    return totalScore * 2.5;
  };

  const getScoreInterpretation = (score: number): { text: string; color: string } => {
    if (score >= 80) return { text: '¡Excelente!', color: Colors.functional.success };
    if (score >= 70) return { text: 'Bueno', color: Colors.functional.info };
    if (score >= 50) return { text: 'Aceptable', color: Colors.functional.warning };
    return { text: 'Necesita mejoras', color: Colors.functional.error };
  };

  const handleSubmit = () => {
    const unanswered = SUS_QUESTIONS.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      Alert.alert(
        'Cuestionario incompleto',
        `Por favor responde todas las preguntas. Faltan ${unanswered.length} preguntas.`
      );
      return;
    }

    const score = calculateSUSScore();
    const interpretation = getScoreInterpretation(score);
    const answersArray = SUS_QUESTIONS.map((q) => answers[q.id]);

    Alert.alert(
      'Resultado SUS',
      `Tu puntuación: ${score.toFixed(1)}/100\n${interpretation.text}\n\n` +
        '>70 = Bueno\n>80 = Excelente',
      [
        {
          text: 'Guardar y Cerrar',
          onPress: () => onComplete(score, answersArray),
        },
      ]
    );
  };

  const allAnswered = SUS_QUESTIONS.every((q) => answers[q.id] !== undefined);
  const answeredCount = Object.keys(answers).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.base.blackPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Cuestionario SUS</Text>
          <Text style={styles.headerSubtitle}>System Usability Scale</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(answeredCount / SUS_QUESTIONS.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {answeredCount} de {SUS_QUESTIONS.length} preguntas respondidas
        </Text>
      </View>

      {/* Questions */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {SUS_QUESTIONS.map((question, index) => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionNumber}>
                <Text style={styles.questionNumberText}>{question.id}</Text>
              </View>
              <Text style={styles.questionText}>{question.text}</Text>
            </View>

            <View style={styles.scaleContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.scaleButton,
                    answers[question.id] === value && styles.scaleButtonSelected,
                  ]}
                  onPress={() => handleAnswer(question.id, value)}
                >
                  <Text
                    style={[
                      styles.scaleButtonText,
                      answers[question.id] === value && styles.scaleButtonTextSelected,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabelText}>Muy en desacuerdo</Text>
              <Text style={styles.scaleLabelText}>Muy de acuerdo</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !allAnswered && styles.submitButtonDisabled]}
          onPress={handleSubmit}
        >
          <Ionicons name="checkmark-circle" size={24} color={Colors.base.whitePrimary} />
          <Text style={styles.submitButtonText}>
            {allAnswered ? 'Enviar Cuestionario' : `Responde las ${10 - answeredCount} preguntas restantes`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
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
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.grays.light,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.grays.medium,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.functional.success,
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.grays.light,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.base.blackPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questionNumberText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
  questionText: {
    flex: 1,
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    lineHeight: Typography.sizes.body * Typography.lineHeight.relaxed,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scaleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.grays.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scaleButtonSelected: {
    backgroundColor: Colors.base.blackPrimary,
    borderColor: Colors.base.blackPrimary,
  },
  scaleButtonText: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  scaleButtonTextSelected: {
    color: Colors.base.whitePrimary,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabelText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.base.whitePrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.grays.medium,
  },
  submitButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
});
