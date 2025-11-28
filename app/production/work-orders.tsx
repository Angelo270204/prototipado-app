/**
 * Production Work Orders Screen
 * Gestión de órdenes de trabajo para supervisor de producción
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { mockWorkOrders } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import NotificationBadge from '@/components/molecules/NotificationBadge';

export default function ProductionWorkOrdersScreen() {
  const router = useRouter();
  const { unreadCount } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [operatorName, setOperatorName] = useState('');

  // Filtrado por estado y prioridad
  let filteredOrders = selectedFilter === 'all'
    ? mockWorkOrders
    : mockWorkOrders.filter(wo => wo.status === selectedFilter);
  
  if (selectedPriorityFilter !== 'all') {
    filteredOrders = filteredOrders.filter(wo => {
      if (selectedPriorityFilter === 'high') return wo.priority === 'high';
      if (selectedPriorityFilter === 'medium') return wo.priority === 'medium' || wo.priority === 'normal';
      if (selectedPriorityFilter === 'low') return wo.priority === 'low';
      return true;
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.functional.success;
      case 'in_progress':
        return Colors.functional.info;
      case 'pending':
        return Colors.functional.warning;
      case 'cancelled':
        return Colors.functional.error;
      default:
        return Colors.grays.dark;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'in_progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      case 'paused':
        return 'Pausada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return Colors.functional.error;
      case 'medium':
      case 'normal':
        return Colors.functional.warning;
      case 'low':
        return Colors.functional.info;
      default:
        return Colors.grays.dark;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
      case 'normal':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  const handleScanQR = () => {
    Alert.alert(
      '📱 Escanear QR para Trazabilidad',
      'Escanea el código QR del componente para ver su historial completo',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Simular Escaneo', 
          onPress: () => {
            Alert.alert(
              '📋 Historial del Componente',
              'ID: COMP-HSE-2024-001\n\n' +
              '✅ Recibido: 15/Nov/2024\n' +
              '✅ Inspección: 16/Nov/2024\n' +
              '✅ Ensamblaje iniciado: 18/Nov/2024\n' +
              '⏳ En proceso: Paso 4 de 10\n\n' +
              'Operario: Roberto Castillo\n' +
              'Tiempo transcurrido: 2h 15min'
            );
          }
        },
      ]
    );
  };

  const handleCreateWorkOrder = () => {
    if (selectedProject && operatorName) {
      Alert.alert(
        'Orden Creada',
        `Nueva orden de trabajo creada para el proyecto ${selectedProject}`,
        [{ text: 'OK', onPress: () => setShowCreateModal(false) }]
      );
      setSelectedProject('');
      setOperatorName('');
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos');
    }
  };

  const filters = [
    { key: 'all', label: 'Todas', count: mockWorkOrders.length },
    { key: 'pending', label: 'Pendientes', count: mockWorkOrders.filter(wo => wo.status === 'pending').length },
    { key: 'in_progress', label: 'En Progreso', count: mockWorkOrders.filter(wo => wo.status === 'in_progress').length },
    { key: 'completed', label: 'Completadas', count: mockWorkOrders.filter(wo => wo.status === 'completed').length },
  ];

  const priorityFilters = [
    { key: 'all', label: 'Todas', icon: '📊' },
    { key: 'high', label: '🔴 Alta', icon: '🔴' },
    { key: 'medium', label: '🟡 Media', icon: '🟡' },
    { key: 'low', label: '🔵 Baja', icon: '🔵' },
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Órdenes de Trabajo</Text>
          <Text style={styles.headerSubtitle}>{filteredOrders.length} órdenes</Text>
        </View>
        <NotificationBadge
          count={unreadCount}
          onPress={() => {}}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Priority Filters - Prominentes para test de usabilidad */}
      <View style={styles.priorityFiltersContainer}>
        <Text style={styles.priorityFilterLabel}>Filtrar por Prioridad:</Text>
        <View style={styles.priorityFiltersRow}>
          {priorityFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.priorityChip,
                selectedPriorityFilter === filter.key && styles.priorityChipActive,
              ]}
              onPress={() => setSelectedPriorityFilter(filter.key as any)}
            >
              <Text style={styles.priorityChipText}>{filter.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions: Create & Scan QR */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add-circle" size={20} color={Colors.base.whitePrimary} />
          <Text style={styles.createButtonText}>Crear Nueva Orden</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.scanQRButton}
          onPress={handleScanQR}
        >
          <Ionicons name="qr-code-outline" size={20} color={Colors.base.blackPrimary} />
          <Text style={styles.scanQRButtonText}>Escanear QR</Text>
        </TouchableOpacity>
      </View>

      {/* Work Orders List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Header */}
            <View style={styles.orderHeader}>
              <View style={styles.orderHeaderLeft}>
                <Text style={styles.orderCode}>{order.id}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(order.priority) + '20' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(order.priority) }]}>
                    {getPriorityText(order.priority)}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
              </View>
            </View>

            {/* Project Info */}
            <Text style={styles.orderProject}>{order.projectName}</Text>
            {order.operatorName && (
              <View style={styles.operatorInfo}>
                <Ionicons name="person" size={14} color={Colors.text.secondary} />
                <Text style={styles.operatorText}>{order.operatorName}</Text>
              </View>
            )}

            {/* Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>
                  {order.completedSteps}/{order.totalSteps} pasos
                </Text>
                <Text style={styles.progressPercentage}>{order.progress}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${order.progress}%`, backgroundColor: getStatusColor(order.status) },
                  ]}
                />
              </View>
            </View>

            {/* Footer */}
            <View style={styles.orderFooter}>
              <View style={styles.dateInfo}>
                <Ionicons name="calendar-outline" size={14} color={Colors.text.secondary} />
                <Text style={styles.dateText}>Entrega: {order.dueDate}</Text>
              </View>
              <View style={styles.orderActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Detalles', `Ver detalles de ${order.id}`)}
                >
                  <Ionicons name="eye-outline" size={18} color={Colors.base.blackPrimary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Editar', `Editar ${order.id}`)}
                >
                  <Ionicons name="create-outline" size={18} color={Colors.base.blackPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Create Work Order Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Orden de Trabajo</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color={Colors.base.blackPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Proyecto</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="folder-outline" size={20} color={Colors.text.secondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Seleccionar proyecto"
                  value={selectedProject}
                  onChangeText={setSelectedProject}
                  placeholderTextColor={Colors.text.secondary}
                />
              </View>

              <Text style={styles.inputLabel}>Operario Asignado</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={Colors.text.secondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del operario"
                  value={operatorName}
                  onChangeText={setOperatorName}
                  placeholderTextColor={Colors.text.secondary}
                />
              </View>

              <Text style={styles.helperText}>
                Se generará automáticamente un código QR para esta orden
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleCreateWorkOrder}
              >
                <Text style={styles.confirmButtonText}>Crear Orden</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/dashboard')}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/production/work-orders')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Órdenes</Text>
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
  headerContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  filtersContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.grays.light,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.base.blackPrimary,
    borderColor: Colors.base.blackPrimary,
  },
  filterText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  filterTextActive: {
    color: Colors.base.whitePrimary,
    fontWeight: Typography.weights.semibold,
  },
  // Priority Filters Styles
  priorityFiltersContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.grays.light,
  },
  priorityFilterLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  priorityFiltersRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    backgroundColor: Colors.base.whitePrimary,
    borderWidth: 1,
    borderColor: Colors.grays.medium,
  },
  priorityChipActive: {
    backgroundColor: Colors.base.blackPrimary,
    borderColor: Colors.base.blackPrimary,
  },
  priorityChipText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.base.blackPrimary,
  },
  // Quick Actions Container
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  createButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base.blackPrimary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  createButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
    marginLeft: Spacing.sm,
  },
  scanQRButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.functional.info,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  scanQRButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginLeft: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderCode: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginRight: Spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  priorityText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
  },
  orderProject: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.xs,
  },
  operatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  operatorText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  progressPercentage: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  orderActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.base.whitePrimary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  modalTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  modalBody: {
    padding: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.sizes.body,
    color: Colors.base.blackPrimary,
  },
  helperText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.base.blackPrimary,
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  confirmButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
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

