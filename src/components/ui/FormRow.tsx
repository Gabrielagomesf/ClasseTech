import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {useLayout} from '../../hooks/useLayout';
import {spacing} from '../../theme';

type Props = PropsWithChildren<{
  columns?: 2 | 3;
}>;

export function FormRow({children, columns = 2}: Props) {
  const {isTablet, gridGap} = useLayout();
  const items = React.Children.toArray(children).filter(Boolean);

  if (!isTablet || items.length <= 1) {
    return <View style={styles.stack}>{children}</View>;
  }

  const basis = `${Math.floor(100 / Math.min(columns, items.length))}%`;

  return (
    <View style={[styles.row, {gap: gridGap}]}>
      {items.map((child, index) => (
        <View
          key={index}
          style={[styles.cell, {flexBasis: basis, minWidth: columns === 3 ? 180 : 220}]}>
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
