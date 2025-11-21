/**
 * QR Scanner Screen
 * Escáner de códigos QR para órdenes de trabajo - Simulado
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Códigos QR de ejemplo para simular
const MOCK_QR_CODES = [
  { code: 'WO-HSE2024-001', name: 'Estructura de Soporte HSE-2024' },
  { code: 'WO-CHUTE-002', name: 'Prototipo Chute Transferencia' },
  { code: 'WO-TOLVA-003', name: 'Tolva Almacenamiento 500L' },
  { code: 'WO-MARCO-004', name: 'Marco Estructura Principal' },
];

export default function QRScannerScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const scanLineAnim = new Animated.Value(0);

  useEffect(() => {
    // Animación de línea de escaneo
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    if (isScanning) {
      animation.start();
    } else {
      animation.stop();
    }

    return () => animation.stop();
  }, [isScanning]);

  const handleSimulateScan = () => {
    // Simular escaneo de un código QR aleatorio
    const randomCode = MOCK_QR_CODES[Math.floor(Math.random() * MOCK_QR_CODES.length)];
    setScannedCode(randomCode.code);
    setIsScanning(false);

    // Esperar 1 segundo y navegar a la guía de ensamblaje
    setTimeout(() => {
      router.push({
        pathname: '/operator/assembly-guide',
        params: { workOrderCode: randomCode.code },
      });
    }, 1500);
  };

  const handleManualEntry = () => {
    router.push({
      pathname: '/operator/work-orders',
    });
  };

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear Código QR</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Scanner View */}
      <View style={styles.scannerContainer}>
        {/* Camera Simulation */}
        <View style={styles.cameraView}>
          {/* Scanner Frame */}
          <View style={styles.scannerFrame}>
            {/* Corner Markers */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Scanning Line */}
            {isScanning && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanLineTranslateY }],
                  },
                ]}
              />
            )}

            {/* Scanned Code Display */}
            {scannedCode && (
              <View style={styles.scannedCodeContainer}>
                <Ionicons name="checkmark-circle" size={48} color={Colors.success.main} />
                <Text style={styles.scannedCodeText}>{scannedCode}</Text>
                <Text style={styles.scannedCodeSubtext}>Código detectado</Text>
              </View>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Ionicons name="qr-code-outline" size={32} color={Colors.primary.contrast} />
            <Text style={styles.instructionsText}>
              {isScanning 
                ? 'Apunta la cámara al código QR de la orden de trabajo'
                : 'Cargando orden de trabajo...'}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {/* Simulate Scan Button (For Demo) */}
        {isScanning && (
          <TouchableOpacity
            style={styles.simulateButton}
            onPress={handleSimulateScan}
          >
            <Ionicons name="scan" size={24} color={Colors.primary.contrast} />
            <Text style={styles.simulateButtonText}>Simular Escaneo</Text>
          </TouchableOpacity>
        )}

        {/* Manual Entry Button */}
        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualEntry}
        >
          <Ionicons name="keypad-outline" size={20} color={Colors.primary.main} />
          <Text style={styles.manualButtonText}>Ingresar código manualmente</Text>
        </TouchableOpacity>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.info.main} />
          <Text style={styles.infoText}>
            Cada orden de trabajo tiene un código QR único para acceso rápido
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    ...Shadows.small,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  placeholder: {
    width: 44,
  },
  scannerContainer: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.primary.main,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.primary.main,
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  scannedCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary + 'EE',
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  scannedCodeText: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginTop: Spacing.md,
  },
  scannedCodeSubtext: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  instructionsText: {
    fontSize: Typography.sizes.body,
    color: Colors.primary.contrast,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: Typography.sizes.body * Typography.lineHeight.relaxed,
  },
  bottomActions: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.medium,
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  simulateButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary.contrast,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.background.border,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  manualButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.primary.main,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.info.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    lineHeight: Typography.sizes.bodySmall * Typography.lineHeight.normal,
  },
});