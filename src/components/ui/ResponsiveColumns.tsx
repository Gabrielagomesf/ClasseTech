import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {useLayout} from '../../hooks/useLayout';
import {spacing} from '../../theme';

type Props = PropsWithChildren<{
  tabletColumns?: number;
}>;

export function ResponsiveColumns({
  children,
  tabletColumns = 2,
}: Props) {
  const {isTablet, gridGap} = useLayout();
  const items = React.Children.toArray(children).filter(Boolean);

  if (!isTablet) {
    return <View style={styles.stack}>{children}</View>;
  }

  const widthPct = `${100 / tabletColumns}%`;

  return (
    <View style={[styles.row, {gap: gridGap}]}>
      {items.map((child, index) => (
        <View
          key={index}
          style={[
            styles.cell,
            {
              flexBasis: widthPct,
              maxWidth: widthPct,
              minWidth: 280,
            },
          ]}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    flexGrow: 1,
  },
});
