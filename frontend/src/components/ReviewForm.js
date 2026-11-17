import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import { AppButton } from '../shared/AppButton';
import { colors, typography, spacing, borderRadius } from '../theme';

const MAX_COMMENT_LENGTH = 1000;

export function ReviewForm({ onSubmit, onCancel, loading = false, error = null }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleStarPress = useCallback((value) => {
    setRating(value);
  }, []);

  const trimmedComment = comment.trim();
  const isOverLimit = comment.length > MAX_COMMENT_LENGTH;
  const canSubmit =
    rating >= 1 && rating <= 5 && trimmedComment.length > 0 && !isOverLimit && !loading;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    onSubmit({ rating, comment: trimmedComment });
  }, [canSubmit, onSubmit, rating, trimmedComment]);

  return (
    <View style={styles.container}>
      <AppText variant="subheading" style={styles.title}>
        Calificar servicio
      </AppText>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            activeOpacity={0.7}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={36}
              color={colors.accent}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[styles.input, (isOverLimit || error) && styles.inputError]}
        placeholder="Contanos tu experiencia..."
        placeholderTextColor={colors.textLight}
        multiline
        numberOfLines={4}
        maxLength={MAX_COMMENT_LENGTH + 1}
        value={comment}
        onChangeText={(text) => {
          setComment(text);
        }}
        editable={!loading}
      />

      <View style={styles.footerRow}>
        <AppText
          variant="small"
          style={[styles.charCounter, isOverLimit && styles.charCounterError]}
        >
          {comment.length}/{MAX_COMMENT_LENGTH}
        </AppText>
      </View>

      {error && (
        <AppText variant="small" style={styles.errorText}>
          {error}
        </AppText>
      )}

      <View style={styles.buttonsRow}>
        <AppButton
          title="Cancelar"
          variant="secondary"
          onPress={onCancel}
          disabled={loading}
          style={[styles.button, styles.cancelButton]}
        />
        <AppButton
          title="Enviar reseña"
          onPress={handleSubmit}
          disabled={!canSubmit}
          loading={loading}
          style={[styles.button, styles.submitButton]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  starButton: {
    paddingHorizontal: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.error,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  charCounter: {
    color: colors.textLight,
  },
  charCounterError: {
    color: colors.error,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
  cancelButton: {},
  submitButton: {},
});
