/**
 * Nuevo Proyecto
 * Formulario para crear nuevos proyectos de diseño
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { Button } from '@/components/atoms/Button';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';

export default function NewProjectScreen() {
  const router = useRouter();
  const { addAndShareProject } = useApp();
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    description: '',
    parts: '10',
  });

  const handleSubmit = () => {
    if (!formData.projectName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del proyecto');
      return;
    }
    if (!formData.clientName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del cliente');
      return;
    }

    const today = new Date();
    const newProject = {
      name: formData.projectName.trim(),
      client: formData.clientName.trim(),
      status: 'pending' as const,
      progress: 0,
      thumbnail: '',
      createdAt: today.toISOString().split('T')[0],
      updatedAt: today.toISOString().split('T')[0],
      parts: parseInt(formData.parts) || 10,
      validationRequired: true,
    };

    // Crear y compartir automáticamente con los 4 roles
    addAndShareProject(newProject, { shareWithRoles: ['designer', 'client', 'operator', 'production'], createChat: true, notify: true });

    // Limpiar formulario
    setFormData({
      projectName: '',
      clientName: '',
      description: '',
      parts: '10',
    });

    // Mostrar mensaje de éxito y volver a la lista
    Alert.alert(
      '✅ Proyecto Creado Exitosamente',
      `"${formData.projectName}" ha sido creado y compartido con el equipo (Cliente, Operador, Producción).`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ],
      { cancelable: false }
    );

    // Navegar automáticamente después de un momento
    setTimeout(() => {
      router.back();
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.base.blackPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Proyecto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Project Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Nombre del Proyecto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Estructura Metálica Principal"
            placeholderTextColor={Colors.text.tertiary}
            value={formData.projectName}
            onChangeText={(text) => setFormData({ ...formData, projectName: text })}
          />
        </View>

        {/* Client Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Cliente *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Empresa ABC S.A."
            placeholderTextColor={Colors.text.tertiary}
            value={formData.clientName}
            onChangeText={(text) => setFormData({ ...formData, clientName: text })}
          />
        </View>

        {/* Number of Parts */}
        <View style={styles.section}>
          <Text style={styles.label}>Número de Piezas</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 10"
            placeholderTextColor={Colors.text.tertiary}
            value={formData.parts}
            onChangeText={(text) => setFormData({ ...formData, parts: text })}
            keyboardType="numeric"
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            El proyecto será creado en estado Pendiente y requerirá validación en AR antes de iniciar producción.
          </Text>
        </View>

        {/* Submit Button */}
        <Button
          title="Crear Proyecto"
          onPress={handleSubmit}
          variant="primary"
          fullWidth
          style={styles.submitButton}
        />

        <Button
          title="Cancelar"
          onPress={() => router.back()}
          variant="secondary"
          fullWidth
          style={styles.cancelButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
    backgroundColor: Colors.base.whitePrimary,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.background.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.border,
  },
  optionCardActive: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.selected,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  optionLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  optionLabelActive: {
    color: Colors.primary.main,
    fontWeight: Typography.weights.semibold,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  priorityChip: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.background.border,
  },
  priorityIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  priorityLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  priorityLabelActive: {
    color: Colors.background.secondary,
    fontWeight: Typography.weights.semibold,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.bodySmall,
    color: '#1E40AF',
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: Spacing.md,
  },
  cancelButton: {
    marginBottom: Spacing.md,
  },
});