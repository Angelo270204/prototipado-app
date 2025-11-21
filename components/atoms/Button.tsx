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
import { Colors, Typography, ComponentSizes, BorderRadius, Shadows } from '@/constants/DesignSystem';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
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
    const height = size === 'small' ? ComponentSizes.button.small : 
                   size === 'large' ? ComponentSizes.button.large : 
                   ComponentSizes.button.medium;

    const baseStyle: ViewStyle = {
      height,
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
          backgroundColor: disabled ? Colors.text.disabled : Colors.primary.main,
          ...(!disabled && Shadows.small),
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: Colors.background.secondary,
          borderWidth: 1,
          borderColor: disabled ? Colors.text.disabled : Colors.background.border,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.text.disabled : Colors.error.main,
          ...(!disabled && Shadows.small),
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.text.disabled : Colors.success.main,
          ...(!disabled && Shadows.small),
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
          color: Colors.primary.contrast,
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: disabled ? Colors.text.disabled : Colors.text.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: disabled ? Colors.text.disabled : Colors.primary.main,
        };
      case 'danger':
        return {
          ...baseStyle,
          color: Colors.primary.contrast,
        };
      case 'success':
        return {
          ...baseStyle,
          color: Colors.primary.contrast,
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
          color={variant === 'primary' || variant === 'danger' || variant === 'success' 
            ? Colors.primary.contrast 
            : Colors.text.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});