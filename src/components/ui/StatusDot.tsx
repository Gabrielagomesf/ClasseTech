import React from 'react';
import {StyleSheet, View} from 'react-native';
import type {DocumentationStatus} from '../../types';
import {colors} from '../../theme';
import {AppIcon, type AppIconName} from './AppIcon';

type Props = {
  status: DocumentationStatus;
  size?: number;
  showIcon?: boolean;
};

const STATUS_COLOR: Record<DocumentationStatus, string> = {
  complete: colors.success,
  pending: colors.warning,
  issue: colors.danger,
};

const STATUS_ICON: Record<DocumentationStatus, AppIconName> = {
  complete: 'check',
  pending: 'alert',
  issue: 'close',
};

export function StatusDot({status, size = 10, showIcon = false}: Props) {
  if (showIcon) {
    const iconSize = Math.max(size, 28);
    return (
      <View
        style={[
          styles.iconWrap,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
            backgroundColor: STATUS_COLOR[status],
          },
        ]}>
        <AppIcon
          name={STATUS_ICON[status]}
          size={iconSize * 0.52}
          color={colors.white}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: STATUS_COLOR[status],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {},
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
