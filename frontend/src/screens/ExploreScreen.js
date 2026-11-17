import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
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
import { useGigs, useCategories } from '../hooks/useGigs';
import { colors, typography, spacing, borderRadius } from '../theme';

export function ExploreScreen({ navigation, route }) {
  const initialSearch = route?.params?.search || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [refreshing, setRefreshing] = useState(false);

  const { gigs, loading, refetch } = useGigs({
    category: selectedCategory,
    search: searchQuery,
  });
  const { categories } = useCategories();

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const navigateToGig = (gig) => {
    navigation.navigate('GigDetail', { gigId: gig.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar servicios..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <CategoryChip
              label={item.name}
              icon={item.icon}
              selected={selectedCategory === item.id}
              onPress={() => setSelectedCategory(item.id)}
            />
          )}
        />
      </View>

      <FlatList
        data={gigs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gigsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.gigWrapper}>
            <GigCard gig={item} onPress={navigateToGig} />
          </View>
        )}
        ListHeaderComponent={
          <AppText variant="caption" style={styles.resultCount}>
            {gigs.length} servicios encontrados
          </AppText>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={colors.textLight} />
              <AppText variant="body" style={styles.emptyTitle}>
                No se encontraron servicios
              </AppText>
              <AppText variant="caption" style={styles.emptySubtitle}>
                Intenta con otros términos o categorías
              </AppText>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  categoriesContainer: {
    marginBottom: spacing.sm,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
  },
  gigsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  gigWrapper: {
    marginBottom: spacing.sm,
  },
  resultCount: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
