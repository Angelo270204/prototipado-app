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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/DesignSystem';
import { useApp } from '@/contexts/AppContext';
import { Ionicons } from '@expo/vector-icons';
import ARViewer from '@/components/ar/ARViewer';

type TabType = 'projects' | 'ar' | 'comments';

export default function ClientMainScreen() {
  const router = useRouter();
  const { projects } = useApp();
  const [selectedTab, setSelectedTab] = useState<TabType>('projects');
  const [isARActive, setIsARActive] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [commentText, setCommentText] = useState('');

  // Proyectos compartidos con el cliente
  const sharedProjects = [
    {
      id: '1',
      name: 'Motor Industrial V3',
      designer: 'Ing. Carlos Méndez',
      sharedDate: '18 Nov 2025',
      status: 'pending',
      hasComments: true,
      commentCount: 3,
    },
    {
      id: '2',
      name: 'Sistema Hidráulico B',
      designer: 'Ing. Ana Torres',
      sharedDate: '18 Nov 2025',
      status: 'approved',
      hasComments: false,
      commentCount: 0,
    },
  ];

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

  const handleSendComment = () => {
    if (!commentText.trim()) {
      Alert.alert('Atención', 'Por favor escribe un comentario');
      return;
    }
    Alert.alert('Comentario enviado', 'Tu comentario ha sido enviado al diseñador');
    setCommentText('');
  };

  // Renderizado de contenido según tab
  const renderContent = () => {
    switch (selectedTab) {
      case 'projects':
        return renderProjects();
      case 'ar':
        return renderARViewer();
      case 'comments':
        return renderComments();
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
                <Text style={styles.actionButtonSmallText}>Ver en AR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButtonSmall}
                onPress={() => setSelectedTab('comments')}
              >
                <Text style={styles.actionButtonSmallText}>Comentarios</Text>
              </TouchableOpacity>
            </View>
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

  const renderComments = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Comentarios - Motor Industrial V3</Text>

      {/* Lista de comentarios */}
      <View style={styles.commentsList}>
        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <View style={styles.commentAvatar}>
              <Ionicons name="person" size={20} color={Colors.base.whitePrimary} />
            </View>
            <View style={styles.commentHeaderInfo}>
              <Text style={styles.commentAuthor}>Ing. Carlos Méndez</Text>
              <Text style={styles.commentDate}>18 Nov 2025, 10:30 AM</Text>
            </View>
          </View>
          <Text style={styles.commentText}>
            He actualizado el diseño según tus comentarios. Por favor revisa la nueva versión.
          </Text>
        </View>

        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <View style={styles.commentAvatar}>
              <Ionicons name="person" size={20} color={Colors.base.whitePrimary} />
            </View>
            <View style={styles.commentHeaderInfo}>
              <Text style={styles.commentAuthor}>Tú</Text>
              <Text style={styles.commentDate}>17 Nov 2025, 3:45 PM</Text>
            </View>
          </View>
          <Text style={styles.commentText}>
            Me gustaría revisar las dimensiones del eje principal. ¿Podemos agendar una reunión?
          </Text>
        </View>

        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <View style={styles.commentAvatar}>
              <Ionicons name="person" size={20} color={Colors.base.whitePrimary} />
            </View>
            <View style={styles.commentHeaderInfo}>
              <Text style={styles.commentAuthor}>Ing. Carlos Méndez</Text>
              <Text style={styles.commentDate}>17 Nov 2025, 9:00 AM</Text>
            </View>
          </View>
          <Text style={styles.commentText}>
            Proyecto compartido. Puedes revisarlo en el visor AR y dejar tus comentarios.
          </Text>
        </View>
      </View>

      {/* Input de comentario */}
      <View style={styles.commentInputSection}>
        <Text style={styles.commentInputTitle}>Agregar comentario</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Escribe tu comentario aquí..."
          placeholderTextColor={Colors.grays.dark}
          multiline
          numberOfLines={4}
          value={commentText}
          onChangeText={setCommentText}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={styles.sendCommentButton}
          onPress={handleSendComment}
        >
          <Ionicons name="send" size={18} color={Colors.base.whitePrimary} />
          <Text style={styles.sendCommentButtonText}>Enviar comentario</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );

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
          <Text style={styles.headerTitle}>Módulo Cliente</Text>
          <Text style={styles.headerSubtitle}>Validación de diseños en AR</Text>
        </View>
      </View>

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
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'comments' && styles.tabActive]}
          onPress={() => setSelectedTab('comments')}
        >
          <Text style={[styles.tabText, selectedTab === 'comments' && styles.tabTextActive]}>
            Comentarios
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
  projectsList: {
    gap: 16,
    marginBottom: 24,
  },
  projectCard: {
    backgroundColor: Colors.grays.dark,
    borderRadius: 16,
    padding: 20,
  },
  projectIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.base.whitePrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  projectInfo: {
    marginBottom: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  projectDesigner: {
    fontSize: 13,
    color: Colors.grays.light,
    marginBottom: 2,
  },
  projectDate: {
    fontSize: 12,
    color: Colors.grays.light,
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
    color: Colors.base.blackPrimary,
  },
  projectActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonSmall: {
    flex: 1,
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonSmallText: {
    fontSize: 13,
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
});