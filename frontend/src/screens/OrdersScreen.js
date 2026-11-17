import React, { useState, useCallback } from 'react';
import { View, Image, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import StatusBadge from '../components/StatusBadge';
import { useOrders } from '../hooks/useOrders';
import { useApp } from '../context/AppContext';
import { colors, typography, spacing, borderRadius } from '../theme';

const TABS = ['Activos', 'Completados'];

export function OrdersScreen({ navigation }) {
  const { activeOrders, completedOrders } = useApp();
  const { activeCount, completedCount, loading, refetch } = useOrders();
  const [selectedTab, setSelectedTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const orders = selectedTab === 0 ? activeOrders : completedOrders;

  const navigateToDetail = (order) => {
    navigation.navigate('PedidoDetail', { orderId: order.id });
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigateToDetail(item)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <Image source={{ uri: item.gig?.images?.[0] }} style={styles.orderImage} />
        <View style={styles.orderInfo}>
          <AppText variant="bodyBold" numberOfLines={1}>
            {item.gig?.title}
          </AppText>
          <AppText variant="caption" style={styles.sellerName}>
            {item.seller?.name}
          </AppText>
        </View>
      </View>

      <View style={styles.orderMeta}>
        <StatusBadge status={item.status} />
        <AppText variant="caption" style={styles.price}>
          ${item.totalPrice?.toLocaleString('es-AR')}
        </AppText>
      </View>

      {item.daysRemaining > 0 && (
        <View style={styles.deliveryRow}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <AppText variant="caption" style={styles.deliveryText}>
            {item.daysRemaining} días restantes
          </AppText>
        </View>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${getProgressPercent(item.status)}%`,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === index && styles.tabActive]}
            onPress={() => setSelectedTab(index)}
          >
            <AppText
              variant="bodyBold"
              style={[styles.tabText, selectedTab === index && styles.tabTextActive]}
            >
              {tab}
            </AppText>
            <View style={[styles.tabBadge, selectedTab === index && styles.tabBadgeActive]}>
              <AppText
                style={[styles.tabBadgeText, selectedTab === index && styles.tabBadgeTextActive]}
              >
                {index === 0 ? activeCount : completedCount}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={renderOrder}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={colors.textLight} />
              <AppText variant="body" style={styles.emptyTitle}>
                No hay pedidos {selectedTab === 0 ? 'activos' : 'completados'}
              </AppText>
              <AppText variant="caption" style={styles.emptySubtitle}>
                Los pedidos que realices aparecerán aquí
              </AppText>
            </View>
          ) : null
        }
      />
    </View>
  );
}

function getProgressPercent(status) {
  const map = {
    PENDIENTE: 10,
    CONFIRMADO: 30,
    EN_PROGRESO: 60,
    EN_REVISION: 80,
    ENTREGADO: 90,
    COMPLETADO: 100,
    CANCELADO: 0,
  };
  return map[status] || 0;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabBadge: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeActive: {
    backgroundColor: colors.primary + '20',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabBadgeTextActive: {
    color: colors.primary,
  },
  list: {
    padding: spacing.lg,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  orderImage: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    backgroundColor: colors.border,
  },
  orderInfo: {
    flex: 1,
  },
  sellerName: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  price: {
    fontWeight: '600',
    color: colors.primary,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  deliveryText: {
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
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
