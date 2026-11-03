import React, {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLayout} from '../../hooks/useLayout';
import {colors, spacing} from '../../theme';

type Props = PropsWithChildren<{
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  centered?: boolean;
}>;

export function Screen({
  children,
  scroll = false,
  style,
  contentStyle,
  edges = ['top', 'left', 'right'],
  centered = true,
}: Props) {
  const {contentMaxWidth, horizontalPadding} = useLayout();

  const frameStyle: ViewStyle = {
    paddingHorizontal: horizontalPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
    ...(centered && contentMaxWidth
      ? {
          maxWidth: contentMaxWidth,
          width: '100%',
          alignSelf: 'center',
        }
      : null),
  };

  return (
    <SafeAreaView edges={edges} style={[styles.safe, style]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[frameStyle, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[frameStyle, styles.flex, contentStyle]}>{children}</View>
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
});
