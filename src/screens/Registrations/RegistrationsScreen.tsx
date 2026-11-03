import React, {useEffect, useMemo, useState} from 'react';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BulkImportPanel} from '../../components/BulkImportPanel';
import {
  RegistrationFiltersPanel,
  type RegistrationFiltersState,
} from '../../components/RegistrationFiltersPanel';
import {AppIcon, Card, EmptyState, Screen, StatusDot} from '../../components';
import {useLayout} from '../../hooks/useLayout';
import {useRegistrations} from '../../context/RegistrationsContext';
import type {MainTabParamList, RootStackParamList} from '../../types';
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

const DEFAULT_FILTERS: RegistrationFiltersState = {
  type: 'ALL',
  status: 'ALL',
  establishment: 'ALL',
};

function countActiveFilters(filters: RegistrationFiltersState): number {
  let count = 0;
  if (filters.type !== 'ALL') {
    count += 1;
  }
  if (filters.status !== 'ALL') {
    count += 1;
  }
  if (filters.establishment !== 'ALL') {
    count += 1;
  }
  return count;
}

export function RegistrationsScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {scaleFont, isCompact} = useLayout();
  const {items, loading} = useRegistrations();
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<RegistrationFiltersState>(() => ({
    ...DEFAULT_FILTERS,
    status: route.params?.documentationStatus ?? 'ALL',
  }));

  useEffect(() => {
    if (route.params?.documentationStatus) {
      setFilters(current => ({
        ...current,
        status: route.params!.documentationStatus!,
      }));
      setFiltersOpen(true);
    }
  }, [route.params?.documentationStatus]);

  const activeFilterCount = countActiveFilters(filters);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = query.replace(/\D/g, '');
    return items.filter(item => {
      if (filters.type !== 'ALL' && item.type !== filters.type) {
        return false;
      }
      if (
        filters.status !== 'ALL' &&
        item.documentationStatus !== filters.status
      ) {
        return false;
      }
      if (filters.establishment !== 'ALL') {
        if (item.type !== 'PJ') {
          return false;
        }
        if (item.company?.tipoEstabelecimento !== filters.establishment) {
          return false;
        }
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
  }, [items, query, filters]);

  return (
    <Screen
      scroll
      contentStyle={{paddingBottom: spacing.xxxl + Math.max(insets.bottom, 8)}}>
      <Text style={[typography.title, {fontSize: scaleFont(isCompact ? 22 : 24)}]}>
        Cadastros
      </Text>
      <Text style={[typography.caption, styles.subtitle]}>
        {filtered.length} resultado(s) · {items.length} no total
      </Text>

      <BulkImportPanel />

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

      <RegistrationFiltersPanel
        open={filtersOpen}
        onToggle={() => setFiltersOpen(current => !current)}
        filters={filters}
        onChange={setFilters}
        activeCount={activeFilterCount}
      />

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{marginTop: 24}} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum cadastro encontrado"
          description="Ajuste a busca ou os filtros avançados."
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
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
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
  list: {
    flex: 1,
    gap: spacing.sm,
    marginTop: spacing.sm,
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
