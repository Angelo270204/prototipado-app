/**
 * Button Component - Atomic Design
 * Botón base del sistema de diseño DTP-AR
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, ComponentSizes, BorderRadius } from '@/constants/DesignSystem';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: ComponentSizes.button.height,
      minWidth: ComponentSizes.button.minWidth,
      paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 32 : 24,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.text.disabled : Colors.success,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.background.cardDark : Colors.background.cardDark,
          borderWidth: 1,
          borderColor: disabled ? Colors.text.disabled : Colors.text.secondary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.text.disabled : Colors.error,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? Typography.sizes.bodySmall : Typography.sizes.body,
      fontWeight: Typography.weights.semibold,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: Colors.background.darker,
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: Colors.text.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: disabled ? Colors.text.disabled : Colors.text.primary,
        };
      case 'danger':
        return {
          ...baseStyle,
          color: Colors.text.primary,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.background.darker : Colors.text.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
