import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SORT_OPTIONS = [
  { value: 'date', label: 'Más recientes' },
  { value: 'price', label: 'Menor precio' },
  { value: 'rating', label: 'Mejor valorados' },
];

export function SortDropdown({ value, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  const handleSelect = (option) => {
    onChange?.(option.value);
    setExpanded(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.label}>Ordenar:</Text>
        <Text style={styles.value}>{current.label}</Text>
        <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.dropdown}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, option.value === value && styles.optionSelected]}
              onPress={() => handleSelect(option)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.optionText, option.value === value && styles.optionTextSelected]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    marginRight: 6,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    color: '#9ca3af',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionSelected: {
    backgroundColor: '#eff6ff',
  },
  optionText: {
    fontSize: 14,
    color: '#4b5563',
  },
  optionTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
