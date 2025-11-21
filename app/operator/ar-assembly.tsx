/**
 * Operator AR Assembly View
 * Vista de Realidad Aumentada para guía de ensamblaje de operadores
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/DesignSystem';
import ARViewer from '@/components/ar/ARViewer';
import { Ionicons } from '@expo/vector-icons';

export default function OperatorARAssemblyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [captureCount, setCaptureCount] = useState(0);

  const stepNumber = params.step as string || '1';
  const workOrderCode = params.workOrderCode as string || 'WO-0001';
  const modelName = `Paso ${stepNumber} - ${workOrderCode}`;

  const handleClose = () => {
    router.back();
  };

  const handleCapture = () => {
    setCaptureCount(prev => prev + 1);
    Alert.alert(
      'Evidencia Capturada',
      `Se ha guardado la evidencia del paso ${stepNumber}. Total de capturas: ${captureCount + 1}`,
      [{ text: 'OK' }]
    );
  };

  const handleMeasure = () => {
    Alert.alert(
      'Verificación de Medidas',
      'Usa las medidas para verificar que el ensamblaje cumple con las especificaciones',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <View style={styles.container}>
      <ARViewer
        modelName={modelName}
        onClose={handleClose}
        onCapture={handleCapture}
        onMeasure={handleMeasure}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});