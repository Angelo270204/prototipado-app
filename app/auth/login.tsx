import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      const success = login(email, password);

      if (success) {
        // Obtener el rol basado en el email para redirigir inmediatamente
        let targetRoute = '/role-selection';

        if (email === 'yardy12@gmail.com') {
          targetRoute = '/designer/projects';
        } else if (email === 'renzozv@gmail.com') {
          targetRoute = '/client/projects';
        } else if (email === 'angelo77@gmail.com') {
          targetRoute = '/operator/work-orders';
        } else if (email === 'steph12@gmail.com') {
          targetRoute = '/production/dashboard';
        }

        router.replace(targetRoute as any);
      } else {
        Alert.alert(
          'Error de autenticación',
          'Correo o contraseña incorrectos. Verifica tus credenciales.',
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert(
        'Campos incompletos',
        'Por favor ingresa tu correo y contraseña',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header con Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="cube-outline" size={64} color={Colors.base.blackPrimary} />
          </View>
          <Text style={styles.title}>DTP-AR</Text>
          <Text style={styles.subtitle}>Validación CAD en Realidad Aumentada</Text>
        </View>

        {/* Formulario de Login */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.auth.inputText}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="ejemplo@empresa.com"
                placeholderTextColor={Colors.auth.inputPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.auth.inputText}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.auth.inputPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.auth.inputText}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && (
                  <Ionicons name="checkmark" size={16} color={Colors.primary.contrast} />
                )}
              </View>
              <Text style={styles.rememberMeText}>Recordarme</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!email || !password}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>


          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/register')}>
              <Text style={styles.registerLink}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 DTP-AR - Chimbote, Áncash</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.base.whitePrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.medium,
    borderWidth: 2,
    borderColor: Colors.grays.light,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  formContainer: {
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  formTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.base.whitePrimary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.grays.medium,
    height: 44,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.body,
    color: Colors.base.blackPrimary,
    height: '100%',
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.grays.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  checkboxChecked: {
    backgroundColor: Colors.base.blackPrimary,
    borderColor: Colors.base.blackPrimary,
  },
  rememberMeText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  forgotPassword: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  loginButton: {
    backgroundColor: Colors.base.blackPrimary,
    borderRadius: BorderRadius.md,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.grays.dark,
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.whitePrimary,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  registerLink: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semibold,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.sizes.caption,
    color: Colors.grays.medium,
  },
});