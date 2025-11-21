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
          backgroundColor: Colors.functional.success,
          color: Colors.base.blackPrimary,
        };
      case 'error':
        return {
          backgroundColor: Colors.functional.error,
          color: Colors.base.whitePrimary,
        };
      case 'warning':
        return {
          backgroundColor: Colors.functional.warning,
          color: Colors.base.blackPrimary,
        };
      case 'validation':
        return {
          backgroundColor: Colors.warning.main,
          color: Colors.base.blackPrimary,
        };
      case 'pending':
        return {
          backgroundColor: Colors.functional.warning,
          color: Colors.base.blackPrimary,
        };
      case 'info':
        return {
          backgroundColor: Colors.functional.info,
          color: Colors.base.whitePrimary,
        };
      case 'in_progress':
        return {
          backgroundColor: Colors.functional.info,
          color: Colors.base.whitePrimary,
        };
      case 'review':
        return {
          backgroundColor: Colors.functional.info,
          color: Colors.base.whitePrimary,
        };
      case 'cancelled':
        return {
          backgroundColor: Colors.grays.dark,
          color: Colors.base.whitePrimary,
        };
      default:
        return {
          backgroundColor: Colors.grays.medium,
          color: Colors.base.blackPrimary,
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