import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import { AppButton } from '../shared/AppButton';
import { colors, typography, spacing, borderRadius } from '../theme';

export function PackageCard({
  pkg,
  index,
  editable = false,
  errors = {},
  onUpdate,
  onDelete,
  canDelete = true,
}) {
  const updateField = (field, value) => {
    if (onUpdate) onUpdate(index, field, value);
  };

  const featuresList = Array.isArray(pkg.features) ? pkg.features : [];
  const featuresText = featuresList.join('\n');

  if (!editable) {
    return (
      <View style={styles.card}>
        <AppText variant="subheading" style={styles.packageTitle}>
          {pkg.name}
        </AppText>
        <AppText variant="heading" style={styles.price}>
          {pkg.price === 0 ? 'Gratis' : `$${pkg.price.toLocaleString('es-AR')}`}
        </AppText>
        <AppText variant="caption" style={styles.delivery}>
          <Ionicons name="time-outline" size={14} />{' '}
          {pkg.deliveryDays === 0 ? 'Entrega el mismo día' : `${pkg.deliveryDays} días de entrega`}
        </AppText>
        <View style={styles.featuresList}>
          {featuresList.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <AppText variant="body" style={styles.featureText}>
                {feature}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <AppText variant="bodyBold" style={styles.packageName}>
          {pkg.name}
        </AppText>
        {canDelete && onDelete && (
          <TouchableOpacity onPress={() => onDelete(index)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.field}>
        <AppText variant="caption" style={styles.label}>
          Nombre del paquete *
        </AppText>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Ej: Básico"
          placeholderTextColor={colors.textLight}
          value={pkg.name}
          onChangeText={(v) => updateField('name', v)}
        />
        {errors.name && (
          <AppText variant="small" style={styles.errorText}>
            {errors.name}
          </AppText>
        )}
      </View>

      <View style={styles.field}>
        <AppText variant="caption" style={styles.label}>
          Precio (ARS) *
        </AppText>
        <TextInput
          style={[styles.input, errors.price && styles.inputError]}
          placeholder="0"
          placeholderTextColor={colors.textLight}
          keyboardType="numeric"
          value={pkg.price}
          onChangeText={(v) => updateField('price', v)}
        />
        {errors.price && (
          <AppText variant="small" style={styles.errorText}>
            {errors.price}
          </AppText>
        )}
      </View>

      <View style={styles.field}>
        <AppText variant="caption" style={styles.label}>
          Días de entrega *
        </AppText>
        <TextInput
          style={[styles.input, errors.deliveryDays && styles.inputError]}
          placeholder="0"
          placeholderTextColor={colors.textLight}
          keyboardType="numeric"
          value={pkg.deliveryDays}
          onChangeText={(v) => updateField('deliveryDays', v)}
        />
        {errors.deliveryDays && (
          <AppText variant="small" style={styles.errorText}>
            {errors.deliveryDays}
          </AppText>
        )}
      </View>

      <View style={styles.field}>
        <AppText variant="caption" style={styles.label}>
          Características (una por línea) *
        </AppText>
        <TextInput
          style={[styles.input, styles.textArea, errors.features && styles.inputError]}
          placeholder="Característica 1&#10;Característica 2"
          placeholderTextColor={colors.textLight}
          value={featuresText}
          onChangeText={(v) => updateField('features', v.split('\n').filter(Boolean))}
          multiline
          textAlignVertical="top"
        />
        {errors.features && (
          <AppText variant="small" style={styles.errorText}>
            {errors.features}
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  packageName: {
    color: colors.primary,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
  packageTitle: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  price: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  delivery: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  featuresList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureText: {
    marginLeft: spacing.sm,
    color: colors.text,
    flex: 1,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    height: 80,
    paddingTop: spacing.md,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xs,
  },
});
