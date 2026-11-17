import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import { colors, spacing, borderRadius } from '../theme';

export function HealthStatus({ status, loading }) {
  const isOk = status === 'ok';

  return (
    <View style={[styles.card, isOk ? styles.ok : styles.error]}>
      {loading && <ActivityIndicator style={styles.spinner} />}
      <View style={styles.statusRow}>
        <Ionicons
          name={isOk ? 'checkmark-circle' : 'close-circle'}
          size={18}
          color={isOk ? colors.success : colors.error}
        />
        <AppText
          variant="bodyBold"
          style={[styles.statusText, { color: isOk ? colors.success : colors.error }]}
        >
          {isOk ? 'Backend conectado' : 'Backend no disponible'}
        </AppText>
      </View>
      <AppText variant="caption" style={styles.description}>
        {isOk
          ? 'La API respondió correctamente.'
          : 'Verificá que el backend esté corriendo y que la URL sea correcta.'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
  },
  ok: {
    borderLeftColor: colors.success,
  },
  error: {
    borderLeftColor: colors.error,
  },
  spinner: {
    marginBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
