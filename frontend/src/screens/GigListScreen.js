import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { SearchBar } from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import { SortDropdown } from '../components/SortDropdown';
import GigCard from '../components/GigCard';
import { AppButton } from '../shared/AppButton';
import { GigService } from '../services/gigService';
import { useApiConfig } from '../context/ApiConfigContext';
import { useApp } from '../context/AppContext';

export function GigListScreen({ navigation, route }) {
  const { baseUrl } = useApiConfig();
  const { searchQuery, updateSearchQuery } = useApp();
  const [gigService] = useState(() => new GigService(baseUrl));

  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const initialRouteSearch = route?.params?.search || '';
  const [pendingSearch, setPendingSearch] = useState(initialRouteSearch || searchQuery);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [pendingSort, setPendingSort] = useState('date');

  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedCategory, setAppliedCategory] = useState(null);
  const [appliedSort, setAppliedSort] = useState('date');

  const loadGigs = useCallback(
    async ({ search, category, sort, isRefresh = false } = {}) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const result = await gigService.searchGigs({
          search: search || undefined,
          category: category || undefined,
          sortBy: sort || undefined,
          pageSize: 50,
        });
        setGigs(result.gigs);
      } catch (err) {
        setError(err.message);
        setGigs([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [gigService]
  );

  const loadCategories = useCallback(async () => {
    try {
      const cats = await gigService.getCategories();
      setCategories(cats);
    } catch {
      // Categories are non-critical; ignore errors
    }
  }, [gigService]);

  const syncFromGlobalSearch = useCallback(() => {
    const query = initialRouteSearch || searchQuery;
    if (query) {
      setPendingSearch(query);
      setAppliedSearch(query);
      updateSearchQuery(query);
      loadGigs({ search: query });
    }
  }, [initialRouteSearch, searchQuery, updateSearchQuery, loadGigs]);

  const syncGlobalToLocal = useCallback(() => {
    if (searchQuery && searchQuery !== pendingSearch) {
      setPendingSearch(searchQuery);
      setAppliedSearch(searchQuery);
      loadGigs({ search: searchQuery });
    }
  }, [searchQuery, pendingSearch, loadGigs]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadGigs(), loadCategories()]);
      syncFromGlobalSearch();
    };
    init();
  }, [loadGigs, loadCategories, syncFromGlobalSearch]);

  useEffect(() => {
    syncGlobalToLocal();
  }, [syncGlobalToLocal]);

  const handleBuscar = useCallback(() => {
    setAppliedSearch(pendingSearch);
    updateSearchQuery(pendingSearch);
    setAppliedCategory(pendingCategory);
    setAppliedSort(pendingSort);
    loadGigs({ search: pendingSearch, category: pendingCategory, sort: pendingSort });
  }, [pendingSearch, pendingCategory, pendingSort, loadGigs, updateSearchQuery]);

  const handleRefresh = useCallback(() => {
    loadGigs({
      search: appliedSearch,
      category: appliedCategory,
      sort: appliedSort,
      isRefresh: true,
    });
  }, [appliedSearch, appliedCategory, appliedSort, loadGigs]);

  const handleGigPress = useCallback(
    (gig) => {
      navigation?.navigate('GigDetail', { gigId: gig.id });
    },
    [navigation]
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {appliedSearch || appliedCategory
            ? 'No se encontraron Gigs para tu búsqueda'
            : 'No hay Gigs disponibles'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar value={pendingSearch} onChangeText={setPendingSearch} />

      {categories.length > 0 && (
        <View style={styles.categoriesWrapper}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.chipList}
            renderItem={({ item }) => (
              <CategoryChip
                label={item.name || item.nombre}
                selected={pendingCategory === item.id}
                onPress={() => setPendingCategory((prev) => (prev === item.id ? null : item.id))}
              />
            )}
          />
        </View>
      )}

      <SortDropdown value={pendingSort} onChange={setPendingSort} />

      <View style={styles.buscarContainer}>
        <AppButton title="Realizar búsqueda" onPress={handleBuscar} />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={handleRefresh}>
            Reintentar
          </Text>
        </View>
      )}

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
      ) : (
        <FlatList
          data={gigs}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <GigCard gig={item} onPress={handleGigPress} />}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={gigs.length === 0 && styles.emptyList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 8,
  },
  chipList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoriesWrapper: {
    height: 52,
  },
  buscarContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});
