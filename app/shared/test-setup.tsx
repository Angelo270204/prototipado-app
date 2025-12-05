/**
 * Test Setup Screen
 * Pantalla para configurar y empezar una sesión de test de interacción
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
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useTestMetrics } from '@/contexts/TestMetricsContext';

type ParticipantProfile = 'designer' | 'client' | 'operator' | 'production';

interface ProfileOption {
  id: ParticipantProfile;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  scenarios: string[];
  route: string;
}

const PROFILES: ProfileOption[] = [
  {
    id: 'designer',
    title: 'Diseñador Mecánico / CAD',
    description: 'Experiencia usando SolidWorks/AutoCAD. Objetivo: validar diseño sin prototipo físico.',
    icon: 'construct-outline',
    scenarios: [
      'Cargar archivo CAD al sistema',
      'Visualizar modelo en RA',
      'Medir, rotar y validar colisiones',
      'Enviar diseño para aprobación',
    ],
    route: '/designer/projects',
  },
  {
    id: 'client',
    title: 'Cliente B2B',
    description: 'Participa en aprobación de productos. Objetivo: visualizar y aprobar diseño en su entorno real.',
    icon: 'briefcase-outline',
    scenarios: [
      'Abrir link de visualización',
      'Ver modelo en entorno real',
      'Realizar comentarios',
      'Aprobar o rechazar diseño',
    ],
    route: '/client/projects',
  },
  {
    id: 'operator',
    title: 'Operario de Ensamblaje',
    description: 'Realiza piezas personalizadas con frecuencia. Objetivo: ejecutar pasos correctos en RA.',
    icon: 'hammer-outline',
    scenarios: [
      'Abrir orden de trabajo',
      'Escanear QR de componente',
      'Completar pasos de ensamblaje',
      'Registrar foto de evidencia',
    ],
    route: '/operator/work-orders',
  },
  {
    id: 'production',
    title: 'Gerente de Producción',
    description: 'Supervisa órdenes y eficiencia operativa. Objetivo: visualizar estados, tiempos y trazabilidad.',
    icon: 'stats-chart-outline',
    scenarios: [
      'Revisar órdenes pendientes y en proceso',
      'Filtrar por prioridad',
      'Abrir historial de componente',
      'Escanear QR para trazabilidad',
    ],
    route: '/production/dashboard',
  },
];

export default function TestSetupScreen() {
  const router = useRouter();
  const { startSession } = useTestMetrics();
  const [selectedProfile, setSelectedProfile] = useState<ParticipantProfile | null>(null);

  const handleStartTest = () => {
    if (!selectedProfile) {
      Alert.alert('Selecciona un perfil', 'Por favor selecciona el perfil del participante antes de comenzar.');
      return;
    }

    const profile = PROFILES.find((p) => p.id === selectedProfile);
    if (!profile) return;

    Alert.alert(
      'Iniciar Test de Interacción',
      `Perfil: ${profile.title}\n\n` +
        'El test medirá:\n' +
        '• Tiempo en cada tarea\n' +
        '• Número de clics/toques\n' +
        '• Errores cometidos\n' +
        '• Uso de ayuda\n\n' +
        '¿Deseas comenzar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comenzar',
          onPress: () => {
            startSession(selectedProfile);
            router.push(profile.route as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.base.blackPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Test de Interacción</Text>
          <Text style={styles.headerSubtitle}>Configuración de la sesión de prueba</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Ionicons name="information-circle" size={24} color={Colors.functional.info} />
          <View style={styles.instructionsContent}>
            <Text style={styles.instructionsTitle}>Instrucciones</Text>
            <Text style={styles.instructionsText}>
              Este test evalúa la usabilidad del sistema DTP-AR. Recuerda que se evalúa el sistema, NO al usuario.
              {'\n\n'}
              Duración estimada: 15-20 minutos
            </Text>
          </View>
        </View>

        {/* Profile Selection */}
        <Text style={styles.sectionTitle}>Selecciona el Perfil del Participante</Text>

        {PROFILES.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={[
              styles.profileCard,
              selectedProfile === profile.id && styles.profileCardSelected,
            ]}
            onPress={() => setSelectedProfile(profile.id)}
            activeOpacity={0.7}
          >
            <View style={styles.profileHeader}>
              <View style={[styles.profileIcon, selectedProfile === profile.id && styles.profileIconSelected]}>
                <Ionicons
                  name={profile.icon}
                  size={28}
                  color={selectedProfile === profile.id ? Colors.base.whitePrimary : Colors.base.blackPrimary}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileTitle, selectedProfile === profile.id && styles.profileTitleSelected]}>
                  {profile.title}
                </Text>
                <Text style={styles.profileDescription}>{profile.description}</Text>
              </View>
              <View style={[styles.radioButton, selectedProfile === profile.id && styles.radioButtonSelected]}>
                {selectedProfile === profile.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </View>

            {selectedProfile === profile.id && (
              <View style={styles.scenariosList}>
                <Text style={styles.scenariosTitle}>Escenarios de prueba:</Text>
                {profile.scenarios.map((scenario, index) => (
                  <View key={index} style={styles.scenarioItem}>
                    <Text style={styles.scenarioNumber}>{index + 1}</Text>
                    <Text style={styles.scenarioText}>{scenario}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Metrics Info */}
        <View style={styles.metricsInfo}>
          <Text style={styles.metricsTitle}>Métricas a medir</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Ionicons name="time-outline" size={20} color={Colors.functional.info} />
              <Text style={styles.metricLabel}>Tiempo en tarea</Text>
              <Text style={styles.metricGoal}>Meta: &lt;3 min</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="finger-print-outline" size={20} color={Colors.functional.warning} />
              <Text style={styles.metricLabel}>Clics/Toques</Text>
              <Text style={styles.metricGoal}>Meta: 3-5 pasos</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.functional.error} />
              <Text style={styles.metricLabel}>Errores</Text>
              <Text style={styles.metricGoal}>Mínimo posible</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="help-circle-outline" size={20} color={Colors.grays.dark} />
              <Text style={styles.metricLabel}>Uso de ayuda</Text>
              <Text style={styles.metricGoal}>Meta: &lt;20%</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, !selectedProfile && styles.startButtonDisabled]}
          onPress={handleStartTest}
          disabled={!selectedProfile}
        >
          <Ionicons name="play-circle" size={24} color={Colors.base.whitePrimary} />
          <Text style={styles.startButtonText}>Iniciar Test de Interacción</Text>
        </TouchableOpacity>
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
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.grays.light,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.functional.info,
  },
  instructionsContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  instructionsTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.xs,
  },
  instructionsText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    lineHeight: Typography.sizes.bodySmall * Typography.lineHeight.relaxed,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.md,
  },
  profileCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.grays.light,
  },
  profileCardSelected: {
    borderColor: Colors.base.blackPrimary,
    backgroundColor: Colors.grays.light,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.grays.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileIconSelected: {
    backgroundColor: Colors.base.blackPrimary,
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.xs,
  },
  profileTitleSelected: {
    color: Colors.base.blackPrimary,
  },
  profileDescription: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    lineHeight: Typography.sizes.caption * Typography.lineHeight.relaxed,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.grays.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  radioButtonSelected: {
    borderColor: Colors.base.blackPrimary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.base.blackPrimary,
  },
  scenariosList: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.medium,
  },
  scenariosTitle: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.sm,
  },
  scenarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  scenarioNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.base.blackPrimary,
    color: Colors.base.whitePrimary,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    lineHeight: 20,
    marginRight: Spacing.sm,
    overflow: 'hidden',
  },
  scenarioText: {
    flex: 1,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  metricsInfo: {
    backgroundColor: Colors.grays.light,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  metricsTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metricItem: {
    width: '48%',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.base.blackPrimary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  metricGoal: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.base.whitePrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  startButtonDisabled: {
    backgroundColor: Colors.grays.medium,
  },
  startButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
});
