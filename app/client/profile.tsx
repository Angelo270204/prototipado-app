/**
 * Client Profile Screen
 * Pantalla de perfil del cliente - Diseño moderno
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/DesignSystem';

export default function ClientProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleEditProfile = () => {
    Alert.alert(
      'Editar Perfil',
      '¿Qué deseas editar?',
      [
        { text: 'Nombre' },
        { text: 'Email' },
        { text: 'Teléfono' },
        { text: 'Empresa' },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => router.push('/auth/login'),
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
          <Ionicons name="arrow-back" size={24} color={Colors.base.blackPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar y Nombre */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={48} color={Colors.base.whitePrimary} />
            </View>
          </View>
          <Text style={styles.userName}>Hola, Carlos Méndez</Text>
          <Text style={styles.userEmail}>carlos.mendez@empresa.com</Text>
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="call-outline" size={20} color={Colors.base.whitePrimary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>+52 999 123 4567</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="business-outline" size={20} color={Colors.base.whitePrimary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Empresa</Text>
                <Text style={styles.infoValue}>Construcciones del Sureste</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Configuración */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <View style={styles.configCard}>
            <View style={styles.configItem}>
              <View style={styles.configLeft}>
                <View style={styles.iconContainerDark}>
                  <Ionicons name="notifications-outline" size={20} color={Colors.base.whitePrimary} />
                </View>
                <Text style={styles.configLabel}>Notificaciones</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.grays.medium, true: Colors.functional.success }}
                thumbColor={Colors.base.whitePrimary}
                ios_backgroundColor={Colors.grays.medium}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.configItem}>
              <View style={styles.configLeft}>
                <View style={styles.iconContainerDark}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={Colors.base.whitePrimary} />
                </View>
                <Text style={styles.configLabel}>Privacidad</Text>
              </View>
              <Switch
                value={privacyEnabled}
                onValueChange={setPrivacyEnabled}
                trackColor={{ false: Colors.grays.medium, true: Colors.functional.success }}
                thumbColor={Colors.base.whitePrimary}
                ios_backgroundColor={Colors.grays.medium}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.configItem}>
              <View style={styles.configLeft}>
                <View style={styles.iconContainerDark}>
                  <Ionicons name="moon-outline" size={20} color={Colors.base.whitePrimary} />
                </View>
                <Text style={styles.configLabel}>Modo Oscuro</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: Colors.grays.medium, true: Colors.functional.success }}
                thumbColor={Colors.base.whitePrimary}
                ios_backgroundColor={Colors.grays.medium}
              />
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>DTP-AR v1.0.0</Text>
          <Text style={styles.versionSubtext}>© 2024 - Chimbote, Áncash</Text>
        </View>

        <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    fontStyle: 'italic',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.functional.info,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.grays.light,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.functional.info,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.grays.medium,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.base.blackPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.grays.dark,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.functional.info,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grays.light,
    marginHorizontal: 16,
  },
  configCard: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.grays.medium,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  configLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainerDark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.base.blackPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  configLabel: {
    fontSize: 14,
    color: Colors.base.blackPrimary,
    fontWeight: '500',
  },
  actionsSection: {
    marginTop: 8,
    gap: 12,
  },
  editButton: {
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  logoutButton: {
    backgroundColor: Colors.base.blackPrimary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.base.whitePrimary,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontSize: 12,
    color: Colors.grays.dark,
    fontWeight: '500',
  },
  versionSubtext: {
    fontSize: 11,
    color: Colors.grays.dark,
    marginTop: 4,
  },
});