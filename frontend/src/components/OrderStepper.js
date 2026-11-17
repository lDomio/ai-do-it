import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

const STEPS = [
  { key: 'PENDIENTE', label: 'Pedido', icon: 'receipt-outline' },
  { key: 'CONFIRMADO', label: 'Aceptado', icon: 'checkmark-circle-outline' },
  { key: 'EN_PROGRESO', label: 'En Progreso', icon: 'time-outline' },
  { key: 'EN_REVISION', label: 'Entregado', icon: 'paper-plane-outline' },
  { key: 'COMPLETADO', label: 'Aprobado', icon: 'star-outline' },
];

function getStepIndex(status) {
  const map = {
    PENDIENTE: 0,
    CONFIRMADO: 1,
    EN_PROGRESO: 2,
    EN_REVISION: 3,
    ENTREGADO: 3,
    COMPLETADO: 4,
    CANCELADO: -1,
  };
  return map[status] ?? -1;
}

export default function OrderStepper({ status }) {
  const activeIndex = getStepIndex(status);

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const isFuture = index > activeIndex;

        return (
          <View key={step.key} style={styles.stepWrapper}>
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isActive && styles.circleActive,
                  isFuture && styles.circleFuture,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={colors.surface} />
                ) : (
                  <Ionicons
                    name={step.icon}
                    size={14}
                    color={isActive ? colors.surface : colors.textLight}
                  />
                )}
              </View>
              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.line,
                    isCompleted && styles.lineCompleted,
                    isFuture && styles.lineFuture,
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                isCompleted && styles.labelCompleted,
                isActive && styles.labelActive,
                isFuture && styles.labelFuture,
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: {
    backgroundColor: colors.success,
  },
  circleActive: {
    backgroundColor: colors.primary,
  },
  circleFuture: {
    backgroundColor: colors.border,
  },
  line: {
    position: 'absolute',
    top: 13,
    left: '55%',
    right: '-55%',
    height: 2,
    backgroundColor: colors.border,
  },
  lineCompleted: {
    backgroundColor: colors.success,
  },
  lineFuture: {
    backgroundColor: colors.border,
  },
  label: {
    ...typography.small,
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  labelCompleted: {
    color: colors.success,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  labelFuture: {
    color: colors.textLight,
  },
});
