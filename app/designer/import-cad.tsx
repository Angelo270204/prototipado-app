import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/DesignSystem';
import * as DocumentPicker from 'expo-document-picker';

export default function ImportCADScreen() {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    uri: string;
  } | null>(null);

  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [processingOptions, setProcessingOptions] = useState({
    detectCollisions: false,
    generateBOM: false,
    createAssemblyGuides: false,
  });

  const supportedFormats = [
    'SLDPRT',
    'DWG',
    'STEP',
    'STL',
    'IGES',
    'OBJ',
  ];

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/octet-stream',
          'application/sla',
          'model/stl',
          'application/step',
          'application/iges',
          'model/obj',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          name: file.name,
          size: file.size || 0,
          uri: file.uri,
        });
      }
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  const toggleOption = (option: keyof typeof processingOptions) => {
    setProcessingOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleContinue = () => {
    if (!selectedFile) {
      Alert.alert('Atención', 'Por favor selecciona un archivo CAD');
      return;
    }

    Alert.alert(
      'Archivo importado',
      `Archivo: ${selectedFile.name}\nFormatos seleccionados: ${selectedFormats.join(', ') || 'Ninguno'}`,
      [
        {
          text: 'Continuar',
          onPress: () => {
            router.push('/designer/new-project');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.base.whitePrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Módulo Diseñador</Text>
          <Text style={styles.headerSubtitle}>Gestión de proyectos CAD y AR</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/designer/projects')}
        >
          <Text style={styles.tabText}>Proyectos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Importar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/designer/ar-viewer')}
        >
          <Text style={styles.tabText}>Visor AR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Título de la sección */}
        <Text style={styles.sectionTitle}>Importar Archivo CAD</Text>

        {/* Área de selección de archivo */}
        <View style={styles.fileUploadArea}>
          <Ionicons
            name="document-text-outline"
            size={48}
            color={Colors.base.whitePrimary}
            style={styles.fileIcon}
          />
          <Text style={styles.fileUploadTitle}>Arrastra tu archivo CAD</Text>
          <Text style={styles.fileUploadSubtitle}>
            Formatos: .dwg, .shl, .obj, .step
          </Text>
          <TouchableOpacity
            style={styles.selectFileButton}
            onPress={handleSelectFile}
          >
            <Text style={styles.selectFileButtonText}>SELECCIONAR ARCHIVO</Text>
          </TouchableOpacity>
          {selectedFile && (
            <View style={styles.selectedFileInfo}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.functional.success} />
              <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
            </View>
          )}
        </View>

        {/* Formatos Soportados */}
        <View style={styles.formatsSection}>
          <Text style={styles.formatsSectionTitle}>Formatos Soportados</Text>
          <View style={styles.formatsGrid}>
            {supportedFormats.map((format) => (
              <TouchableOpacity
                key={format}
                style={[
                  styles.formatButton,
                  selectedFormats.includes(format) && styles.formatButtonActive,
                ]}
                onPress={() => toggleFormat(format)}
              >
                <Text
                  style={[
                    styles.formatButtonText,
                    selectedFormats.includes(format) && styles.formatButtonTextActive,
                  ]}
                >
                  {format}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Opciones de Procesamiento */}
        <View style={styles.optionsSection}>
          <Text style={styles.optionsSectionTitle}>Opciones de Procesamiento</Text>
          
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => toggleOption('detectCollisions')}
          >
            <View style={styles.checkbox}>
              {processingOptions.detectCollisions && (
                <Ionicons name="checkmark" size={16} color={Colors.base.blackPrimary} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Detectar colisiones automáticamente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => toggleOption('generateBOM')}
          >
            <View style={styles.checkbox}>
              {processingOptions.generateBOM && (
                <Ionicons name="checkmark" size={16} color={Colors.base.blackPrimary} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Generar BOM (Bill of Materials)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => toggleOption('createAssemblyGuides')}
          >
            <View style={styles.checkbox}>
              {processingOptions.createAssemblyGuides && (
                <Ionicons name="checkmark" size={16} color={Colors.base.blackPrimary} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Crear guías de ensamblaje</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Siguiente */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
  },
  header: {
    backgroundColor: Colors.base.blackPrimary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
    fontStyle: 'italic',
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.grays.light,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.base.blackPrimary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.grays.dark,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.base.blackPrimary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.base.blackPrimary,
    marginBottom: 20,
  },
  fileUploadArea: {
    backgroundColor: Colors.grays.dark,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  fileIcon: {
    marginBottom: 16,
  },
  fileUploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
    marginBottom: 8,
  },
  fileUploadSubtitle: {
    fontSize: 12,
    color: Colors.grays.light,
    marginBottom: 20,
  },
  selectFileButton: {
    backgroundColor: Colors.base.whitePrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectFileButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    letterSpacing: 0.5,
  },
  selectedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  selectedFileName: {
    fontSize: 13,
    color: Colors.functional.success,
    fontWeight: '600',
  },
  formatsSection: {
    backgroundColor: Colors.grays.dark,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  formatsSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  formatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  formatButton: {
    backgroundColor: Colors.base.blackPrimary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  formatButtonActive: {
    backgroundColor: Colors.base.whitePrimary,
  },
  formatButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  formatButtonTextActive: {
    color: Colors.base.blackPrimary,
  },
  optionsSection: {
    marginBottom: 32,
  },
  optionsSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.base.blackPrimary,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.grays.medium,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.base.whitePrimary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.base.blackPrimary,
    flex: 1,
  },
  continueButton: {
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
});