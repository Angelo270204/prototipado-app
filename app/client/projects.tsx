/**
 * Client Module - Main Screen
 * Vista unificada con tabs locales (Proyectos, Visor AR, Comentarios)
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import ARViewer from '@/components/ar/ARViewer';
import NotificationBadge from '@/components/molecules/NotificationBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { mockUsers } from '@/data/mockData';

type TabType = 'projects' | 'ar' | 'comments';

export default function ClientMainScreen() {
  const router = useRouter();
  const { notifications, markNotificationAsRead, unreadCount } = useAuth();
  const { approveProject, rejectProject, projects } = useApp();

  // Debug logs
  console.log('📱 [Cliente] Notifications:', notifications.length, 'Unread:', unreadCount);

  const [selectedTab, setSelectedTab] = useState<TabType>('projects');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);

  // Proyectos compartidos con el cliente (filtrados desde AppContext)
  const sharedProjects = projects
    .filter(p => (p.sharedRoles ? p.sharedRoles.includes('client') : true))
    .map(p => ({
      id: p.id,
      name: p.name,
      designer: mockDesignerNamePlaceholder(),
      sharedDate: p.createdAt,
      status: (p.status === 'validation' || p.status === 'pending') ? 'pending' : p.status,
      progress: p.progress || 0,
      hasComments: true,
      commentCount: 0,
    }));

  console.log('🔍 [Cliente] Total proyectos en contexto:', projects.length);
  console.log('🔍 [Cliente] IDs proyectos en contexto:', projects.map(p => p.id));
  console.log('🔍 [Cliente] Proyectos filtrados para cliente:', sharedProjects.length);

  function mockDesignerNamePlaceholder() {
    // Intento simple de obtener nombre de diseñador desde mockUsers
    const d = mockUsers.find(u => u.role === 'designer');
    return d ? d.name : 'Diseñador';
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return Colors.functional.success;
      case 'pending':
        return Colors.functional.warning;
      case 'rejected':
        return Colors.functional.error;
      default:
        return Colors.grays.dark;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendiente revisión',
      approved: 'Aprobado',
      rejected: 'Rechazado',
    };
    return statusMap[status] || status;
  };

  // Funciones para Visor AR
  const handleScan = () => {
    setIsARActive(true);
  };

  const handleCloseAR = () => {
    setIsARActive(false);
  };

  const handleCapture = () => {
    setCaptureCount(prev => prev + 1);
    Alert.alert(
      'Captura Realizada',
      `Se ha guardado la captura #${captureCount + 1} en tu galería`,
      [{ text: 'OK' }]
    );
  };

  const handleMeasure = () => {
    Alert.alert(
      'Mediciones Activas',
      'Ahora puedes ver las medidas del modelo en la vista AR',
      [{ text: 'Entendido' }]
    );
  };

  const handleShareAR = () => {
    Alert.alert(
      'Compartir',
      '¿Deseas compartir este modelo AR?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartir', onPress: () => {} },
      ]
    );
  };


  const handleApproveProject = (projectId: string, projectName: string) => {
    Alert.alert(
      'Aprobar Proyecto',
      `¿Estás seguro de aprobar "${projectName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          style: 'default',
          onPress: () => {
            approveProject(projectId);
            Alert.alert(
              'Proyecto Aprobado',
              `El proyecto "${projectName}" ha sido aprobado y notificado al equipo de producción.`
            );
          },
        },
      ]
    );
  };

  const handleRejectProject = (projectId: string, projectName: string) => {
    Alert.prompt(
      'Rechazar Proyecto',
      'Por favor indica el motivo del rechazo:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: (reason?: string) => {
            if (reason && reason.trim()) {
              rejectProject(projectId, reason);
              Alert.alert(
                'Proyecto Rechazado',
                `El diseñador ha sido notificado del rechazo de "${projectName}" y tus comentarios.`
              );
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const handleOpenChat = (projectId: string) => {
    // Navegar a la pantalla compartida de comentarios
    router.push(`/shared/project-comments?projectId=${projectId}`);
  };

  // Renderizado de contenido según tab
  const renderContent = () => {
    switch (selectedTab) {
      case 'projects':
        return renderProjects();
      case 'ar':
        return renderARViewer();
      default:
        return null;
    }
  };

  const renderProjects = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Proyectos Compartidos</Text>

      {/* Acciones Rápidas */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleOpenChat('p1')}
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionIconText}>💬</Text>
            </View>
            <Text style={styles.quickActionLabel}>Chat Equipo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => setSelectedTab('ar')}
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionIconText}>📱</Text>
            </View>
            <Text style={styles.quickActionLabel}>Visor AR</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/client/profile')}
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionIconText}>👤</Text>
            </View>
            <Text style={styles.quickActionLabel}>Mi Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Proyectos */}
      <View style={styles.projectsList}>
        {sharedProjects.map((project) => (
          <View key={project.id} style={styles.projectCard}>
            {/* Icono del proyecto */}
            <View style={styles.projectIconContainer}>
              <Ionicons name="construct" size={32} color={Colors.base.whitePrimary} />
            </View>

            {/* Información del proyecto */}
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectDesigner}>Por {project.designer}</Text>
              <Text style={styles.projectDate}>Compartido el {project.sharedDate}</Text>
              
              {/* Barra de Progreso */}
              <View style={styles.projectProgressContainer}>
                <View style={styles.projectProgressBar}>
                  <View style={[styles.projectProgressFill, { width: `${project.progress}%` }]} />
                </View>
                <Text style={styles.projectProgressText}>{project.progress}%</Text>
              </View>
            </View>

            {/* Badge de estado */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
              <Text style={styles.statusBadgeText}>{getStatusText(project.status)}</Text>
            </View>

            {/* Botones de acción */}
            <View style={styles.projectActions}>
              <TouchableOpacity
                style={styles.actionButtonSmall}
                onPress={() => setSelectedTab('ar')}
              >
                <Ionicons name="scan" size={16} color={Colors.base.whitePrimary} />
                <Text style={styles.actionButtonSmallText}>Ver AR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButtonSmall}
                onPress={() => handleOpenChat(project.id)}
              >
                <Ionicons name="chatbubbles" size={16} color={Colors.base.whitePrimary} />
                <Text style={styles.actionButtonSmallText}>Chat</Text>
              </TouchableOpacity>
            </View>

            {/* Botones de Aprobación/Rechazo */}
            {project.status === 'pending' && (
              <View style={styles.approvalButtons}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleApproveProject(project.id, project.name)}
                >
                  <Ionicons name="checkmark-circle" size={20} color={Colors.base.whitePrimary} />
                  <Text style={styles.approveButtonText}>Aprobar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleRejectProject(project.id, project.name)}
                >
                  <Ionicons name="close-circle" size={20} color={Colors.base.whitePrimary} />
                  <Text style={styles.rejectButtonText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Instrucciones */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>¿Cómo usar el visor AR?</Text>
        <View style={styles.instructionsList}>
          <Text style={styles.instructionItem}>1. Selecciona un proyecto</Text>
          <Text style={styles.instructionItem}>2. Toca Ver en AR</Text>
          <Text style={styles.instructionItem}>3. Apunta tu cámara a una superficie plana</Text>
          <Text style={styles.instructionItem}>4. El modelo aparecerá a escala real</Text>
          <Text style={styles.instructionItem}>5. Usa los controles para medir, rotar y escalar</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderARViewer = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Visor AR - Motor Industrial V3</Text>

      {/* Visor AR */}
      <View style={styles.arViewerContainer}>
        <View style={styles.arView}>
          <Ionicons
            name="cube-outline"
            size={80}
            color={Colors.base.whitePrimary}
          />
        </View>

        <View style={styles.modelSelector}>
          <TouchableOpacity style={styles.modelButton}>
            <Text style={styles.modelButtonText}>SLDPRT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modelButton}>
            <Text style={styles.modelButtonText}>Escalar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modelButton}>
            <Text style={styles.modelButtonText}>Medir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Validación AR */}
      <View style={styles.validationSection}>
        <Text style={styles.validationTitle}>Validación AR</Text>

        <View style={styles.validationCard}>
          <View style={styles.validationHeader}>
            <Text style={styles.validationLabel}>Escala validada</Text>
            <View style={styles.validationBadge}>
              <Text style={styles.validationBadgeText}>Aprobado</Text>
            </View>
          </View>
          <Text style={styles.validationMessage}>1:1 - Dimensiones correctas</Text>
        </View>

        <View style={styles.validationCard}>
          <View style={styles.validationHeader}>
            <Text style={styles.validationLabel}>Sin colisiones</Text>
            <View style={styles.validationBadge}>
              <Text style={styles.validationBadgeText}>Aprobado</Text>
            </View>
          </View>
          <Text style={styles.validationMessage}>Todos los componentes alineados</Text>
        </View>

        <View style={styles.validationCard}>
          <View style={styles.validationHeader}>
            <Text style={styles.validationLabel}>Espacio insuficiente</Text>
            <View style={[styles.validationBadge, styles.validationBadgeError]}>
              <Text style={styles.validationBadgeText}>Error</Text>
            </View>
          </View>
          <Text style={styles.validationMessage}>Se requieren 5m² adicionales</Text>
        </View>
      </View>

      {/* Botones de Acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleScan}>
          <Ionicons name="scan-outline" size={20} color={Colors.base.whitePrimary} />
          <Text style={styles.actionButtonText}>Escanear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShareAR}>
          <Ionicons name="share-social-outline" size={20} color={Colors.base.whitePrimary} />
          <Text style={styles.actionButtonText}>Compartir</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Módulo Cliente</Text>
          <Text style={styles.headerSubtitle}>Validación de diseños en AR</Text>
        </View>
        <NotificationBadge
          count={unreadCount}
          onPress={() => {
            console.log('📱 [Cliente] Abriendo modal de notificaciones');
            setShowNotifications(true);
          }}
        />
      </View>

      {/* Modal de Notificaciones */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notificaciones ({unreadCount})</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Ionicons name="close" size={24} color={Colors.base.blackPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {notifications.length === 0 ? (
                <View style={styles.emptyNotifications}>
                  <Ionicons name="notifications-outline" size={64} color={Colors.grays.medium} />
                  <Text style={styles.emptyNotificationsText}>
                    No tienes notificaciones
                  </Text>
                  <Text style={styles.emptyNotificationsSubtext}>
                    Te notificaremos sobre nuevos proyectos y actualizaciones
                  </Text>
                </View>
              ) : (
                notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.read && styles.notificationItemUnread,
                    ]}
                    onPress={() => markNotificationAsRead(notification.id)}
                  >
                    <View style={styles.notificationIcon}>
                      <Ionicons
                        name={
                          notification.type === 'project_shared'
                            ? 'share-outline'
                            : notification.type === 'project_approved'
                            ? 'checkmark-circle-outline'
                            : notification.type === 'comment_added'
                            ? 'chatbubble-outline'
                            : 'notifications-outline'
                        }
                        size={24}
                        color={Colors.functional.info}
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <Text style={styles.notificationTime}>
                        {new Date(notification.timestamp).toLocaleString('es-ES')}
                      </Text>
                    </View>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>


      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'projects' && styles.tabActive]}
          onPress={() => setSelectedTab('projects')}
        >
          <Text style={[styles.tabText, selectedTab === 'projects' && styles.tabTextActive]}>
            Proyectos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'ar' && styles.tabActive]}
          onPress={() => setSelectedTab('ar')}
        >
          <Text style={[styles.tabText, selectedTab === 'ar' && styles.tabTextActive]}>
            Visor AR
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setSelectedTab('projects')}
        >
          <Ionicons
            name="folder"
            size={24}
            color={selectedTab === 'projects' ? Colors.base.blackPrimary : Colors.text.secondary}
          />
          <Text style={[styles.navLabel, selectedTab === 'projects' && styles.navLabelActive]}>
            Proyectos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setSelectedTab('ar')}
        >
          <Ionicons
            name="scan"
            size={24}
            color={selectedTab === 'ar' ? Colors.base.blackPrimary : Colors.text.secondary}
          />
          <Text style={[styles.navLabel, selectedTab === 'ar' && styles.navLabelActive]}>
            Vista AR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/client/profile')}
        >
          <Ionicons name="person" size={24} color={Colors.text.secondary} />
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Modal AR Viewer */}
      <Modal
        visible={isARActive}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <ARViewer
          modelName="Motor Industrial V3"
          onClose={handleCloseAR}
          onCapture={handleCapture}
          onMeasure={handleMeasure}
        />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    fontStyle: 'italic',
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.grays.dark,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.functional.info,
  },
  tabText: {
    fontSize: 14,
    color: Colors.grays.dark,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.functional.info,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.base.blackPrimary,
    marginBottom: 20,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.base.blackPrimary,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.grays.dark,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.base.whitePrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.base.whitePrimary,
    textAlign: 'center',
  },
  projectsList: {
    gap: 16,
    marginBottom: 24,
  },
  projectCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.base.blackPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  projectIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.base.blackPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  projectInfo: {
    marginBottom: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    marginBottom: 4,
  },
  projectDesigner: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  projectDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  projectProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  projectProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.grays.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  projectProgressFill: {
    height: '100%',
    backgroundColor: Colors.functional.success,
    borderRadius: 3,
  },
  projectProgressText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.functional.success,
    minWidth: 32,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  projectActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonSmall: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonSmallText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  approvalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.functional.success,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.functional.error,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  instructionsCard: {
    backgroundColor: Colors.grays.dark,
    borderRadius: 16,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  instructionsList: {
    gap: 8,
  },
  instructionItem: {
    fontSize: 13,
    color: Colors.grays.light,
    lineHeight: 20,
  },
  arViewerContainer: {
    backgroundColor: Colors.grays.dark,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  arView: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grays.dark,
  },
  modelSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    justifyContent: 'center',
  },
  modelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.base.whitePrimary,
    minWidth: 90,
    alignItems: 'center',
  },
  modelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.base.blackPrimary,
    fontStyle: 'italic',
  },
  validationSection: {
    marginBottom: 24,
  },
  validationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.base.blackPrimary,
    marginBottom: 16,
  },
  validationCard: {
    backgroundColor: Colors.grays.dark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  validationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  validationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
    fontStyle: 'italic',
  },
  validationBadge: {
    backgroundColor: Colors.functional.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  validationBadgeError: {
    backgroundColor: Colors.functional.error,
  },
  validationBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
  },
  validationMessage: {
    fontSize: 12,
    color: Colors.grays.light,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  commentsList: {
    gap: 16,
    marginBottom: 24,
  },
  commentCard: {
    backgroundColor: Colors.grays.light,
    borderRadius: 12,
    padding: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.functional.info,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  commentHeaderInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
  },
  commentDate: {
    fontSize: 11,
    color: Colors.grays.dark,
    marginTop: 2,
  },
  commentText: {
    fontSize: 13,
    color: Colors.base.blackPrimary,
    lineHeight: 20,
  },
  commentInputSection: {
    marginBottom: 24,
  },
  commentInputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: Colors.base.whitePrimary,
    borderWidth: 1,
    borderColor: Colors.grays.medium,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: Colors.base.blackPrimary,
    minHeight: 100,
    marginBottom: 12,
  },
  sendCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  sendCommentButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.base.whitePrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.medium,
    paddingVertical: 8,
    paddingBottom: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  navLabelActive: {
    color: Colors.base.blackPrimary,
    fontWeight: '600',
  },
  // Estilos del Modal de Notificaciones
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  notificationModal: {
    backgroundColor: Colors.base.whitePrimary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
  },
  modalContent: {
    maxHeight: 500,
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 300,
  },
  emptyNotificationsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 20,
    textAlign: 'center',
  },
  emptyNotificationsSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
    gap: 12,
  },
  notificationItemUnread: {
    backgroundColor: Colors.background.secondary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grays.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.base.blackPrimary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: Colors.grays.dark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.functional.info,
    marginTop: 6,
  },
});
