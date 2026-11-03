import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../theme';

export type AppIconName = React.ComponentProps<
  typeof MaterialCommunityIcons
>['name'];

type Props = {
  name: AppIconName;
  size?: number;
  color?: string;
};

export function AppIcon({
  name,
  size = 22,
  color = colors.textSecondary,
}: Props) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
