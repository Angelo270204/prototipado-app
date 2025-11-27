/**
 * Production Metrics Screen
 * Vista de métricas y estadísticas de producción
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { mockWorkOrders, mockProjects } from '@/data/mockData';


export default function ProductionMetricsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');

  // Calcular métricas
  const totalOrders = mockWorkOrders.length;
  const completedOrders = mockWorkOrders.filter(wo => wo.status === 'completed').length;
  const inProgressOrders = mockWorkOrders.filter(wo => wo.status === 'in_progress').length;
  const pendingOrders = mockWorkOrders.filter(wo => wo.status === 'pending').length;

  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'in_progress').length;

  // Datos de eficiencia por día (simulado)
  const efficiencyData = [
    { day: 'Lun', value: 85 },
    { day: 'Mar', value: 92 },
    { day: 'Mié', value: 88 },
    { day: 'Jue', value: 95 },
    { day: 'Vie', value: 90 },
    { day: 'Sáb', value: 75 },
    { day: 'Dom', value: 70 },
  ];

  const periods = [
    { key: 'day', label: 'Hoy' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mes' },
  ];

  const metrics = [
    {
      title: 'Órdenes Completadas',
      value: completedOrders,
      total: totalOrders,
      icon: 'checkmark-circle',
      color: Colors.success.main,
      percentage: completionRate,
    },
    {
      title: 'En Progreso',
      value: inProgressOrders,
      total: totalOrders,
      icon: 'time',
      color: Colors.functional.warning,
      percentage: totalOrders > 0 ? Math.round((inProgressOrders / totalOrders) * 100) : 0,
    },
    {
      title: 'Pendientes',
      value: pendingOrders,
      total: totalOrders,
      icon: 'hourglass',
      color: Colors.functional.info,
      percentage: totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0,
    },
    {
      title: 'Proyectos Activos',
      value: activeProjects,
      total: totalProjects,
      icon: 'briefcase',
      color: Colors.base.blackPrimary,
      percentage: totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0,
    },
  ];

  const kpis = [
    { label: 'Eficiencia Promedio', value: '89%', trend: '+5%', trendUp: true },
    { label: 'Tiempo Promedio', value: '4.2h', trend: '-12%', trendUp: true },
    { label: 'Calidad', value: '96%', trend: '+2%', trendUp: true },
    { label: 'Retrabajos', value: '4%', trend: '-1%', trendUp: true },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.base.blackPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Métricas de Producción</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => {}}
        >
          <Ionicons name="download-outline" size={24} color={Colors.base.blackPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Ionicons name={metric.icon as any} size={24} color={metric.color} />
                  <Text style={styles.metricPercentage}>{metric.percentage}%</Text>
                </View>
                <Text style={styles.metricValue}>
                  {metric.value}/{metric.total}
                </Text>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${metric.percentage}%`, backgroundColor: metric.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* KPIs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicadores Clave (KPIs)</Text>
          <View style={styles.kpiGrid}>
            {kpis.map((kpi, index) => (
              <View key={index} style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
                <View style={styles.kpiTrend}>
                  <Ionicons
                    name={kpi.trendUp ? 'trending-up' : 'trending-down'}
                    size={16}
                    color={kpi.trendUp ? Colors.success.main : Colors.functional.error}
                  />
                  <Text
                    style={[
                      styles.kpiTrendText,
                      { color: kpi.trendUp ? Colors.success.main : Colors.functional.error },
                    ]}
                  >
                    {kpi.trend}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Efficiency Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eficiencia Semanal</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
              {efficiencyData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        { height: `${item.value}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                  <Text style={styles.barValue}>{item.value}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Production Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Producción</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total de Órdenes</Text>
              <Text style={styles.summaryValue}>{totalOrders}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Horas Trabajadas</Text>
              <Text style={styles.summaryValue}>324h</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Operarios Activos</Text>
              <Text style={styles.summaryValue}>15</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Promedio por Orden</Text>
              <Text style={styles.summaryValue}>4.2h</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/dashboard')}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/work-orders')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Órdenes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/metrics')}>
          <Text style={styles.navIcon}>📈</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Métricas</Text>
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
    backgroundColor: Colors.base.whitePrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  exportButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  periodButtonActive: {
    backgroundColor: Colors.base.blackPrimary,
  },
  periodButtonText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  periodButtonTextActive: {
    color: Colors.base.whitePrimary,
    fontWeight: Typography.weights.semibold,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
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
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grays.light,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metricPercentage: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  metricValue: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.grays.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: '48%',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  kpiLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: 4,
  },
  kpiTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kpiTrendText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    marginLeft: 4,
  },
  chartContainer: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '70%',
    height: 150,
    justifyContent: 'flex-end',
    marginBottom: Spacing.xs,
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.base.blackPrimary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  barValue: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.grays.light,
    marginVertical: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.base.whitePrimary,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
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
    color: Colors.base.blackPrimary,
    fontWeight: Typography.weights.semibold,
  },
});

