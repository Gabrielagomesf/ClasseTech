import React, {PropsWithChildren} from 'react';
import {Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import {colors, radius, spacing} from '../../theme';

type Props = PropsWithChildren<{
  onPress?: () => void;
  style?: ViewStyle;
}>;

export function Card({children, onPress, style}: Props) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({pressed}) => [
          styles.card,
          pressed && styles.pressed,
          style,
        ]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  pressed: {
    opacity: 0.96,
  },
});
