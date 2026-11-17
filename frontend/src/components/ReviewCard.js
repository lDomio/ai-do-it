import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import { colors, spacing, borderRadius } from '../theme';

export function ReviewCard({ review }) {
  const buyer = review.buyer || {};
  const rating = review.rating ?? review.puntuacion ?? 0;
  const comment = review.comment || review.detalle || '';
  const date = review.createdAt || review.fechaCreacion;
  const displayName = buyer.name || review.cliente || 'Cliente';
  const avatar = buyer.avatar;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={20} color={colors.textLight} />
          </View>
        )}
        <View style={styles.headerInfo}>
          <AppText variant="bodyBold">{displayName}</AppText>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= rating ? 'star' : 'star-outline'}
                size={14}
                color={colors.accent}
              />
            ))}
          </View>
        </View>
        {date && (
          <AppText variant="small" style={styles.date}>
            {new Date(date).toLocaleDateString('es-AR')}
          </AppText>
        )}
      </View>
      <AppText variant="body" style={styles.comment}>
        {comment}
      </AppText>
    </View>
  );
}

export function ReviewSummary({ rating, reviewCount }) {
  return (
    <View style={styles.summary}>
      <View style={styles.ratingBig}>
        <View style={styles.ratingNumberContainer}>
          <AppText variant="heading" style={styles.ratingNumber}>
            {rating}
          </AppText>
        </View>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.round(rating) ? 'star' : 'star-outline'}
              size={16}
              color={colors.accent}
            />
          ))}
        </View>
        <AppText variant="caption" style={styles.reviewCount}>
          {reviewCount} reseñas
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
    backgroundColor: colors.border,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  date: {
    color: colors.textLight,
  },
  comment: {
    color: colors.text,
    lineHeight: 22,
  },
  summary: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  ratingBig: {
    alignItems: 'center',
  },
  ratingNumberContainer: {
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingNumber: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
  },
  reviewCount: {
    color: colors.textSecondary,
  },
});
