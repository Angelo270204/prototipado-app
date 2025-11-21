/**
 * Operator Work Orders Screen
 * Lista de órdenes de trabajo para operarios
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
import { WorkOrderCard } from '@/components/molecules/WorkOrderCard';
import { mockWorkOrders } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';

export default function OperatorWorkOrdersScreen() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in_progress'>('all');

  const filters = [
    { key: 'all', label: 'Todas' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'in_progress', label: 'En Progreso' },
  ];

  const filteredOrders = selectedFilter === 'all'
    ? mockWorkOrders
    : mockWorkOrders.filter(wo => wo.status === selectedFilter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {currentUser?.name?.split(' ')[0] || 'Operario'}</Text>
            <Text style={styles.subtitle}>{filteredOrders.length} órdenes asignadas</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/operator/qr-scanner')}>
            <View style={styles.scanButton}>
              <Text style={styles.scanButtonText}>📷 Escanear</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                selectedFilter === filter.key && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/operator/qr-scanner')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>📷</Text>
              </View>
              <Text style={styles.quickActionLabel}>Escanear QR</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => alert('Próximamente: Ver guías de ensamblaje')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>📋</Text>
              </View>
              <Text style={styles.quickActionLabel}>Mis Guías</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => alert('Próximamente: Reportar problema')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>⚠️</Text>
              </View>
              <Text style={styles.quickActionLabel}>Reportar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => alert('Próximamente: Mi progreso')}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>📊</Text>
              </View>
              <Text style={styles.quickActionLabel}>Progreso</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Work Orders List */}
        <View style={styles.ordersContainer}>
          <Text style={styles.sectionTitle}>Mis Órdenes</Text>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay órdenes en esta categoría</Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <WorkOrderCard
                key={order.id}
                workOrder={order}
                onPress={() => router.push(`/operator/assembly-guide?id=${order.id}`)}
              />
            ))
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/operator/work-orders')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Órdenes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/operator/qr-scanner')}>
          <Text style={styles.navIcon}>📷</Text>
          <Text style={styles.navLabel}>Escanear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/operator/profile')}>
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
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scanButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  scanButtonText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#374151',
  },
  filterChipActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  filterText: {
    fontSize: Typography.sizes.bodySmall,
    color: '#9CA3AF',
    fontWeight: Typography.weights.medium,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.semibold,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  quickActionsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48.5%',
    backgroundColor: '#1F2937',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#374151',
    minHeight: 120,
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionIconText: {
    fontSize: 28,
  },
  quickActionLabel: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  ordersContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
    color: '#F59E0B',
    fontWeight: Typography.weights.semibold,
  },
});