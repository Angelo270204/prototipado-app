/**
 * Test Metrics Indicator
 * Indicador flotante que muestra métricas en tiempo real durante el test
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useTestMetrics } from '@/contexts/TestMetricsContext';

interface TestMetricsIndicatorProps {
  visible?: boolean;
}

export default function TestMetricsIndicator({ visible = true }: TestMetricsIndicatorProps) {
  const { isTestMode, currentTask, getAllMetrics } = useTestMetrics();
  const [expanded, setExpanded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer for current task
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (currentTask && isTestMode) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - currentTask.startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [currentTask, isTestMode]);

  if (!isTestMode || !visible) {
    return null;
  }

  const metrics = getAllMetrics();
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.badge, expanded && styles.badgeExpanded]}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        {expanded ? (
          <View style={styles.expandedContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>📊 Métricas del Test</Text>
              <Ionicons name="chevron-up" size={20} color={Colors.base.whitePrimary} />
            </View>

            {currentTask && (
              <View style={styles.currentTaskSection}>
                <Text style={styles.taskName}>Tarea: {currentTask.taskName}</Text>
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Ionicons name="time-outline" size={16} color={Colors.functional.warning} />
                    <Text style={styles.metricValue}>{formatTime(elapsedTime)}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Ionicons name="finger-print-outline" size={16} color={Colors.functional.info} />
                    <Text style={styles.metricValue}>{currentTask.clicks} clics</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Ionicons name="alert-circle-outline" size={16} color={Colors.functional.error} />
                    <Text style={styles.metricValue}>{currentTask.errors} errores</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Resumen de la sesión</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Tiempo total</Text>
                  <Text style={styles.summaryValue}>{formatTime(Math.floor(metrics.totalTime))}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Clics totales</Text>
                  <Text style={styles.summaryValue}>{metrics.totalClicks}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Errores</Text>
                  <Text style={styles.summaryValue}>{metrics.totalErrors}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Uso de ayuda</Text>
                  <Text style={styles.summaryValue}>{metrics.helpUsagePercent.toFixed(0)}%</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.collapsedContent}>
            <View style={styles.indicatorDot} />
            <Text style={styles.collapsedText}>TEST</Text>
            {currentTask && (
              <>
                <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                <View style={styles.miniMetrics}>
                  <Text style={styles.miniMetricText}>👆{currentTask.clicks}</Text>
                  <Text style={styles.miniMetricText}>❌{currentTask.errors}</Text>
                </View>
              </>
            )}
            <Ionicons name="chevron-down" size={16} color={Colors.base.whitePrimary} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 16,
    zIndex: 1000,
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    minWidth: 100,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  badgeExpanded: {
    width: 280,
    padding: Spacing.md,
  },
  collapsedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.functional.error,
  },
  collapsedText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
    letterSpacing: 1,
  },
  timerText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.functional.warning,
  },
  miniMetrics: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  miniMetricText: {
    fontSize: Typography.sizes.caption,
    color: Colors.base.whitePrimary,
  },
  expandedContent: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
  },
  currentTaskSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  taskName: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.base.whitePrimary,
    marginBottom: Spacing.xs,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  metricValue: {
    fontSize: Typography.sizes.caption,
    color: Colors.base.whitePrimary,
  },
  summarySection: {
    gap: Spacing.sm,
  },
  summaryTitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.grays.light,
    fontWeight: Typography.weights.medium,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  summaryItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.grays.light,
  },
  summaryValue: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
    marginTop: 2,
  },
});
