import React from 'react';
import { Text } from 'react-native';
import { typography } from '../theme';

const variants = {
  heading: typography.heading,
  subheading: typography.subheading,
  body: typography.body,
  bodyBold: typography.bodyBold,
  caption: typography.caption,
  small: typography.small,
};

export function AppText({ children, style, variant = 'body' }) {
  const variantStyle = variants[variant] || variants.body;
  return <Text style={[variantStyle, style]}>{children}</Text>;
}
