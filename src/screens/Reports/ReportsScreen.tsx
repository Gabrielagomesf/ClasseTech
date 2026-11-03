import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, Card, Screen} from '../../components';
import {useRegistrations} from '../../context/RegistrationsContext';
import type {MainTabParamList, RootStackParamList} from '../../types';
import {colors, spacing, typography} from '../../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Reports'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ReportsScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const {items, stats} = useRegistrations();

  const complete = useMemo(
    () => items.filter(item => item.documentationStatus === 'complete').length,
    [items],
  );
  const completionRate =
    stats.total === 0 ? 0 : Math.round((complete / stats.total) * 100);

  return (
    <Screen
      scroll
      contentStyle={{paddingBottom: spacing.xxxl + Math.max(insets.bottom, 8)}}>
      <Text style={typography.title}>Relatórios</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Visão geral dos cadastros PF e PJ neste aparelho.
      </Text>

      <Card style={styles.card}>
        <Text style={styles.metricValue}>{completionRate}%</Text>
        <Text style={typography.subtitle}>Documentação completa</Text>
        <Text style={typography.caption}>
          {complete} de {stats.total} cadastro(s) com documentos obrigatórios
        </Text>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.stat}>
          <Text style={[styles.statValue, {color: colors.primary}]}>
            {stats.pf}
          </Text>
          <Text style={typography.caption}>Pessoas físicas</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={[styles.statValue, {color: colors.secondary}]}>
            {stats.pj}
          </Text>
          <Text style={typography.caption}>Pessoas jurídicas</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={[styles.statValue, {color: colors.warning}]}>
            {stats.pending}
          </Text>
          <Text style={typography.caption}>Pendências</Text>
        </Card>
      </View>

      <Card style={styles.card}>
        <Text style={typography.subtitle}>Atalhos</Text>
        <Button
          title="Ver cadastros pendentes"
          variant="secondary"
          onPress={() =>
            navigation.navigate('Registrations', {
              documentationStatus: 'pending',
            })
          }
        />
        <Button
          title="Abrir lista completa"
          variant="ghost"
          onPress={() => navigation.navigate('Registrations')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  metricValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.success,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  stat: {
    flexGrow: 1,
    minWidth: 100,
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
  },
});
