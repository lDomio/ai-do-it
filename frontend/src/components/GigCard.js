import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

export default function GigCard({ gig, onPress, compact = false }) {
  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={() => onPress?.(gig)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: gig.images?.[0] }} style={styles.compactImage} />
        <Text style={styles.compactTitle} numberOfLines={2}>
          {gig.title}
        </Text>
        <View style={styles.compactFooter}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={colors.accent} />
            <Text style={styles.ratingText}>{gig.rating}</Text>
          </View>
          <Text style={styles.compactPrice}>${gig.packages[0]?.price.toLocaleString('es-AR')}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(gig)} activeOpacity={0.7}>
      <Image source={{ uri: gig.images?.[0] }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.sellerRow}>
          <Image source={{ uri: gig.seller?.avatar }} style={styles.sellerAvatar} />
          <Text style={styles.sellerName}>{gig.seller?.name}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {gig.title}
        </Text>
        <View style={styles.footer}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.accent} />
            <Text style={styles.ratingText}>
              {gig.rating} ({gig.reviewCount})
            </Text>
          </View>
          <Text style={styles.price}>Desde ${gig.packages[0]?.price.toLocaleString('es-AR')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.border,
  },
  content: {
    padding: spacing.md,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sellerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.xs,
    backgroundColor: colors.border,
  },
  sellerName: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.caption,
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
  price: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  compactCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    width: 160,
    marginRight: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  compactImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.border,
  },
  compactTitle: {
    ...typography.caption,
    fontWeight: '500',
    padding: spacing.sm,
    paddingBottom: spacing.xs,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  compactPrice: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
  },
});
