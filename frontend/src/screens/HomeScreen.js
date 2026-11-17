import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import GigCard from '../components/GigCard';
import CategoryChip from '../components/CategoryChip';
import { useFeaturedGigs, useTrendingGigs, useCategories } from '../hooks/useGigs';
import { useOrders } from '../hooks/useOrders';
import { useProfile } from '../hooks/useProfile';
import { useApp } from '../context/AppContext';
import { colors, typography, spacing, borderRadius } from '../theme';

export function HomeScreen({ navigation }) {
  const { profile } = useProfile();
  const { activeCount } = useOrders();
  const { gigs: featured, loading: loadingFeatured } = useFeaturedGigs();
  const { gigs: trending, loading: loadingTrending } = useTrendingGigs();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const { searchQuery, updateSearchQuery } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const navigateToGig = (gig) => {
    navigation.navigate('Explorar', {
      screen: 'GigDetail',
      params: { gigId: gig.id },
    });
  };

  const navigateToExplore = () => {
    navigation.navigate('Explorar');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <AppText variant="caption" style={styles.greetingLabel}>
              {getGreeting()} 👋
            </AppText>
            <AppText variant="heading" style={styles.greetingName}>
              {profile?.name || 'Explorador'}
            </AppText>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar servicios..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={updateSearchQuery}
            onSubmitEditing={() => {
              if (searchQuery.trim()) {
                navigation.navigate('Explorar', {
                  screen: 'Explore',
                  params: { search: searchQuery },
                });
              }
            }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="subheading">Destacados</AppText>
          <TouchableOpacity onPress={navigateToExplore}>
            <AppText variant="caption" style={styles.seeAll}>
              Ver todos
            </AppText>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={featured}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gigsList}
          renderItem={({ item }) => <GigCard gig={item} compact onPress={navigateToGig} />}
          ListEmptyComponent={
            !loadingFeatured ? (
              <AppText style={styles.emptyText}>No hay gigs destacados</AppText>
            ) : null
          }
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="subheading">En tendencia 🔥</AppText>
        </View>
        {trending.map((gig) => (
          <GigCard key={gig.id} gig={gig} onPress={navigateToGig} />
        ))}
        {!loadingTrending && trending.length === 0 && (
          <AppText style={styles.emptyText}>No hay gigs en tendencia</AppText>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greetingLabel: {
    color: colors.textSecondary,
  },
  greetingName: {
    color: colors.text,
  },
  notificationBtn: {
    padding: spacing.sm,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  categoriesContainer: {
    marginTop: spacing.lg,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '600',
  },
  gigsList: {
    paddingBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
