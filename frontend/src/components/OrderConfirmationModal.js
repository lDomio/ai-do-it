import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppButton } from '../shared/AppButton';
import { AppText } from '../shared/AppText';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

export function OrderConfirmationModal({
  gig,
  selectedPackage,
  requirements,
  onEdit,
  onConfirm,
  onCancel,
  loading = false,
  error = null,
}) {
  const priceDisplay =
    selectedPackage.price === 0 ? 'Gratis' : `$${selectedPackage.price.toLocaleString('es-AR')}`;
  const deliveryDisplay =
    selectedPackage.deliveryDays === 0
      ? 'Entrega el mismo día'
      : `${selectedPackage.deliveryDays} días de entrega`;

  const handleConfirm = useCallback(() => {
    if (loading) return;
    onConfirm();
  }, [loading, onConfirm]);

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <AppText variant="subheading" style={styles.title}>
          Confirmar pedido
        </AppText>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <AppText variant="bodyBold" style={styles.sectionTitle}>
              Servicio
            </AppText>
            <AppText variant="body" style={styles.sectionValue}>
              {gig.title || gig.nombre}
            </AppText>
          </View>

          <View style={styles.packageCard}>
            <AppText variant="bodyBold" style={styles.packageName}>
              {selectedPackage.name}
            </AppText>
            <AppText variant="heading" style={styles.packagePrice}>
              {priceDisplay}
            </AppText>
            <View style={styles.deliveryRow}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <AppText variant="caption" style={styles.deliveryText}>
                {deliveryDisplay}
              </AppText>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.requirementsHeader}>
              <AppText variant="bodyBold" style={styles.sectionTitle}>
                Requerimientos
              </AppText>
              <AppButton
                title="Editar"
                variant="secondary"
                onPress={onEdit}
                style={styles.editBtn}
              />
            </View>
            <View style={styles.requirementsBox}>
              <AppText variant="body" style={styles.requirementsText}>
                {requirements}
              </AppText>
            </View>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <AppText variant="body" style={styles.errorText}>
                {error}
              </AppText>
            </View>
          )}
        </ScrollView>

        <View style={styles.actions}>
          <AppButton
            title="Volver"
            variant="secondary"
            onPress={onCancel}
            style={styles.cancelBtn}
          />
          <AppButton
            title="Confirmar pedido"
            onPress={handleConfirm}
            loading={loading}
            disabled={loading}
            style={styles.confirmBtn}
          />
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
    marginBottom: spacing.lg,
  },
  content: {
    maxHeight: 360,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionValue: {
    color: colors.textSecondary,
  },
  packageCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  packageName: {
    color: colors.text,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  packagePrice: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  deliveryText: {
    color: colors.textSecondary,
  },
  requirementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  editBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    minHeight: 32,
  },
  requirementsBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  requirementsText: {
    color: colors.text,
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: colors.errorBg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelBtn: {
    flex: 1,
  },
  confirmBtn: {
    flex: 1,
  },
});
