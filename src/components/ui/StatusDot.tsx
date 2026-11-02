import React from 'react';
import {StyleSheet, View} from 'react-native';
import type {DocumentationStatus} from '../../types';
import {colors} from '../../theme';

type Props = {
  status: DocumentationStatus;
  size?: number;
};

const STATUS_COLOR: Record<DocumentationStatus, string> = {
  complete: colors.success,
  pending: colors.warning,
  issue: colors.danger,
};

export function StatusDot({status, size = 10}: Props) {
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
});
