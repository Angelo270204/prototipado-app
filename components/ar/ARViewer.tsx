/**
 * ARViewer Component - Simulación de Visor AR
 * Componente que simula la visualización de modelos 3D en Realidad Aumentada
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';

type ARViewerProps = {
  modelName?: string;
  onClose?: () => void;
  onCapture?: () => void;
  onMeasure?: () => void;
};

const { width, height } = Dimensions.get('window');

export default function ARViewer({
  modelName = 'Modelo 3D',
  onClose,
  onCapture,
  onMeasure,
}: ARViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 45);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 45);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <View style={styles.container}>
      {/* AR Camera View Simulation */}
      <View style={styles.cameraView}>
        {/* Grid Overlay */}
        {showGrid && (
          <View style={styles.gridOverlay}>
            {[...Array(8)].map((_, i) => (
              <View key={`h-${i}`} style={styles.gridLineHorizontal} />
            ))}
            {[...Array(8)].map((_, i) => (
              <View key={`v-${i}`} style={styles.gridLineVertical} />
            ))}
          </View>
        )}

        {/* 3D Model Placeholder */}
        <View style={styles.modelContainer}>
          <Animated.View
            style={[
              styles.model,
              {
                transform: [
                  { scale },
                  { rotateY: `${rotation}deg` },
                ],
              },
            ]}
          >
            <View style={styles.modelPlaceholder}>
              <Ionicons name="cube-outline" size={120} color={Colors.primary.main} />
              <Text style={styles.modelName}>{modelName}</Text>
            </View>
          </Animated.View>
        </View>

        {/* Measurements Overlay */}
        {showMeasurements && (
          <View style={styles.measurementsOverlay}>
            <View style={styles.measurementLine} />
            <View style={styles.measurementLabel}>
              <Text style={styles.measurementText}>2.5m</Text>
            </View>
            <View style={[styles.measurementLine, styles.measurementLineVertical]} />
            <View style={[styles.measurementLabel, styles.measurementLabelVertical]}>
              <Text style={styles.measurementText}>1.8m</Text>
            </View>
          </View>
        )}

        {/* AR Indicators */}
        <View style={styles.arIndicators}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.topInfo}>
            <View style={styles.arBadge}>
              <Ionicons name="scan-outline" size={16} color={Colors.success.main} />
              <Text style={styles.arBadgeText}>AR Activo</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.topButton}
            onPress={() => setFlashEnabled(!flashEnabled)}
          >
            <Ionicons 
              name={flashEnabled ? "flash" : "flash-off"} 
              size={24} 
              color={flashEnabled ? Colors.warning.main : Colors.text.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Main Actions */}
          <View style={styles.mainActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleRotateLeft}>
              <Ionicons name="refresh-outline" size={24} color={Colors.primary.contrast} />
              <Text style={styles.actionButtonText}>Rotar Izq</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.captureButton]} 
              onPress={onCapture}
            >
              <View style={styles.captureButtonInner}>
                <Ionicons name="camera-outline" size={32} color={Colors.primary.contrast} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleRotateRight}>
              <Ionicons 
                name="refresh-outline" 
                size={24} 
                color={Colors.primary.contrast}
                style={{ transform: [{ scaleX: -1 }] }}
              />
              <Text style={styles.actionButtonText}>Rotar Der</Text>
            </TouchableOpacity>
          </View>

          {/* Secondary Controls */}
          <View style={styles.secondaryControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleZoomOut}
            >
              <Ionicons name="remove-circle-outline" size={28} color={Colors.background.secondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, showGrid && styles.controlButtonActive]}
              onPress={() => setShowGrid(!showGrid)}
            >
              <Ionicons name="grid-outline" size={28} color={Colors.background.secondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, showMeasurements && styles.controlButtonActive]}
              onPress={() => {
                setShowMeasurements(!showMeasurements);
                onMeasure?.();
              }}
            >
              <Ionicons name="resize-outline" size={28} color={Colors.background.secondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleReset}
            >
              <Ionicons name="reload-circle-outline" size={28} color={Colors.background.secondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleZoomIn}
            >
              <Ionicons name="add-circle-outline" size={28} color={Colors.background.secondary} />
            </TouchableOpacity>
          </View>

          {/* Info Bar */}
          <View style={styles.infoBar}>
            <View style={styles.infoItem}>
              <Ionicons name="expand-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>Escala: {scale.toFixed(1)}x</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="sync-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>Rotación: {rotation}°</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraView: {
    flex: 1,
    position: 'relative',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridLineHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: Colors.primary.main + '30',
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.primary.main + '30',
  },
  modelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  model: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background.secondary + 'DD',
    borderRadius: BorderRadius.xl,
    ...Shadows.large,
  },
  modelName: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  measurementsOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  measurementLine: {
    position: 'absolute',
    width: 200,
    height: 2,
    backgroundColor: Colors.warning.main,
    top: '40%',
  },
  measurementLabel: {
    position: 'absolute',
    top: '38%',
    backgroundColor: Colors.warning.main,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  measurementLineVertical: {
    width: 2,
    height: 150,
    left: '30%',
    top: '35%',
  },
  measurementLabelVertical: {
    left: '32%',
    top: '42%',
  },
  measurementText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  arIndicators: {
    ...StyleSheet.absoluteFillObject,
    padding: Spacing.xl,
  },
  cornerTL: {
    position: 'absolute',
    top: Spacing.xl,
    left: Spacing.xl,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.success.main,
  },
  cornerTR: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.xl,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.success.main,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 200,
    left: Spacing.xl,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.success.main,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 200,
    right: Spacing.xl,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.success.main,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background.secondary + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topInfo: {
    flex: 1,
    alignItems: 'center',
  },
  arBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary + 'EE',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    gap: Spacing.xs,
  },
  arBadgeText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.success.main,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  mainActions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionButtonText: {
    fontSize: Typography.sizes.caption,
    color: Colors.primary.contrast,
    fontWeight: Typography.weights.medium,
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.primary.contrast,
    ...Shadows.medium,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButtonActive: {
    backgroundColor: Colors.primary.main + 'AA',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.background.secondary + 'DD',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
});