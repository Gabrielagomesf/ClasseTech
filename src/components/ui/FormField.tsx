import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {colors, radius, spacing, typography} from '../../theme';

type Props = TextInputProps & {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
};

export function FormField({
  label,
  required = false,
  error,
  hint,
  containerStyle,
  rightElement,
  style,
  ...inputProps
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={typography.label}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, rightElement ? styles.inputWithRight : null, style]}
          {...inputProps}
        />
        {rightElement}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  asterisk: {
    color: colors.danger,
    fontWeight: '700',
  },
  inputRow: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 15,
  },
  inputWithRight: {
    paddingRight: spacing.xs,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
