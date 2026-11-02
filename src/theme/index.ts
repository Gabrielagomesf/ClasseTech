import {colors} from './colors';
import {radius, spacing} from './spacing';
import {typography} from './typography';

export {colors} from './colors';
export {spacing, radius} from './spacing';
export {typography} from './typography';

export const theme = {
  colors,
  spacing,
  radius,
  typography,
} as const;
