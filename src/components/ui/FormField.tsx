import React, {useState} from 'react';
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
  onFocus,
  onBlur,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={typography.label}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>
      <View
        style={[
          styles.inputRow,
          focused && !error && styles.inputFocused,
          error ? styles.inputError : null,
        ]}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, rightElement ? styles.inputWithRight : null, style]}
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
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
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: radius.md,
    backgroundColor: colors.inputBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
  },
  inputFocused: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  input: {
    flex: 1,
    minHeight: 50,
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
