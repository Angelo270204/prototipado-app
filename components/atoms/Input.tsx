/**
 * Input Component - Atomic Design
 * Input accesible del sistema de diseño DTP-AR
 */

import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Colors, Typography, ComponentSizes, BorderRadius, Spacing } from '@/constants/DesignSystem';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  helperText,
  containerStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return Colors.error.main;
    if (success) return Colors.success.main;
    if (isFocused) return Colors.functional.info;
    return Colors.grays.medium;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          { borderColor: getBorderColor() },
          error && styles.inputError,
        ]}
        placeholderTextColor={Colors.text.disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!error && helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  input: {
    height: ComponentSizes.input.medium,
    backgroundColor: Colors.base.whitePrimary,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.sizes.body,
    color: Colors.base.blackPrimary,
  },
  inputError: {
    borderColor: Colors.error.main,
  },
  errorText: {
    fontSize: Typography.sizes.caption,
    color: Colors.error.main,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
});
