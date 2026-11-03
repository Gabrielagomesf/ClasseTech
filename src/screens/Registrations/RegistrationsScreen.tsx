import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AppIcon,
  Card,
  EmptyState,
  PillTabs,
  Screen,
  StatusDot,
} from '../../components';
import {useLayout} from '../../hooks/useLayout';
import {useRegistrations} from '../../context/RegistrationsContext';
import type {
  DocumentationStatus,
  MainTabParamList,
  PersonType,
  RootStackParamList,
} from '../../types';
import {
  ESTABLISHMENT_TYPE_OPTIONS,
  getCatalogLabel,
} from '../../constants/catalog';
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

export function RegistrationsScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {scaleFont, isCompact} = useLayout();
  const {items, loading} = useRegistrations();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | DocumentationStatus
  >(route.params?.documentationStatus ?? 'ALL');

  useEffect(() => {
    if (route.params?.documentationStatus) {
      setStatusFilter(route.params.documentationStatus);
    }
  }, [route.params?.documentationStatus]);

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
    <Screen
      scroll
      contentStyle={{paddingBottom: spacing.xxxl + Math.max(insets.bottom, 8)}}>
      <View style={styles.header}>
        <Text style={[typography.title, {fontSize: scaleFont(isCompact ? 22 : 24)}]}>
          Cadastros
        </Text>
        <Pressable
          accessibilityLabel="Filtros"
          onPress={() =>
            navigation.navigate('Filters', {
              type: typeFilter === 'ALL' ? undefined : typeFilter,
              documentationStatus:
                statusFilter === 'ALL' || statusFilter === 'issue'
                  ? undefined
                  : statusFilter,
            })
          }
          style={styles.filterBtn}>
          <AppIcon name="filter-variant" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <AppIcon name="magnify" size={22} color={colors.textMuted} />
        <TextInput
          placeholder="Buscar por nome, CPF ou CNPJ"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
      </View>

      <PillTabs
        value={typeFilter}
        onChange={setTypeFilter}
        options={[
          {value: 'ALL', label: 'Todos'},
          {value: 'PF', label: 'PF'},
          {value: 'PJ', label: 'PJ'},
        ]}
      />

      {statusFilter !== 'ALL' ? (
        <View style={styles.activeFilter}>
          <Text style={styles.activeFilterText}>
            Filtro:{' '}
            {statusFilter === 'pending' ? 'Pendentes' : 'Documentação completa'}
          </Text>
          <Pressable onPress={() => setStatusFilter('ALL')}>
            <Text style={styles.clearFilter}>Limpar</Text>
          </Pressable>
        </View>
      ) : null}

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
                <StatusDot status={item.documentationStatus} showIcon size={32} />
                <View style={styles.textCol}>
                  <Text style={typography.subtitle} numberOfLines={1}>
                    {getRegistrationDisplayName(item)}
                  </Text>
                  <Text style={typography.caption}>
                    {item.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    {item.type === 'PJ' && item.company?.tipoEstabelecimento
                      ? ` · ${getCatalogLabel(
                          ESTABLISHMENT_TYPE_OPTIONS,
                          item.company.tipoEstabelecimento,
                        )}`
                      : ''}{' '}
                    · {getRegistrationDocumentMasked(item)}
                  </Text>
                  <Text style={typography.caption}>
                    {formatIsoDateBr(item.createdAt)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  search: {
    flex: 1,
    minHeight: 50,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  activeFilterText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  clearFilter: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  list: {
    flex: 1,
    gap: spacing.sm,
    marginTop: spacing.lg,
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
