import React, {useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Card, EmptyState, PillTabs, Screen, StatusDot} from '../../components';
import {useRegistrations} from '../../context/RegistrationsContext';
import type {DocumentationStatus, MainTabParamList, RootStackParamList} from '../../types';
import {colors, spacing, typography} from '../../theme';
import {
  documentationLabel,
  getRegistrationDisplayName,
  getRegistrationDocumentMasked,
} from '../../utils';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Documents'>,
  NativeStackScreenProps<RootStackParamList>
>;

type StatusFilter = 'ALL' | DocumentationStatus;

export function DocumentsScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const {items, loading, stats} = useRegistrations();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const filtered = useMemo(() => {
    if (statusFilter === 'ALL') {
      return items;
    }
    return items.filter(item => item.documentationStatus === statusFilter);
  }, [items, statusFilter]);

  return (
    <Screen
      scroll
      contentStyle={{paddingBottom: spacing.xxxl + Math.max(insets.bottom, 8)}}>
      <Text style={typography.title}>Documentos</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        {stats.pending} pendência(s) · {stats.total} cadastro(s) no total
      </Text>

      <PillTabs
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          {value: 'ALL', label: 'Todos'},
          {value: 'pending', label: 'Pendentes'},
          {value: 'complete', label: 'Completos'},
        ]}
      />

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{marginTop: spacing.xxl}} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum documento listado"
          description="Os anexos aparecem aqui conforme você cadastra pessoas e empresas."
          actionLabel="+ Novo cadastro"
          onAction={() => navigation.navigate('SelectPersonType')}
        />
      ) : (
        <View style={styles.list}>
          {filtered.map(item => (
            <Card
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('RegistrationDetails', {
                  registrationId: item.id,
                })
              }>
              <View style={styles.row}>
                <StatusDot status={item.documentationStatus} showIcon size={32} />
                <View style={styles.textCol}>
                  <Text style={typography.subtitle} numberOfLines={1}>
                    {getRegistrationDisplayName(item)}
                  </Text>
                  <Text style={typography.caption}>
                    {item.type} · {getRegistrationDocumentMasked(item)}
                  </Text>
                  <Text style={[typography.caption, styles.statusText]}>
                    {documentationLabel(item.documentationStatus)}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  statusText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
