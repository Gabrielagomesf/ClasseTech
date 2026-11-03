import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppIcon, Button, Card, EmptyState, Screen, StatusDot} from '../../components';
import {useLayout} from '../../hooks/useLayout';
import {useUserProfile} from '../../context/UserProfileContext';
import {useRegistrations} from '../../context/RegistrationsContext';
import {CARGO_OPTIONS, getCatalogLabel} from '../../constants/catalog';
import {getProfileGreeting} from '../../utils/profileDisplay';
import type {MainTabParamList, RootStackParamList} from '../../types';
import {colors, radius, spacing, typography} from '../../theme';
import {
  formatIsoDateBr,
  getRegistrationDisplayName,
  getRegistrationDocumentMasked,
} from '../../utils';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function DashboardScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const {stats, loading, ready} = useRegistrations();
  const {profile, initials, hasProfile} = useUserProfile();
  const {statCardWidth, gridGap, scaleFont, isCompact} = useLayout();
  const greeting = getProfileGreeting(profile.displayName);
  const cargoLabel = getCatalogLabel(CARGO_OPTIONS, profile.jobTitle, '');
  const subtitle = cargoLabel
    ? cargoLabel
    : hasProfile
      ? 'Gestão inteligente de cadastros'
      : 'Complete seu perfil em Mais → Meu perfil';

  const cards = [
    {
      label: 'Total de cadastros',
      value: String(stats.total),
      accent: colors.primary,
    },
    {
      label: 'Pessoas físicas',
      value: String(stats.pf),
      accent: colors.primaryDark,
    },
    {
      label: 'Pessoas jurídicas',
      value: String(stats.pj),
      accent: colors.secondary,
    },
    {
      label: 'Pendências',
      value: String(stats.pending),
      accent: colors.warning,
    },
  ];

  return (
    <Screen
      scroll
      contentStyle={{paddingBottom: spacing.xxxl + Math.max(insets.bottom, 8)}}>
      <View style={styles.header}>
        <View style={styles.greetingCol}>
          <Text style={[styles.greeting, {fontSize: scaleFont(isCompact ? 20 : 22)}]}>
            {greeting}
          </Text>
          <Text style={typography.caption}>{subtitle}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityLabel="Notificações"
            onPress={() =>
              navigation.navigate('Registrations', {
                documentationStatus: 'pending',
              })
            }
            style={styles.iconBtn}>
            <AppIcon name="bell-outline" size={22} color={colors.textSecondary} />
            {stats.pending > 0 ? <View style={styles.notifDot} /> : null}
          </Pressable>
          <Pressable
            accessibilityLabel="Perfil"
            onPress={() => navigation.navigate('Settings')}
            style={styles.profileBtn}>
            {hasProfile ? (
              <Text style={styles.profileInitials}>{initials}</Text>
            ) : (
              <AppIcon name="account" size={22} color={colors.white} />
            )}
          </Pressable>
        </View>
      </View>

      {!ready || loading ? (
        <ActivityIndicator color={colors.primary} style={{marginVertical: 24}} />
      ) : null}

      <View style={[styles.statsGrid, {gap: gridGap}]}>
        {cards.map(stat => (
          <Card
            key={stat.label}
            style={[
              styles.statCard,
              {width: statCardWidth, maxWidth: statCardWidth},
            ]}>
            <View style={[styles.statAccent, {backgroundColor: stat.accent}]} />
            <Text
              style={[
                styles.statValue,
                {color: stat.accent, fontSize: scaleFont(isCompact ? 24 : 28)},
              ]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </Card>
        ))}
      </View>

      <Button
        title="+ Novo cadastro"
        onPress={() => navigation.navigate('SelectPersonType')}
        style={styles.cta}
      />

      <Text style={[typography.subtitle, styles.sectionTitle]}>
        Últimos cadastros
      </Text>

      {stats.recent.length === 0 ? (
        <EmptyState
          title="Nenhum cadastro ainda"
          description="Comece criando o primeiro cadastro de pessoa física ou jurídica."
          actionLabel="Criar cadastro"
          onAction={() => navigation.navigate('SelectPersonType')}
        />
      ) : (
        stats.recent.map(item => (
          <Card
            key={item.id}
            style={styles.recentCard}
            onPress={() =>
              navigation.navigate('RegistrationDetails', {
                registrationId: item.id,
              })
            }>
            <View style={styles.recentRow}>
              <StatusDot status={item.documentationStatus} showIcon size={32} />
              <View style={styles.recentText}>
                <Text style={typography.subtitle} numberOfLines={1}>
                  {getRegistrationDisplayName(item)}
                </Text>
                <Text style={typography.caption}>
                  {item.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'} ·{' '}
                  {getRegistrationDocumentMasked(item)}
                </Text>
                <Text style={typography.caption}>
                  {formatIsoDateBr(item.createdAt)}
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingCol: {
    flex: 1,
    gap: 2,
  },
  greeting: {
    ...typography.title,
    fontSize: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  profileBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  statCard: {
    overflow: 'hidden',
    gap: spacing.xs,
  },
  statAccent: {
    width: 28,
    height: 4,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    ...typography.caption,
    lineHeight: 18,
  },
  cta: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  recentCard: {
    marginBottom: spacing.sm,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  recentText: {
    flex: 1,
    gap: 2,
  },
});
