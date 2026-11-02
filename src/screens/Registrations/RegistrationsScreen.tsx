import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, EmptyState, Screen, StatusDot} from '../../components';
import {useRegistrations} from '../../context/RegistrationsContext';
import type {
  DocumentationStatus,
  MainTabParamList,
  PersonType,
  RootStackParamList,
} from '../../types';
import {colors, radius, spacing, typography} from '../../theme';
import {
  formatIsoDateBr,
  getRegistrationDisplayName,
  getRegistrationDocumentMasked,
} from '../../utils';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Registrations'>,
  NativeStackScreenProps<RootStackParamList>
>;

type TypeFilter = 'ALL' | PersonType;

export function RegistrationsScreen({navigation}: Props) {
  const {items, loading, refresh} = useRegistrations();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | DocumentationStatus
  >('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = query.replace(/\D/g, '');
    return items.filter(item => {
      if (typeFilter !== 'ALL' && item.type !== typeFilter) {
        return false;
      }
      if (
        statusFilter !== 'ALL' &&
        item.documentationStatus !== statusFilter
      ) {
        return false;
      }
      if (!q) {
        return true;
      }
      const name = getRegistrationDisplayName(item).toLowerCase();
      const doc = getRegistrationDocumentMasked(item);
      return (
        name.includes(q) ||
        doc.toLowerCase().includes(q) ||
        (digits && JSON.stringify(item).includes(digits))
      );
    });
  }, [items, query, typeFilter, statusFilter]);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={typography.title}>Cadastros</Text>
        <Button
          title="Filtros"
          variant="ghost"
          onPress={() => navigation.navigate('Filters', {})}
        />
      </View>

      <TextInput
        placeholder="Buscar por nome, CPF ou CNPJ"
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

      <View style={styles.tabs}>
        {(
          [
            ['ALL', 'Todos'],
            ['PF', 'Pessoa Física'],
            ['PJ', 'Pessoa Jurídica'],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            title={label}
            variant={typeFilter === value ? 'primary' : 'secondary'}
            onPress={() => setTypeFilter(value)}
            style={styles.tab}
          />
        ))}
      </View>

      <View style={styles.statusTabs}>
        {(
          [
            ['ALL', 'Todos status'],
            ['complete', 'Completa'],
            ['pending', 'Pendente'],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            title={label}
            variant={statusFilter === value ? 'primary' : 'ghost'}
            onPress={() => setStatusFilter(value)}
            style={styles.statusTab}
          />
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{marginTop: 24}} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum cadastro encontrado"
          description="Ajuste a busca/filtros ou crie um novo cadastro."
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
                <StatusDot status={item.documentationStatus} />
                <View style={styles.textCol}>
                  <Text style={typography.subtitle} numberOfLines={1}>
                    {getRegistrationDisplayName(item)}
                  </Text>
                  <Text style={typography.caption}>
                    {item.type} · {getRegistrationDocumentMasked(item)}
                  </Text>
                  <Text style={typography.caption}>
                    {formatIsoDateBr(item.createdAt)}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
          <Button
            title="Atualizar lista"
            variant="ghost"
            onPress={() => refresh()}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  search: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
    marginBottom: spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    minHeight: 40,
  },
  statusTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  statusTab: {
    minHeight: 36,
    paddingHorizontal: spacing.sm,
  },
  list: {
    flex: 1,
    gap: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
});
