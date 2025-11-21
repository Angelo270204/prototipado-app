/**
 * StatusBadge Component - Atomic Design
 * Badge de estado reutilizable para proyectos y órdenes
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';

type StatusType = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'pending' 
  | 'in_progress' 
  | 'completed'
  | 'validation'
  | 'review'
  | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, style }) => {
  const getStatusColors = () => {
    switch (status) {
      case 'success':
      case 'completed':
        return {
          backgroundColor: Colors.success.background,
          color: Colors.success.dark,
        };
      case 'error':
        return {
          backgroundColor: Colors.error.background,
          color: Colors.error.dark,
        };
      case 'warning':
      case 'validation':
      case 'pending':
        return {
          backgroundColor: Colors.warning.background,
          color: Colors.warning.dark,
        };
      case 'info':
      case 'in_progress':
        return {
          backgroundColor: Colors.info.background,
          color: Colors.info.dark,
        };
      case 'review':
        return {
          backgroundColor: '#EDE9FE',
          color: '#6B21A8',
        };
      case 'cancelled':
        return {
          backgroundColor: Colors.background.tertiary,
          color: Colors.text.secondary,
        };
      default:
        return {
          backgroundColor: Colors.background.tertiary,
          color: Colors.text.secondary,
        };
    }
  };

  const colors = getStatusColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.backgroundColor }, style]}>
      <Text style={[styles.label, { color: colors.color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
});