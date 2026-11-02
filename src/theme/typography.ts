import {TextStyle} from 'react-native';
import {colors} from './colors';

export const typography = {
  hero: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.35,
  } satisfies TextStyle,
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  } satisfies TextStyle,
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  } satisfies TextStyle,
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  } satisfies TextStyle,
  button: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.1,
  } satisfies TextStyle,
} as const;
