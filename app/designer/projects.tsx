/**
 * Designer Module - Main Screen
 * Vista unificada con tabs locales (Proyectos, Importar, Visor AR) - Yardy Diseñador
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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import ARViewer from '@/components/ar/ARViewer';
import NotificationBadge from '@/components/molecules/NotificationBadge';

type TabType = 'projects' | 'import' | 'ar';

export default function DesignerMainScreen() {
  const router = useRouter();
  const { projects } = useApp();
  const { notifications, markNotificationAsRead, unreadCount } = useAuth();

  // Debug logs
  console.log('🎨 [Diseñador] Notifications:', notifications.length, 'Unread:', unreadCount);

  const [selectedTab, setSelectedTab] = useState<TabType>('projects');
  const [showNotifications, setShowNotifications] = useState(false);

  // Estados para Importar
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    uri: string;
  } | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [processingOptions, setProcessingOptions] = useState({
    detectCollisions: false,
    generateBOM: false,
    createAssemblyGuides: false,
  });

  // Estados para Visor AR
  const [selectedModel, setSelectedModel] = useState<string>('SLDPRT');
  const [isARActive, setIsARActive] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);

  const supportedFormats = ['SLDPRT', 'DWG', 'STEP', 'STL', 'IGES', 'OBJ'];
  const modelTypes = ['SLDPRT', 'Escalar', 'Medir'];

  const validations = {
    scale: { valid: true, message: '1:1 - Dimensiones correctas' },
    collisions: { valid: true, message: 'Todos los componentes alineados' },
    space: { valid: false, message: 'Se requieren 5m² adicionales' },
  };

  // Funciones para Proyectos
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return Colors.functional.success;
      case 'in_progress':
        return Colors.functional.info;
      case 'validation':
        return Colors.functional.warning;
      case 'pending':
        return Colors.functional.error;
      default:
        return Colors.grays.dark;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendiente Revisión',
      in_progress: 'En Validación',
      validation: 'Pendiente Revisión',
      approved: 'Aprobado',
      completed: 'Aprobado',
    };
    return statusMap[status] || status;
  };

  // Funciones para Importar
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/octet-stream',
          'application/sla',
          'model/stl',
          'application/step',
          'application/iges',
          'model/obj',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          name: file.name,
          size: file.size || 0,
          uri: file.uri,
        });
      }
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  const toggleOption = (option: keyof typeof processingOptions) => {
    setProcessingOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleContinueImport = () => {
    if (!selectedFile) {
      Alert.alert('Atención', 'Por favor selecciona un archivo CAD');
      return;
    }

    Alert.alert(
      'Archivo importado',
      `Archivo: ${selectedFile.name}\nFormatos seleccionados: ${selectedFormats.join(', ') || 'Ninguno'}`,
      [
        {
          text: 'Continuar',
          onPress: () => {
            router.push('/designer/new-project');
          },
        },
      ]
    );
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
      '¿Deseas compartir este modelo AR con el equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartir', onPress: () => {} },
      ]
    );
  };

  // Renderizado de contenido según tab seleccionado
  const renderContent = () => {
    switch (selectedTab) {
      case 'projects':
        return renderProjects();
      case 'import':
        return renderImport();
      case 'ar':
        return renderARViewer();
      default:
        return null;
    }
  };

  const renderProjects = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MIS PROYECTOS</Text>
        <TouchableOpacity 
          style={styles.newButton}
          onPress={() => router.push('/designer/new-project')}
        >
          <Text style={styles.newButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Projects List */}
      <View style={styles.projectsList}>
        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            onPress={() => router.push(`/designer/project-detail?id=${project.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.projectCardContent}>
              {/* Project Info */}
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectDetails}>
                  v{project.id.slice(0, 3)} • {new Date(project.updatedAt).toLocaleDateString('es-ES', { 
                    day: 'numeric',
                    month: 'short'
                  })}
                </Text>
              </View>

              {/* Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                <Text style={styles.statusText}>{getStatusText(project.status)}</Text>
              </View>
            </View>

            {/* Share Button */}
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={(e) => {
                e.stopPropagation();
              }}
            >
              <Ionicons name="share-social" size={18} color={Colors.base.whitePrimary} />
              <Text style={styles.shareButtonText}>Compartido</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Empty State */}
      {projects.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay proyectos disponibles</Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => router.push('/designer/new-project')}
          >
            <Text style={styles.emptyButtonText}>Crear primer proyecto</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderImport = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Importar Archivo CAD</Text>

      {/* Área de selección de archivo */}
      <View style={styles.fileUploadArea}>
        <Ionicons
          name="document-text-outline"
          size={48}
          color={Colors.base.whitePrimary}
          style={styles.fileIcon}
        />
        <Text style={styles.fileUploadTitle}>Arrastra tu archivo CAD</Text>
        <Text style={styles.fileUploadSubtitle}>
          Formatos: .dwg, .shl, .obj, .step
        </Text>
        <TouchableOpacity
          style={styles.selectFileButton}
          onPress={handleSelectFile}
        >
          <Text style={styles.selectFileButtonText}>SELECCIONAR ARCHIVO</Text>
        </TouchableOpacity>
        {selectedFile && (
          <View style={styles.selectedFileInfo}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.functional.success} />
            <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
          </View>
        )}
      </View>

      {/* Formatos Soportados */}
      <View style={styles.formatsSection}>
        <Text style={styles.formatsSectionTitle}>Formatos Soportados</Text>
        <View style={styles.formatsGrid}>
          {supportedFormats.map((format) => (
            <TouchableOpacity
              key={format}
              style={[
                styles.formatButton,
                selectedFormats.includes(format) && styles.formatButtonActive,
              ]}
              onPress={() => toggleFormat(format)}
            >
              <Text
                style={[
                  styles.formatButtonText,
                  selectedFormats.includes(format) && styles.formatButtonTextActive,
                ]}
              >
                {format}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Opciones de Procesamiento */}
      <View style={styles.optionsSection}>
        <Text style={styles.optionsSectionTitle}>Opciones de Procesamiento</Text>
        
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => toggleOption('detectCollisions')}
        >
          <View style={styles.checkbox}>
            {processingOptions.detectCollisions && (
              <Ionicons name="checkmark" size={16} color={Colors.base.blackPrimary} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Detectar colisiones automáticamente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => toggleOption('generateBOM')}
        >
          <View style={styles.checkbox}>
            {processingOptions.generateBOM && (
              <Ionicons name="checkmark" size={16} color={Colors.base.blackPrimary} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Generar BOM (Bill of Materials)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => toggleOption('createAssemblyGuides')}
        >
          <View style={styles.checkbox}>
            {processingOptions.createAssemblyGuides && (
              <Ionicons name="checkmark" size={16} color={Colors.base.blackPrimary} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Crear guías de ensamblaje</Text>
        </TouchableOpacity>
      </View>

      {/* Botón Siguiente */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinueImport}
      >
        <Text style={styles.continueButtonText}>Siguiente</Text>
      </TouchableOpacity>

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

      {/* Visor AR Principal */}
      <View style={styles.arViewerContainer}>
        <View style={styles.arView}>
          <Ionicons
            name="cube-outline"
            size={80}
            color={Colors.base.whitePrimary}
          />
        </View>

        {/* Model Type Selector */}
        <View style={styles.modelSelector}>
          {modelTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.modelButton,
                selectedModel === type && styles.modelButtonActive,
              ]}
              onPress={() => setSelectedModel(type)}
            >
              <Text
                style={[
                  styles.modelButtonText,
                  selectedModel === type && styles.modelButtonTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
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
          <Text style={styles.validationMessage}>
            {validations.scale.message}
          </Text>
        </View>

        <View style={styles.validationCard}>
          <View style={styles.validationHeader}>
            <Text style={styles.validationLabel}>Sin colisiones</Text>
            <View style={styles.validationBadge}>
              <Text style={styles.validationBadgeText}>Aprobado</Text>
            </View>
          </View>
          <Text style={styles.validationMessage}>
            {validations.collisions.message}
          </Text>
        </View>

        <View style={styles.validationCard}>
          <View style={styles.validationHeader}>
            <Text style={styles.validationLabel}>Espacio insuficiente</Text>
            <View style={[styles.validationBadge, styles.validationBadgeError]}>
              <Text style={styles.validationBadgeText}>Error</Text>
            </View>
          </View>
          <Text style={styles.validationMessage}>
            {validations.space.message}
          </Text>
        </View>
      </View>

      {/* Botones de Acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleScan}
        >
          <Ionicons name="scan-outline" size={20} color={Colors.base.whitePrimary} />
          <Text style={styles.actionButtonText}>Escanear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShareAR}
        >
          <Ionicons name="share-social-outline" size={20} color={Colors.base.whitePrimary} />
          <Text style={styles.actionButtonText}>Compartir</Text>
        </TouchableOpacity>
      </View>

      {/* Información adicional */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.grays.dark} />
          <Text style={styles.infoText}>
            Mueve tu dispositivo para explorar el modelo en AR
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="hand-left-outline" size={18} color={Colors.grays.dark} />
          <Text style={styles.infoText}>
            Usa gestos para rotar, escalar y mover el modelo
          </Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Módulo Diseñador</Text>
          <Text style={styles.headerSubtitle}>Gestión de proyectos CAD y AR</Text>
        </View>
        <NotificationBadge
          count={unreadCount}
          onPress={() => {
            console.log('🎨 [Diseñador] Abriendo modal de notificaciones');
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
                    Te notificaremos sobre actualizaciones de proyectos, aprobaciones y comentarios
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
                          notification.type === 'project_approved'
                            ? 'checkmark-circle-outline'
                            : notification.type === 'project_rejected'
                            ? 'close-circle-outline'
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
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'projects' && styles.tabActive]}
          onPress={() => setSelectedTab('projects')}
        >
          <Text style={[styles.tabText, selectedTab === 'projects' && styles.tabTextActive]}>
            Proyectos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'import' && styles.tabActive]}
          onPress={() => setSelectedTab('import')}
        >
          <Text style={[styles.tabText, selectedTab === 'import' && styles.tabTextActive]}>
            Importar
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

      {/* Content Area */}
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
            Vista RA
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('/designer/profile')}
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  headerContent: {
    flex: 1,
  },
  notificationButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
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
  tabsContainer: {
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
    borderBottomColor: Colors.base.blackPrimary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.grays.dark,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.base.blackPrimary,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    fontStyle: 'italic',
  },
  newButton: {
    backgroundColor: Colors.base.blackPrimary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  newButtonText: {
    color: Colors.base.whitePrimary,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
  },
  projectsList: {
    paddingHorizontal: Spacing.lg,
  },
  projectCard: {
    backgroundColor: Colors.base.blackPrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  projectCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.base.whitePrimary,
    marginBottom: Spacing.xs,
  },
  projectDetails: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.label,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  shareButtonText: {
    fontSize: Typography.sizes.caption,
    color: Colors.base.whitePrimary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.base.blackPrimary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.round,
  },
  emptyButtonText: {
    color: Colors.base.whitePrimary,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.base.whitePrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.medium,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  navLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  navLabelActive: {
    color: Colors.base.blackPrimary,
    fontWeight: Typography.weights.semibold,
  },

  // Import Styles
  fileUploadArea: {
    backgroundColor: Colors.grays.dark,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  fileIcon: {
    marginBottom: 16,
  },
  fileUploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
    marginBottom: 8,
  },
  fileUploadSubtitle: {
    fontSize: 12,
    color: Colors.grays.light,
    marginBottom: 20,
  },
  selectFileButton: {
    backgroundColor: Colors.base.whitePrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectFileButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    letterSpacing: 0.5,
  },
  selectedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  selectedFileName: {
    fontSize: 13,
    color: Colors.functional.success,
    fontWeight: '600',
  },
  formatsSection: {
    backgroundColor: Colors.grays.dark,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  formatsSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  formatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  formatButton: {
    backgroundColor: Colors.base.blackPrimary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  formatButtonActive: {
    backgroundColor: Colors.base.whitePrimary,
  },
  formatButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  formatButtonTextActive: {
    color: Colors.base.blackPrimary,
  },
  optionsSection: {
    marginBottom: 32,
  },
  optionsSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.base.blackPrimary,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.grays.medium,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.base.whitePrimary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.base.blackPrimary,
    flex: 1,
  },
  continueButton: {
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },

  // AR Viewer Styles
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
  modelButtonActive: {
    backgroundColor: Colors.grays.light,
  },
  modelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.base.blackPrimary,
    fontStyle: 'italic',
  },
  modelButtonTextActive: {
    color: Colors.base.blackPrimary,
    fontWeight: 'bold',
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
  infoSection: {
    backgroundColor: Colors.grays.light,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.grays.dark,
    lineHeight: 18,
  },
  // Estilos del Modal de Notificaciones
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  notificationModal: {
    backgroundColor: Colors.base.whitePrimary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl,
    maxHeight: '70%',
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
  modalContent: {
    maxHeight: 500,
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    minHeight: 300,
  },
  emptyNotificationsText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  emptyNotificationsSubtext: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
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
    marginRight: 12,
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