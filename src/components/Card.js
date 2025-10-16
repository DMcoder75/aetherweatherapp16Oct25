import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../utils/theme';

const Card = ({ children, style, variant = 'default' }) => {
  const cardStyles = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  elevated: {
    ...shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.brand.primary + '30',
  },
});

export default Card;

