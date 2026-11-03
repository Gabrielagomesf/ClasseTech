import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {colors, radius, spacing, typography} from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'success';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  compact = false,
}: Props) {
  const isDisabled = disabled || loading;
  const lightText = variant === 'primary' || variant === 'success';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({pressed}) => [
        styles.base,
        compact && styles.compact,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={lightText ? colors.white : colors.primary} />
      ) : (
        <Text
          style={[
            typography.button,
            compact && styles.compactText,
            !lightText && {color: colors.primary},
            variant === 'ghost' && {color: colors.textSecondary},
            variant === 'secondary' && {color: colors.text},
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  compact: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  compactText: {
    fontSize: 13,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
});
