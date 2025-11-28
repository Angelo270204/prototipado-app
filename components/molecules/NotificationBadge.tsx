/**
 * Notification Badge Component
 * Icono con badge de notificaciones no leídas
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/DesignSystem';

interface NotificationBadgeProps {
  count: number;
  onPress: () => void;
  size?: number;
  color?: string;
}

export default function NotificationBadge({
  count,
  onPress,
  size = 24,
  color = Colors.base.blackPrimary
}: NotificationBadgeProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons name="notifications-outline" size={size} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3B30', // Rojo vibrante
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: Colors.base.whitePrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  badgeText: {
    color: Colors.base.whitePrimary,
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 14,
  },
});

