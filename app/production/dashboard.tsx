/**
 * Production Dashboard Screen
 * Panel de control para módulo de producción
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { mockWorkOrders, mockProjects } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';

export default function ProductionDashboardScreen() {
  const router = useRouter();
  const { currentUser } = useApp();

  const pendingOrders = mockWorkOrders.filter(wo => wo.status === 'pending').length;
  const inProgressOrders = mockWorkOrders.filter(wo => wo.status === 'in_progress').length;
  const completedOrders = mockWorkOrders.filter(wo => wo.status === 'completed').length;
  const activeProjects = mockProjects.filter(p => p.status === 'in_progress' || p.status === 'validation').length;

  const metrics = [
    { label: 'Órdenes Pendientes', value: pendingOrders, color: Colors.text.secondary, icon: '⏳' },
    { label: 'En Progreso', value: inProgressOrders, color: Colors.focus, icon: '🔄' },
    { label: 'Completadas Hoy', value: completedOrders, color: Colors.success, icon: '✓' },
    { label: 'Proyectos Activos', value: activeProjects, color: Colors.warning, icon: '📊' },
  ];

  const quickActions = [
    { title: 'Crear Orden de Trabajo', icon: '➕', action: () => router.push('/production/work-orders') },
    { title: 'Ver Métricas', icon: '📈', action: () => router.push('/production/metrics') },
    { title: 'Gestionar Recursos', icon: '👥', action: () => {} },
    { title: 'Reportes', icon: '📄', action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hola, {currentUser?.name?.split(' ')[0] || 'Producción'}
            </Text>
            <Text style={styles.subtitle}>Panel de Control</Text>
          </View>
        </View>

        {/* Metrics Cards */}
        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <Text style={styles.metricIcon}>{metric.icon}</Text>
              <Text style={[styles.metricValue, { color: metric.color }]}>
                {metric.value}
              </Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.action}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.activityText}>
                Orden WO-HSE2024-001 actualizada - Paso 4/10 completado
              </Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: Colors.focus }]} />
              <Text style={styles.activityText}>
                Nuevo proyecto "Bastidor de Maquinaria Pesada" creado
              </Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.activityText}>
                Orden WO-CHUTE-002 asignada a Roberto Castillo
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/dashboard')}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/work-orders')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Órdenes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/metrics')}>
          <Text style={styles.navIcon}>📈</Text>
          <Text style={styles.navLabel}>Métricas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.background.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  metricValue: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.background.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
  activityCard: {
    backgroundColor: Colors.background.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.round,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  activityText: {
    flex: 1,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.sizes.bodySmall,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.background.cardDark,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.background.darker,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  navLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  navLabelActive: {
    color: Colors.priority.medium,
    fontWeight: Typography.weights.semibold,
  },
});
