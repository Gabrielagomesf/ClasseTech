import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
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

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const {isCompact, scaleFont} = useLayout();

  return (
    <View style={styles.track}>
      {options.map(option => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{selected: active}}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active && styles.segmentActive]}>
            <Text
              style={[
                styles.label,
                {fontSize: scaleFont(isCompact ? 12 : 13)},
                active && styles.labelActive,
              ]}
              numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: radius.full,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 1},
    elevation: 1,
  },
  label: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
