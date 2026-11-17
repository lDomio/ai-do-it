import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import { AppButton } from '../shared/AppButton';
import { useAuth } from '../context/AuthContext';
import { useApiConfig } from '../context/ApiConfigContext';
import { buildAuthService } from '../services/authService';
import { colors, typography, spacing, borderRadius } from '../theme';

export function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENTE');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const config = useApiConfig();
  const authService = buildAuthService(config.baseUrl);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Email y contraseña son obligatorios');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await authService.login(email.trim(), password.trim());
      } else {
        if (!nombre.trim() || !apellido.trim()) {
          Alert.alert('Error', 'Nombre y apellido son obligatorios');
          setLoading(false);
          return;
        }
        result = await authService.register({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email: email.trim(),
          password: password.trim(),
          rol: role,
        });
      }

      login(result.token, result.usuario || null);
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo completar la operación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <AppText variant="heading" style={styles.title}>
          AI Do It
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}
        </AppText>
      </View>

      {!isLogin && (
        <>
          <View style={styles.field}>
            <AppText variant="caption" style={styles.label}>
              Nombre
            </AppText>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor={colors.textLight}
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.field}>
            <AppText variant="caption" style={styles.label}>
              Apellido
            </AppText>
            <TextInput
              style={styles.input}
              placeholder="Tu apellido"
              placeholderTextColor={colors.textLight}
              value={apellido}
              onChangeText={setApellido}
              autoCapitalize="words"
            />
          </View>
        </>
      )}

      <View style={styles.field}>
        <AppText variant="caption" style={styles.label}>
          Email
        </AppText>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          placeholderTextColor={colors.textLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <AppText variant="caption" style={styles.label}>
          Contraseña
        </AppText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="********"
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {!isLogin && (
        <View style={styles.field}>
          <AppText variant="caption" style={styles.label}>
            Rol
          </AppText>
          <View style={styles.roleContainer}>
            {['CLIENTE', 'FREELANCE'].map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                onPress={() => setRole(r)}
              >
                <AppText
                  variant="body"
                  style={role === r ? styles.roleTextActive : styles.roleText}
                >
                  {r === 'CLIENTE' ? 'Cliente' : 'Freelancer'}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
          <AppText variant="small" style={styles.roleHint}>
            Selecciona Freelancer para poder crear servicios.
          </AppText>
        </View>
      )}

      <AppButton
        title={isLogin ? 'Iniciar sesión' : 'Registrarse'}
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitBtn}
      />

      <TouchableOpacity style={styles.switchContainer} onPress={() => setIsLogin(!isLogin)}>
        <AppText variant="caption" style={styles.switchText}>
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </AppText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.lg,
  },
  title: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  roleContainer: {
    flexDirection: 'row',
  },
  roleBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  roleBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    color: colors.text,
  },
  roleTextActive: {
    color: colors.surface,
  },
  roleHint: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  submitBtn: {
    marginTop: spacing.lg,
  },
  switchContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  switchText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
