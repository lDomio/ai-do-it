import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { AppButton } from '../shared/AppButton';
import { AppText } from '../shared/AppText';
import { colors, spacing, borderRadius, typography } from '../theme';

const MIN_LENGTH = 20;
const MAX_LENGTH = 2000;

export function OrderRequirementsModal({ initialRequirements = '', onNext, onCancel }) {
  const [requirements, setRequirements] = useState(initialRequirements);

  const validate = useCallback((text) => {
    const length = text.trim().length;
    if (length === 0) return '';
    if (length < MIN_LENGTH) return `Mínimo ${MIN_LENGTH} caracteres`;
    if (length > MAX_LENGTH) return `Máximo ${MAX_LENGTH} caracteres`;
    return '';
  }, []);

  const error = validate(requirements);
  const isValid = requirements.trim().length >= MIN_LENGTH && requirements.trim().length <= MAX_LENGTH;

  const handleNext = useCallback(() => {
    if (!isValid) return;
    onNext(requirements.trim());
  }, [isValid, onNext, requirements]);

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <AppText variant="subheading" style={styles.title}>
          Requerimientos del pedido
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          Describí qué necesitás para que el freelancer pueda empezar a trabajar.
        </AppText>

        <TextInput
          style={[styles.textArea, error && styles.textAreaError]}
          multiline
          numberOfLines={6}
          placeholder="Ej: Necesito un logo minimalista en blanco y negro para mi marca CleanTech..."
          placeholderTextColor={colors.textLight}
          value={requirements}
          onChangeText={setRequirements}
          maxLength={MAX_LENGTH}
        />

        <View style={styles.footer}>
          <View style={styles.counterContainer}>
            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : (
              <Text style={styles.counter}>
                {requirements.trim().length}/{MAX_LENGTH}
              </Text>
            )}
          </View>

          <View style={styles.actions}>
            <AppButton
              title="Cancelar"
              variant="secondary"
              onPress={onCancel}
              style={styles.cancelBtn}
            />
            <AppButton
              title="Continuar"
              onPress={handleNext}
              disabled={!isValid}
              style={styles.nextBtn}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    maxHeight: '90%',
  },
  title: {
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  textArea: {
    ...typography.body,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    textAlignVertical: 'top',
    minHeight: 140,
  },
  textAreaError: {
    borderColor: colors.error,
  },
  footer: {
    marginTop: spacing.lg,
  },
  counterContainer: {
    minHeight: 20,
    marginBottom: spacing.sm,
  },
  counter: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 1,
  },
});
