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
import {Button, Card, EmptyState, Screen, StatusDot} from '../../components';
import {useRegistrations} from '../../context/RegistrationsContext';
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
  const {stats, loading, ready} = useRegistrations();

  const cards = [
    {label: 'Total', value: String(stats.total), color: colors.primary},
    {label: 'Pessoas físicas', value: String(stats.pf), color: colors.primaryDark},
    {
      label: 'Pessoas jurídicas',
      value: String(stats.pj),
      color: colors.secondary,
    },
    {
      label: 'Pendências',
      value: String(stats.pending),
      color: colors.warning,
    },
  ];

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Cadastro+</Text>
          <Text style={typography.caption}>Olá! Gestão inteligente de cadastros</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </Pressable>
      </View>

      {!ready || loading ? (
        <ActivityIndicator color={colors.primary} style={{marginVertical: 24}} />
      ) : null}

      <View style={styles.statsGrid}>
        {cards.map(stat => (
          <Card key={stat.label} style={styles.statCard}>
            <Text style={[styles.statValue, {color: stat.color}]}>
              {stat.value}
            </Text>
            <Text style={typography.caption}>{stat.label}</Text>
          </Card>
        ))}
      </View>

      <Button
        title="+ Novo cadastro"
        onPress={() => navigation.navigate('SelectPersonType')}
        style={styles.cta}
      />

      <View style={styles.quickActions}>
        <Button
          title="Consultar cadastros"
          variant="secondary"
          onPress={() => navigation.navigate('Registrations')}
          style={styles.flex}
        />
        <Button
          title="Pendências"
          variant="secondary"
          onPress={() =>
            navigation.navigate('Registrations', undefined as never)
          }
          style={styles.flex}
        />
      </View>

      <Text style={[typography.subtitle, styles.sectionTitle]}>
        Cadastros recentes
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
              <StatusDot status={item.documentationStatus} />
              <View style={styles.recentText}>
                <Text style={typography.subtitle} numberOfLines={1}>
                  {getRegistrationDisplayName(item)}
                </Text>
                <Text style={typography.caption}>
                  {item.type} · {getRegistrationDocumentMasked(item)} ·{' '}
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
  brand: {
    ...typography.title,
    color: colors.primary,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    minWidth: 140,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  cta: {
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  flex: {
    flex: 1,
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
