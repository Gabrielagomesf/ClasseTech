import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing, typography} from '../../theme';
import {Button} from './Button';

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={typography.subtitle}>{title}</Text>
      {description ? (
        <Text style={[typography.caption, styles.description]}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  description: {
    textAlign: 'center',
    maxWidth: 280,
    color: colors.textSecondary,
  },
  button: {
    marginTop: spacing.md,
    minWidth: 180,
  },
});
