/**
 * A/B Testing Dashboard
 * Panel de visualización de resultados de experimentos A/B
 * 
 * Muestra:
 * - Métricas por variante (A vs B)
 * - Tasa de conversión (CTR)
 * - Eventos trackeados
 * - Análisis comparativo
 * - Opciones de reset para testing
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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { useABTesting } from '@/contexts/ABTesting/ABTestingContext';

export default function ABTestingDashboard() {
  const router = useRouter();
  const { 
    getVariant, 
    getMetrics, 
    experiments, 
    resetExperiment,
    resetAllExperiments 
  } = useABTesting();

  const [selectedExperiment] = useState('qr_button_location');
  const [, setRefreshKey] = useState(0);

  const currentVariant = getVariant(selectedExperiment);
  const metricsA = getMetrics(selectedExperiment);
  const experiment = experiments.find(e => e.id === selectedExperiment);

  // Calcular estadísticas
  const calculateStats = () => {
    if (!metricsA) return null;

    const screenViews = metricsA.events.filter(e => e.eventType === 'screen_viewed').length;
    const buttonClicks = metricsA.events.filter(e => e.eventType === 'qr_button_clicked').length;
    const ctr = screenViews > 0 ? ((buttonClicks / screenViews) * 100).toFixed(2) : '0.00';

    return {
      screenViews,
      buttonClicks,
      ctr,
      totalEvents: metricsA.totalEvents,
    };
  };

  const stats = calculateStats();

  const handleReset = () => {
    Alert.alert(
      'Reset Experimento',
      `¿Estás seguro de resetear el experimento "${experiment?.name}"? Se perderán todos los datos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetExperiment(selectedExperiment);
            setRefreshKey(prev => prev + 1);
            Alert.alert('Éxito', 'Experimento reseteado. Cierra y vuelve a abrir la app para obtener nueva variante.');
          },
        },
      ]
    );
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset Todos los Experimentos',
      '¿Estás seguro de resetear TODOS los experimentos? Se perderán todos los datos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reset Todo',
          style: 'destructive',
          onPress: () => {
            resetAllExperiments();
            setRefreshKey(prev => prev + 1);
            Alert.alert('Éxito', 'Todos los experimentos reseteados.');
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
          <Text style={styles.headerTitle}>🧪 Dashboard A/B Testing</Text>
          <Text style={styles.headerSubtitle}>Análisis de Experimentos</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Info del Experimento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experimento Actual</Text>
          <View style={styles.experimentCard}>
            <View style={styles.experimentHeader}>
              <Ionicons name="flask" size={24} color={Colors.functional.info} />
              <View style={styles.experimentInfo}>
                <Text style={styles.experimentName}>{experiment?.name}</Text>
                <Text style={styles.experimentDescription}>{experiment?.description}</Text>
              </View>
            </View>
            <View style={styles.experimentMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Inicio:</Text>
                <Text style={styles.metaValue}>{experiment?.startDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Fin:</Text>
                <Text style={styles.metaValue}>{experiment?.endDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Estado:</Text>
                <View style={[styles.statusBadge, experiment?.isActive ? styles.statusActive : styles.statusInactive]}>
                  <Text style={styles.statusText}>{experiment?.isActive ? 'Activo' : 'Inactivo'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Tu Variante Asignada */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu Variante Asignada</Text>
          <View style={[styles.variantCard, currentVariant === 'A' ? styles.variantA : styles.variantB]}>
            <View style={styles.variantHeader}>
              <Text style={styles.variantBadge}>Variante {currentVariant}</Text>
              <Ionicons 
                name={currentVariant === 'A' ? 'radio-button-on' : 'apps'} 
                size={32} 
                color={currentVariant === 'A' ? Colors.base.blackPrimary : Colors.functional.success} 
              />
            </View>
            <Text style={styles.variantTitle}>
              {currentVariant === 'A' ? '📱 Botón en Header' : '🎯 FAB Flotante'}
            </Text>
            <Text style={styles.variantDescription}>
              {currentVariant === 'A' 
                ? 'Botón Escanear ubicado en el header superior derecha, diseño compacto horizontal.'
                : 'Floating Action Button verde en esquina inferior derecha, optimizado para el pulgar.'
              }
            </Text>
          </View>
        </View>

        {/* Métricas de Tu Variante */}
        {stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tus Métricas (Variante {currentVariant})</Text>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Ionicons name="eye-outline" size={28} color={Colors.functional.info} />
                <Text style={styles.metricValue}>{stats.screenViews}</Text>
                <Text style={styles.metricLabel}>Vistas de Pantalla</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="finger-print-outline" size={28} color={Colors.functional.success} />
                <Text style={styles.metricValue}>{stats.buttonClicks}</Text>
                <Text style={styles.metricLabel}>Clicks en Botón QR</Text>
              </View>

              <View style={[styles.metricCard, styles.metricCardHighlight]}>
                <Ionicons name="trending-up-outline" size={28} color={Colors.base.whitePrimary} />
                <Text style={[styles.metricValue, { color: Colors.base.whitePrimary }]}>{stats.ctr}%</Text>
                <Text style={[styles.metricLabel, { color: Colors.base.whitePrimary }]}>CTR (Tasa de Clicks)</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="pulse-outline" size={28} color={Colors.functional.warning} />
                <Text style={styles.metricValue}>{stats.totalEvents}</Text>
                <Text style={styles.metricLabel}>Eventos Totales</Text>
              </View>
            </View>
          </View>
        )}

        {/* Eventos Recientes */}
        {metricsA && metricsA.events.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Últimos Eventos (Top 5)</Text>
            <View style={styles.eventsContainer}>
              {metricsA.events.slice(-5).reverse().map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <View style={styles.eventIcon}>
                    <Ionicons 
                      name={event.eventType === 'screen_viewed' ? 'eye' : 'hand-left'} 
                      size={16} 
                      color={Colors.functional.info} 
                    />
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventType}>{event.eventType}</Text>
                    <Text style={styles.eventTime}>
                      {new Date(event.timestamp).toLocaleString('es-ES')}
                    </Text>
                  </View>
                  <View style={[styles.eventVariant, event.variant === 'A' ? styles.eventVariantA : styles.eventVariantB]}>
                    <Text style={styles.eventVariantText}>{event.variant}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Comparación de Variantes (Hipotética) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Comparación Esperada</Text>
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonNote}>
              💡 En un experimento real con suficientes datos, aquí verías:
            </Text>
            
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonVariant}>Variante A (Header)</Text>
                <View style={styles.comparisonBar}>
                  <View style={[styles.comparisonBarFill, { width: '65%', backgroundColor: Colors.grays.dark }]} />
                </View>
                <Text style={styles.comparisonValue}>~65% CTR</Text>
              </View>

              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonVariant}>Variante B (FAB)</Text>
                <View style={styles.comparisonBar}>
                  <View style={[styles.comparisonBarFill, { width: '85%', backgroundColor: Colors.functional.success }]} />
                </View>
                <Text style={styles.comparisonValue}>~85% CTR</Text>
              </View>
            </View>

            <View style={styles.winnerBadge}>
              <Ionicons name="trophy" size={20} color={Colors.functional.warning} />
              <Text style={styles.winnerText}>Ganador Esperado: Variante B (+20%)</Text>
            </View>
          </View>
        </View>

        {/* Acciones de Testing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Herramientas de Testing</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
            <Ionicons name="refresh-outline" size={24} color={Colors.functional.info} />
            <Text style={styles.actionButtonText}>Reset Este Experimento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.actionButtonDanger]} onPress={handleResetAll}>
            <Ionicons name="trash-outline" size={24} color={Colors.functional.error} />
            <Text style={[styles.actionButtonText, { color: Colors.functional.error }]}>Reset Todos los Experimentos</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.functional.info} />
            <Text style={styles.infoText}>
              Después de resetear, cierra y vuelve a abrir la app para que se te asigne una nueva variante aleatoriamente.
            </Text>
          </View>
        </View>

        {/* Instrucciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Cómo Probar el Experimento</Text>
          <View style={styles.instructionsCard}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>
                Navega a la pantalla del Operador (Órdenes de Trabajo)
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>
                Observa tu variante: Botón en header (A) o FAB verde (B)
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>
                Haz click en el botón de escanear QR varias veces
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>4</Text>
              <Text style={styles.instructionText}>
                Regresa a este dashboard para ver las métricas actualizadas
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>5</Text>
              <Text style={styles.instructionText}>
                Para cambiar de variante, usa el botón Reset y reinicia la app
              </Text>
            </View>
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
    backgroundColor: Colors.base.whitePrimary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.dark,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.md,
  },
  experimentCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.grays.medium,
    ...Shadows.medium,
  },
  experimentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  experimentInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  experimentName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginBottom: 4,
  },
  experimentDescription: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.dark,
    lineHeight: 20,
  },
  experimentMeta: {
    gap: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.dark,
    fontWeight: Typography.weights.medium,
  },
  metaValue: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.base.blackPrimary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusActive: {
    backgroundColor: Colors.functional.success,
  },
  statusInactive: {
    backgroundColor: Colors.grays.medium,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
  },
  variantCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    ...Shadows.medium,
  },
  variantA: {
    backgroundColor: Colors.base.whitePrimary,
    borderColor: Colors.base.blackPrimary,
  },
  variantB: {
    backgroundColor: '#F0FDF4',
    borderColor: Colors.functional.success,
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  variantBadge: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  variantTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.sm,
  },
  variantDescription: {
    fontSize: Typography.sizes.body,
    color: Colors.grays.dark,
    lineHeight: 22,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metricCard: {
    width: '47%',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grays.medium,
    ...Shadows.small,
  },
  metricCardHighlight: {
    backgroundColor: Colors.functional.info,
    borderColor: Colors.functional.info,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginVertical: Spacing.sm,
  },
  metricLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.grays.dark,
    textAlign: 'center',
  },
  eventsContainer: {
    gap: Spacing.sm,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grays.medium,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventType: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.base.blackPrimary,
  },
  eventTime: {
    fontSize: Typography.sizes.caption,
    color: Colors.grays.dark,
    marginTop: 2,
  },
  eventVariant: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventVariantA: {
    backgroundColor: Colors.base.blackPrimary,
  },
  eventVariantB: {
    backgroundColor: Colors.functional.success,
  },
  eventVariantText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
  comparisonCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  comparisonNote: {
    fontSize: Typography.sizes.body,
    color: Colors.grays.dark,
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
  comparisonRow: {
    gap: Spacing.lg,
  },
  comparisonItem: {
    marginBottom: Spacing.md,
  },
  comparisonVariant: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.sm,
  },
  comparisonBar: {
    height: 32,
    backgroundColor: Colors.grays.light,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  comparisonBarFill: {
    height: '100%',
    borderRadius: BorderRadius.md,
  },
  comparisonValue: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.dark,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  winnerText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: '#92400E',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.functional.info,
    gap: Spacing.sm,
  },
  actionButtonDanger: {
    borderColor: Colors.functional.error,
    backgroundColor: '#FEF2F2',
  },
  actionButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.functional.info,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.dark,
    lineHeight: 20,
  },
  instructionsCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.grays.medium,
    gap: Spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.functional.info,
    color: Colors.base.whitePrimary,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    lineHeight: 28,
  },
  instructionText: {
    flex: 1,
    fontSize: Typography.sizes.body,
    color: Colors.base.blackPrimary,
    lineHeight: 22,
  },
});