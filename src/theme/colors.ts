export const colors = {
  primary: '#2563EB',
  primaryDark: '#1E3A8A',
  primarySoft: '#DBEAFE',
  secondary: '#0F172A',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)',
} as const;

export type ColorToken = keyof typeof colors;
