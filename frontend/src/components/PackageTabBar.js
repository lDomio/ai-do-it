import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '../shared/AppText';
import { colors, spacing, borderRadius } from '../theme';

export function PackageTabBar({ packages, selectedIndex, onTabChange }) {
  return (
    <View style={styles.container}>
      {packages.map((pkg, index) => (
        <TouchableOpacity
          key={pkg.id || index}
          style={[styles.tab, selectedIndex === index && styles.tabActive]}
          onPress={() => onTabChange(index)}
        >
          <AppText
            variant="caption"
            style={[styles.tabText, selectedIndex === index && styles.tabTextActive]}
          >
            {pkg.name}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
