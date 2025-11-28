/**
 * Report Issue Screen
 * Pantalla para reportar problemas o incidencias durante el ensamblaje
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Button } from '@/components/atoms/Button';
import { Ionicons } from '@expo/vector-icons';

type IssueType = 'quality' | 'safety' | 'material' | 'equipment' | 'other';

export default function ReportIssueScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const [selectedType, setSelectedType] = useState<IssueType | null>(null);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const issueTypes: { type: IssueType; label: string; icon: string; color: string }[] = [
    { type: 'quality', label: 'Problema de Calidad', icon: 'checkmark-circle-outline', color: Colors.warning.main },
    { type: 'safety', label: 'Riesgo de Seguridad', icon: 'alert-circle-outline', color: Colors.error.main },
    { type: 'material', label: 'Material Faltante', icon: 'cube-outline', color: Colors.info.main },
    { type: 'equipment', label: 'Equipo Dañado', icon: 'build-outline', color: Colors.warning.main },
    { type: 'other', label: 'Otro Problema', icon: 'help-circle-outline', color: Colors.text.secondary },
  ];

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Error', 'Por favor selecciona un tipo de problema');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Por favor describe el problema');
      return;
    }

    Alert.alert(
      'Reporte Enviado',
      `Tu reporte ha sido enviado exitosamente al supervisor.\n\nTipo: ${issueTypes.find(t => t.type === selectedType)?.label}\nPrioridad: ${priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportar Problema</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.info.main} />
          <Text style={styles.infoBannerText}>
            Reporta cualquier problema que encuentres durante tu trabajo. Tu supervisor será notificado inmediatamente.
          </Text>
        </View>

        {/* Issue Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Problema *</Text>
          <View style={styles.issueTypesContainer}>
            {issueTypes.map((issue) => (
              <TouchableOpacity
                key={issue.type}
                style={[
                  styles.issueTypeCard,
                  selectedType === issue.type && styles.issueTypeCardSelected,
                ]}
                onPress={() => setSelectedType(issue.type)}
              >
                <Ionicons
                  name={issue.icon as any}
                  size={32}
                  color={selectedType === issue.type ? Colors.primary.main : issue.color}
                />
                <Text
                  style={[
                    styles.issueTypeLabel,
                    selectedType === issue.type && styles.issueTypeLabelSelected,
                  ]}
                >
                  {issue.label}
                </Text>
                {selectedType === issue.type && (
                  <View style={styles.selectedCheck}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary.main} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prioridad *</Text>
          <View style={styles.priorityContainer}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'low' && styles.priorityButtonSelected,
                { borderColor: Colors.success.main },
              ]}
              onPress={() => setPriority('low')}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === 'low' && styles.priorityTextSelected,
                  { color: priority === 'low' ? Colors.base.whitePrimary : Colors.success.main },
                ]}
              >
                Baja
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'medium' && styles.priorityButtonSelected,
                { borderColor: Colors.warning.main },
              ]}
              onPress={() => setPriority('medium')}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === 'medium' && styles.priorityTextSelected,
                  { color: priority === 'medium' ? Colors.base.whitePrimary : Colors.warning.main },
                ]}
              >
                Media
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'high' && styles.priorityButtonSelected,
                { borderColor: Colors.error.main },
              ]}
              onPress={() => setPriority('high')}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === 'high' && styles.priorityTextSelected,
                  { color: priority === 'high' ? Colors.base.whitePrimary : Colors.error.main },
                ]}
              >
                Alta
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción del Problema *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe el problema con el mayor detalle posible..."
            placeholderTextColor={Colors.text.tertiary}
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          <Text style={styles.helperText}>
            Incluye detalles como: qué paso estabas realizando, qué esperabas que sucediera, y qué sucedió en su lugar.
          </Text>
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Orden de Trabajo:</Text>
              <Text style={styles.infoValue}>{orderId || 'No especificada'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha:</Text>
              <Text style={styles.infoValue}>{new Date().toLocaleDateString('es-ES')}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hora:</Text>
              <Text style={styles.infoValue}>{new Date().toLocaleTimeString('es-ES')}</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <Button
          title="Enviar Reporte"
          onPress={handleSubmit}
          variant="primary"
          fullWidth
          style={styles.submitButton}
        />

        {/* Cancel Button */}
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
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.info.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info.main,
  },
  infoBannerText: {
    flex: 1,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.info.main,
    marginLeft: Spacing.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.sizes.bodySmall,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  issueTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  issueTypeCard: {
    width: '48%',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.border,
    minHeight: 120,
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.small,
  },
  issueTypeCardSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light + '20',
  },
  issueTypeLabel: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontWeight: Typography.weights.medium,
  },
  issueTypeLabelSelected: {
    color: Colors.primary.main,
    fontWeight: Typography.weights.bold,
  },
  selectedCheck: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
  },
  priorityButtonSelected: {
    backgroundColor: Colors.base.blackPrimary,
  },
  priorityText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },
  priorityTextSelected: {
    color: Colors.base.whitePrimary,
  },
  textArea: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.background.border,
    minHeight: 140,
  },
  helperText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.tertiary,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },
  infoLabel: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  submitButton: {
    marginBottom: Spacing.sm,
  },
  cancelButton: {
    marginBottom: Spacing.lg,
  },
});

