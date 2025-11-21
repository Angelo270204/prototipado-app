/**
 * Client AR View
 * Vista de Realidad Aumentada para clientes
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

export default function ClientARViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [captureCount, setCaptureCount] = useState(0);

  const modelName = params.modelName as string || 'Proyecto CAD';

  const handleClose = () => {
    router.back();
  };

  const handleCapture = () => {
    setCaptureCount(prev => prev + 1);
    Alert.alert(
      'Captura Guardada',
      `Se ha guardado la captura #${captureCount + 1}. Puedes adjuntarla en tus comentarios.`,
      [{ text: 'OK' }]
    );
  };

  const handleMeasure = () => {
    Alert.alert(
      'Mediciones Habilitadas',
      'Ahora puedes ver las medidas del proyecto para validar dimensiones',
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