import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing, typography} from '../../theme';

type Props = {
  current: number;
  total?: number;
  labels?: string[];
};

export function StepIndicator({current, total = 3, labels}: Props) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <View style={styles.wrapper}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${progress}%`}]} />
      </View>
      <View style={styles.stepsRow}>
        {Array.from({length: total}, (_, index) => {
          const step = index + 1;
          const active = step === current;
          const done = step < current;
          return (
            <View key={step} style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  (active || done) && styles.circleActive,
                  done && styles.circleDone,
                ]}>
                <Text
                  style={[
                    styles.number,
                    (active || done) && styles.numberActive,
                  ]}>
                  {done ? '✓' : step}
                </Text>
              </View>
              {labels?.[index] ? (
                <Text
                  style={[
                    styles.stepLabel,
                    active && styles.stepLabelActive,
                  ]}
                  numberOfLines={1}>
                  {labels[index]}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  progressTrack: {
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  circleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  circleDone: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  number: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  numberActive: {
    color: colors.white,
  },
  stepLabel: {
    ...typography.caption,
    fontSize: 11,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
