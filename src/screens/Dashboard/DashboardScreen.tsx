import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, Card, EmptyState, Screen, StatusDot} from '../../components';
import {useLayout} from '../../hooks/useLayout';
import {useRegistrations} from '../../context/RegistrationsContext';
import type {MainTabParamList, RootStackParamList} from '../../types';
import {colors, spacing, typography} from '../../theme';
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
  const {statCardWidth, gridGap, scaleFont, isCompact} = useLayout();

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
        <Text style={[styles.brand, {fontSize: scaleFont(isCompact ? 22 : 26)}]}>
          Cadastro+
        </Text>
        <Text style={typography.caption}>
          Gestão inteligente de cadastros PF e PJ
        </Text>
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
          description="Comece criando o primeiro cadastro ou importe uma planilha na aba Cadastros."
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
    gap: spacing.xs,
  },
  brand: {
    ...typography.title,
    color: colors.primary,
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
    borderRadius: 999,
    marginBottom: spacing.xs,
  },
  statValue: {
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
