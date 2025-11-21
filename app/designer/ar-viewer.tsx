/**
 * Designer AR Viewer
 * Visor de Realidad Aumentada mejorado para diseñadores
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/DesignSystem';
import ARViewer from '@/components/ar/ARViewer';

export default function ARViewerScreen() {
  const [selectedModel, setSelectedModel] = useState<string>('SLDPRT');
  const [isARActive, setIsARActive] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  
  const validations = {
    scale: { valid: true, message: '1:1 - Dimensiones correctas' },
    collisions: { valid: true, message: 'Todos los componentes alineados' },
    space: { valid: false, message: 'Se requieren 5m² adicionales' },
  };

  const modelTypes = ['SLDPRT', 'Escalar', 'Medir'];

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

  const handleShare = () => {
    Alert.alert(
      'Compartir',
      '¿Deseas compartir este modelo AR con el equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartir', onPress: () => {} },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.base.blackPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Módulo Diseñador</Text>
          <Text style={styles.headerSubtitle}>Gestión de proyectos CAD y AR</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/designer/projects')}
        >
          <Text style={styles.tabText}>Proyectos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/designer/import-cad')}
        >
          <Text style={styles.tabText}>Importar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Visor AR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Título */}
        <Text style={styles.sectionTitle}>Visor AR - Motor Industrial V3</Text>

        {/* Visor AR Principal */}
        <View style={styles.arViewerContainer}>
          {/* AR View Simulation */}
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

          {/* Escala validada */}
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

          {/* Sin colisiones */}
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

          {/* Espacio insuficiente */}
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
            onPress={handleShare}
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
      </ScrollView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
  },
  header: {
    backgroundColor: Colors.base.whitePrimary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    borderBottomWidth: 2,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.base.blackPrimary,
    marginBottom: 20,
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
});