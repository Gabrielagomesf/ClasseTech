import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing} from '../../theme';

type Props = {
  current: number;
  total?: number;
  labels?: string[];
};

export function StepIndicator({current, total = 3, labels}: Props) {
  const steps = Array.from({length: total}, (_, index) => index + 1);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {steps.map((step, index) => {
          const active = step === current;
          const done = step < current;
          return (
            <React.Fragment key={step}>
              <View style={styles.item}>
                <View
                  style={[
                    styles.circle,
                    (active || done) && styles.circleActive,
                  ]}>
                  <Text
                    style={[
                      styles.number,
                      (active || done) && styles.numberActive,
                    ]}>
                    {step}
                  </Text>
                </View>
              </View>
              {index < steps.length - 1 ? (
                <View style={[styles.line, done && styles.lineDone]} />
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
      {labels ? (
        <View style={styles.labels}>
          {labels.map((label, index) => (
            <Text
              key={label}
              style={[
                styles.label,
                index + 1 === current && styles.labelActive,
              ]}>
              {label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
  },
  circle: {
    width: 30,
    height: 30,
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
  number: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  numberActive: {
    color: colors.white,
  },
  line: {
    height: 2,
    flex: 1,
    maxWidth: 48,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  lineDone: {
    backgroundColor: colors.primary,
  },
  labels: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
