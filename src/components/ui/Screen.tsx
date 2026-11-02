import React, {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, spacing} from '../../theme';

type Props = PropsWithChildren<{
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}>;

export function Screen({
  children,
  scroll = false,
  style,
  contentStyle,
  edges = ['top', 'left', 'right'],
}: Props) {
  return (
    <SafeAreaView edges={edges} style={[styles.safe, style]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, contentStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
});
