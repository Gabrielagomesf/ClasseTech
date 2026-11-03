import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useLayout} from '../../hooks/useLayout';
import {colors, radius, spacing} from '../../theme';

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function PillTabs<T extends string>({options, value, onChange}: Props<T>) {
  const {isCompact, scaleFont} = useLayout();

  const content = (
    <View style={styles.row}>
      {options.map(option => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{selected: active}}
            onPress={() => onChange(option.value)}
            style={[styles.pill, active && styles.pillActive]}>
            <Text
              style={[
                styles.label,
                {fontSize: scaleFont(isCompact ? 12 : 13)},
                active && styles.labelActive,
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (isCompact && options.length > 3) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {content}
      </ScrollView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.white,
  },
});
