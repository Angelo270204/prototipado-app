/**
 * Floating Action Button (FAB)
 * Componente para la Variante B del experimento A/B de botón QR
 * 
 * Características:
 * - Botón circular flotante en esquina inferior derecha
 * - Tamaño optimizado para el pulgar (64x64px)
 * - Color verde éxito para acción principal
 * - Elevación alta (shadow)
 * - Icono QR centrado
 * - Animación de pulso opcional
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@/constants/DesignSystem';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  iconColor?: string;
  size?: number;
  iconSize?: number;
  bottom?: number;
  right?: number;
  testID?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'qr-code-outline',
  color = Colors.functional.success,
  iconColor = Colors.base.whitePrimary,
  size = 64,
  iconSize = 28,
  bottom = 90,
  right = 20,
  testID = 'fab-button',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fab,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          bottom,
          right,
        },
      ]}
      activeOpacity={0.8}
      testID={testID}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra elevada para efecto flotante
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
    // Borde sutil para mejor definición
    borderWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default FloatingActionButton;