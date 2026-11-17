import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import { useProfile } from '../hooks/useProfile';
import { useOrders } from '../hooks/useOrders';
import { useApiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { useApiConfig } from '../context/ApiConfigContext';
import { buildAuthService } from '../services/authService';
import { colors, typography, spacing, borderRadius } from '../theme';

export function ProfileScreen({ navigation }) {
  const { profile, loading } = useProfile();
  const { activeCount, completedCount } = useOrders();
  const { logout } = useAuth();
  const config = useApiConfig();
  const authService = buildAuthService(config.baseUrl);
  const { get } = useApiClient();
  const [myGigs, setMyGigs] = useState([]);
  const [showGigs, setShowGigs] = useState(false);

  useEffect(() => {
    if (showGigs && profile) {
      get('/gigs')
        .then((res) => {
          const userId = profile.id || profile.userId;
          const userGigs = (res.gigs || []).filter((g) => {
            const sellerId = g.seller?.id || g.seller?.userId;
            return sellerId === userId;
          });
          setMyGigs(userGigs);
        })
        .catch(() => {});
    }
  }, [showGigs, profile, get]);

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <AppText variant="body">Cargando...</AppText>
      </View>
    );
  }

  const menuItems = [
    {
      icon: 'receipt-outline',
      label: 'Mis pedidos',
      badge: activeCount,
      onPress: () => navigation.navigate('Pedidos'),
    },
    {
      icon: 'create-outline',
      label: 'Crear servicio',
      onPress: () => navigation.navigate('Crear servicio'),
    },
    {
      icon: 'briefcase-outline',
      label: 'Mis servicios',
      onPress: () => setShowGigs(!showGigs),
      expanded: showGigs,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        <AppText variant="heading" style={styles.name}>
          {profile.name}
        </AppText>
        <AppText variant="caption" style={styles.email}>
          {profile.email}
        </AppText>
        <View style={styles.roleBadge}>
          <AppText variant="small" style={styles.roleText}>
            {profile.role}
          </AppText>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <AppText variant="subheading" style={styles.statValue}>
            {profile.stats?.completed || 0}
          </AppText>
          <AppText variant="caption" style={styles.statLabel}>
            Completados
          </AppText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <AppText variant="subheading" style={styles.statValue}>
            {activeCount}
          </AppText>
          <AppText variant="caption" style={styles.statLabel}>
            Activos
          </AppText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <AppText variant="subheading" style={styles.statValue}>
            ${((profile.stats?.earned || 0) / 1000).toFixed(0)}k
          </AppText>
          <AppText variant="caption" style={styles.statLabel}>
            Ganancias
          </AppText>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
              <AppText variant="body" style={styles.menuLabel}>
                {item.label}
              </AppText>
            </View>
            <View style={styles.menuRight}>
              {item.badge > 0 && (
                <View style={styles.menuBadge}>
                  <AppText style={styles.menuBadgeText}>{item.badge}</AppText>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {showGigs && (
        <View style={styles.gigsContainer}>
          {myGigs.length === 0 ? (
            <AppText variant="caption" style={styles.noGigsText}>
              No tienes servicios creados.
            </AppText>
          ) : (
            myGigs.map((gig) => (
              <TouchableOpacity
                key={gig.id}
                style={styles.gigItem}
                onPress={() => navigation.navigate('Crear servicio', { gigId: gig.id })}
              >
                <View style={styles.gigInfo}>
                  <AppText variant="bodyBold" style={styles.gigTitle} numberOfLines={1}>
                    {gig.title}
                  </AppText>
                  <AppText variant="caption" style={styles.gigCategory}>
                    {gig.category} · {(gig.packages || []).length} paquetes
                  </AppText>
                </View>
                <AppText variant="caption" style={styles.editText}>
                  Editar
                </AppText>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          try {
            await authService.logout();
          } catch {
            // ignore logout errors
          }
          logout();
        }}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <AppText variant="bodyBold" style={styles.logoutText}>
          Cerrar sesión
        </AppText>
      </TouchableOpacity>
    </ScrollView>
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
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: spacing.md,
    backgroundColor: colors.border,
  },
  name: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  roleText: {
    color: colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    marginLeft: spacing.md,
    color: colors.text,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: spacing.sm,
  },
  menuBadgeText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.errorBg,
    borderRadius: borderRadius.lg,
  },
  logoutText: {
    color: colors.error,
    marginLeft: spacing.sm,
  },
  gigsContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noGigsText: {
    color: colors.textSecondary,
    padding: spacing.lg,
    textAlign: 'center',
  },
  gigItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gigInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  gigTitle: {
    color: colors.text,
    marginBottom: 2,
  },
  gigCategory: {
    color: colors.textSecondary,
  },
  editText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
