import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import { AppButton } from '../shared/AppButton';
import { PackageTabBar } from '../components/PackageTabBar';
import { ReviewCard, ReviewSummary } from '../components/ReviewCard';
import { OrderRequirementsModal } from '../components/OrderRequirementsModal';
import { OrderConfirmationModal } from '../components/OrderConfirmationModal';
import { useGig } from '../hooks/useGigs';
import { useReviews } from '../hooks/useReviews';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius } from '../theme';

export function GigDetailScreen({ route, navigation }) {
  const { gigId } = route.params;
  const { gig, loading } = useGig(gigId);
  const { reviews, loading: reviewsLoading } = useReviews(gigId);
  const { createOrder, loading: placingOrder, error: placeOrderError, reset } = useCreateOrder();
  const { addOrder } = useApp();
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [step, setStep] = useState('detail'); // 'detail' | 'requirements' | 'confirmation'
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    setSelectedPackageIndex(0);
    setStep('detail');
    setRequirements('');
    reset();
  }, [gigId, reset]);

  const openRequirements = useCallback(() => {
    setStep('requirements');
  }, []);

  const handleRequirementsNext = useCallback((text) => {
    setRequirements(text);
    setStep('confirmation');
  }, []);

  const handleEditRequirements = useCallback(() => {
    setStep('requirements');
  }, []);

  const handleCancelFlow = useCallback(() => {
    setStep('detail');
    setRequirements('');
    reset();
  }, [reset]);

  const selectedPackage = useMemo(() => {
    if (!gig) return null;
    const packages = gig.packages || gig.paquetes || [];
    const rawPkg = packages[selectedPackageIndex] || packages[0] || {};
    return {
      id: rawPkg.id,
      name: rawPkg.name || rawPkg.nombre || '',
      price: rawPkg.price ?? rawPkg.precio ?? 0,
      deliveryDays: rawPkg.deliveryDays ?? rawPkg.diasEntrega ?? 0,
      features: rawPkg.features || rawPkg.caracteristicas || [],
    };
  }, [gig, selectedPackageIndex]);

  const handleConfirmOrder = useCallback(async () => {
    const result = await createOrder(gigId, selectedPackage.id, requirements);
    if (result.success) {
      const normalizedOrder = {
        id: result.order.id,
        gig,
        buyer: { id: result.order.cliente },
        seller: gig.seller || gig.vendedor || {},
        package: selectedPackage,
        status: 'PENDIENTE',
        totalPrice: result.order.total,
        createdAt: result.order.fechaCreacion,
        deliveryDeadline: null,
        daysRemaining: selectedPackage.deliveryDays,
      };
      addOrder(normalizedOrder);
      navigation.navigate('Pedidos');
    }
  }, [createOrder, gigId, selectedPackage, requirements, navigation, addOrder, gig]);

  if (loading || !gig || !selectedPackage) {
    return (
      <View style={styles.loadingContainer}>
        <AppText variant="body">Cargando...</AppText>
      </View>
    );
  }

  const packages = gig.packages || gig.paquetes || [];
  if (packages.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <AppText variant="body">No hay paquetes disponibles.</AppText>
      </View>
    );
  }

  const seller = gig.seller || gig.vendedor || {};
  const images = gig.images || gig.multimedia || [];
  const tags = gig.tags || (gig.categoryName ? [gig.categoryName] : []);
  const rating = gig.rating || seller.rating || 0;
  const reviewCount = gig.reviewCount || seller.reviewCount || 0;

  const priceDisplay =
    selectedPackage.price === 0 ? 'Gratis' : `$${selectedPackage.price.toLocaleString('es-AR')}`;

  const deliveryDisplay =
    selectedPackage.deliveryDays === 0
      ? 'Entrega el mismo día'
      : `${selectedPackage.deliveryDays} días de entrega`;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {images.length > 0 ? (
          <Image source={{ uri: images[0] }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={48} color={colors.textLight} />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.sellerRow}>
            {seller.avatar ? (
              <Image source={{ uri: seller.avatar }} style={styles.sellerAvatar} />
            ) : (
              <View style={[styles.sellerAvatar, styles.sellerAvatarPlaceholder]}>
                <Ionicons name="person" size={24} color={colors.textLight} />
              </View>
            )}
            <View style={styles.sellerInfo}>
              <AppText variant="bodyBold">{seller.name || seller.nombre}</AppText>
              <AppText variant="caption" style={styles.sellerLevel}>
                Nivel 2 · {seller.stats?.completed || 0} trabajos
              </AppText>
            </View>
          </View>

          <AppText variant="heading" style={styles.title}>
            {gig.title || gig.nombre}
          </AppText>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color={colors.accent} />
            <AppText variant="bodyBold" style={styles.ratingText}>
              {rating} ({reviewCount} reseñas)
            </AppText>
          </View>

          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <AppText variant="small" style={styles.tagText}>
                  {tag}
                </AppText>
              </View>
            ))}
          </View>

          <AppText variant="subheading" style={styles.sectionTitle}>
            Descripción
          </AppText>
          <AppText variant="body" style={styles.description}>
            {gig.description || gig.descripcion}
          </AppText>

          <AppText variant="subheading" style={styles.sectionTitle}>
            Paquetes
          </AppText>

          <PackageTabBar
            packages={packages.map((p) => ({ id: p.id, name: p.name || p.nombre }))}
            selectedIndex={selectedPackageIndex}
            onTabChange={setSelectedPackageIndex}
          />

          <View style={styles.packageCard}>
            <AppText variant="subheading" style={styles.packageTitle}>
              {selectedPackage.name}
            </AppText>
            <AppText variant="heading" style={styles.packagePrice}>
              {priceDisplay}
            </AppText>
            <AppText variant="caption" style={styles.deliveryText}>
              <Ionicons name="time-outline" size={14} /> {deliveryDisplay}
            </AppText>
            <View style={styles.featuresList}>
              {selectedPackage.features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <AppText variant="body" style={styles.featureText}>
                    {feature}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          <AppText variant="subheading" style={styles.sectionTitle}>
            Reseñas
          </AppText>

          <ReviewSummary rating={rating} reviewCount={reviewCount} />

          {reviewsLoading ? (
            <AppText variant="caption" style={styles.emptyText}>
              Cargando reseñas...
            </AppText>
          ) : reviews.length === 0 ? (
            <AppText variant="caption" style={styles.emptyText}>
              Aún no hay reseñas para este servicio.
            </AppText>
          ) : (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <AppText variant="caption" style={styles.footerPriceLabel}>
            Precio total
          </AppText>
          <AppText variant="subheading" style={styles.footerPriceValue}>
            {priceDisplay}
          </AppText>
        </View>
        <AppButton title="Continuar" onPress={openRequirements} style={styles.continueBtn} />
      </View>

      {step === 'requirements' && (
        <OrderRequirementsModal
          initialRequirements={requirements}
          onNext={handleRequirementsNext}
          onCancel={handleCancelFlow}
        />
      )}

      {step === 'confirmation' && (
        <OrderConfirmationModal
          gig={gig}
          selectedPackage={selectedPackage}
          requirements={requirements}
          onEdit={handleEditRequirements}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelFlow}
          loading={placingOrder}
          error={placeOrderError}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: colors.border,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
    backgroundColor: colors.border,
  },
  sellerAvatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerLevel: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ratingText: {
    marginLeft: spacing.xs,
    color: colors.text,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  tag: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    color: colors.primary,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  packageCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  packageTitle: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  packagePrice: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  deliveryText: {
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerPrice: {
    flex: 1,
  },
  footerPriceLabel: {
    color: colors.textSecondary,
  },
  footerPriceValue: {
    color: colors.text,
  },
  continueBtn: {
    flex: 1,
    marginLeft: spacing.md,
  },
});
