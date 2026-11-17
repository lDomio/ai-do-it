import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

const STATUS_CONFIG = {
  PENDIENTE: { label: 'Pendiente', color: colors.warning, bg: colors.warningBg },
  CONFIRMADO: { label: 'Confirmado', color: colors.info, bg: colors.infoBg },
  EN_PROGRESO: { label: 'En Progreso', color: colors.primary, bg: colors.primaryLight + '20' },
  EN_REVISION: { label: 'En Revisión', color: colors.warning, bg: colors.warningBg },
  ENTREGADO: { label: 'Entregado', color: colors.success, bg: colors.successBg },
  COMPLETADO: { label: 'Completado', color: colors.success, bg: colors.successBg },
  CANCELADO: { label: 'Cancelado', color: colors.error, bg: colors.errorBg },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: colors.textSecondary,
    bg: colors.border,
  };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  text: {
    ...typography.small,
    fontWeight: '600',
  },
});
