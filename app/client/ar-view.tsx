/**
 * Client AR View Screen
 * Vista de Realidad Aumentada para validación de diseños
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/DesignSystem';

export default function ClientARViewScreen() {
  const [scale, setScale] = useState(0.5);

  const handleApprove = () => {
    Alert.alert(
      'Aprobar Proyecto',
      '¿Estás seguro de aprobar este proyecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: () => {
            Alert.alert('Proyecto Aprobado', 'El diseñador ha sido notificado');
            router.back();
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Rechazar Proyecto',
      '¿Deseas rechazar este proyecto? Podrás agregar comentarios.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Proyecto Rechazado', 'Puedes agregar comentarios para el diseñador');
          },
        },
      ]
    );
  };

  const handleRotate = () => {
    Alert.alert('Rotar Modelo', 'Usa dos dedos para rotar el modelo en AR');
  };

  const handleMeasure = () => {
    Alert.alert('Mediciones', 'Toca el modelo para ver las dimensiones');
  };

  const handleCapture = () => {
    Alert.alert('Captura', 'Foto guardada en tu galería');
  };

  const handleReset = () => {
    setScale(0.5);
    Alert.alert('Vista Restablecida', 'El modelo ha vuelto a su posición original');
  };

  const handleHelp = () => {
    Alert.alert(
      'Ayuda',
      '• Usa dos dedos para rotar\n• Pellizca para hacer zoom\n• Toca para medir\n• Mueve el dispositivo para cambiar ángulo'
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
          <Text style={styles.headerTitle}>Módulo Cliente</Text>
          <Text style={styles.headerSubtitle}>Validación de diseños en AR</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.back()}
        >
          <Text style={styles.tabText}>Proyectos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Visor AR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Comentarios</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Vista AR - Motor Industrial V3</Text>

        {/* AR Viewer Container */}
        <View style={styles.arContainer}>
          {/* Side Controls */}
          <View style={styles.sideControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleRotate}
            >
              <Ionicons name="sync-outline" size={24} color={Colors.base.blackPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleMeasure}
            >
              <Ionicons name="resize-outline" size={24} color={Colors.base.blackPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleCapture}
            >
              <Ionicons name="camera-outline" size={24} color={Colors.base.blackPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleReset}
            >
              <Ionicons name="arrow-undo-outline" size={24} color={Colors.base.blackPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleHelp}
            >
              <Ionicons name="help-circle-outline" size={24} color={Colors.base.blackPrimary} />
            </TouchableOpacity>
          </View>

          {/* AR View Area */}
          <View style={styles.arViewArea}>
            {/* AR Model Display - Using placeholder image similar to mockup */}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80' }}
              style={styles.arImage}
              resizeMode="cover"
            />

            {/* Scale Indicator - Horizontal bar at bottom */}
            <View style={styles.scaleContainer}>
              <View style={styles.scaleBar}>
                <View style={[styles.scaleBarFilled, { width: `${scale * 100}%` }]} />
                <View style={[styles.scaleMarker, { left: `${scale * 100}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Model Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información del Modelo</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dimensiones:</Text>
              <Text style={styles.infoValue}>2.5m × 1.8m × 1.2m</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Peso estimado:</Text>
              <Text style={styles.infoValue}>450 kg</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Componentes:</Text>
              <Text style={styles.infoValue}>24 piezas</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Material:</Text>
              <Text style={styles.infoValue}>Acero inoxidable</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={handleApprove}
          >
            <Ionicons name="thumbs-up" size={20} color={Colors.base.whitePrimary} />
            <Text style={styles.approveButtonText}>Aprobar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleReject}
          >
            <Ionicons name="thumbs-down" size={20} color={Colors.base.whitePrimary} />
            <Text style={styles.rejectButtonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.base.whitePrimary,
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
  content: {
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
  arContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.grays.medium,
    overflow: 'hidden',
    marginBottom: 20,
    height: 420,
  },
  sideControls: {
    width: 60,
    backgroundColor: Colors.grays.light,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.base.whitePrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arViewArea: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
    position: 'relative',
  },
  arImage: {
    width: '100%',
    height: '100%',
  },
  scaleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  scaleBar: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.grays.medium,
    borderRadius: 3,
    position: 'relative',
  },
  scaleBarFilled: {
    height: '100%',
    backgroundColor: Colors.functional.info,
    borderRadius: 3,
  },
  scaleMarker: {
    position: 'absolute',
    top: -5,
    width: 3,
    height: 16,
    backgroundColor: Colors.base.blackPrimary,
    borderRadius: 2,
    marginLeft: -1.5,
  },
  infoCard: {
    backgroundColor: Colors.grays.dark,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.grays.light,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.base.whitePrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  approveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
});