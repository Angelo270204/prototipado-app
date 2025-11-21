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
  | 'validation';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, style }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
      case 'completed':
        return Colors.success;
      case 'error':
        return Colors.error;
      case 'warning':
      case 'validation':
        return Colors.warning;
      case 'info':
      case 'in_progress':
        return Colors.focus;
      case 'pending':
      default:
        return Colors.text.secondary;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }, style]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.background.darker,
  },
});
