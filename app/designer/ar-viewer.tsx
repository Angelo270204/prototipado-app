/**
 * Designer AR Viewer
 * Visor de Realidad Aumentada para diseñadores
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/DesignSystem';
import ARViewer from '@/components/ar/ARViewer';
import { Ionicons } from '@expo/vector-icons';

export default function DesignerARViewerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [captureCount, setCaptureCount] = useState(0);

  const modelName = params.modelName as string || 'Modelo CAD 3D';

  const handleClose = () => {
    router.back();
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