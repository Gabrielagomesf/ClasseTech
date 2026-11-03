import React, {PropsWithChildren} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {colors, radius, spacing} from '../../theme';

type Props = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}>;

export function Card({children, onPress, style, elevated = true}: Props) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({pressed}) => [
          styles.card,
          elevated && styles.elevated,
          pressed && styles.pressed,
          style,
        ]}>
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, elevated && styles.elevated, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  pressed: {
    opacity: 0.96,
  },
});
