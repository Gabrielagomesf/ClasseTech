import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {DocumentationStatus, PersonType} from '../types';
import type {EstablishmentType} from '../constants/catalog';
import {ESTABLISHMENT_TYPE_OPTIONS} from '../constants/catalog';
import {AppIcon} from './ui/AppIcon';
import {Button} from './ui/Button';
import {Card} from './ui/Card';
import {PillTabs} from './ui/PillTabs';
import {colors, radius, spacing, typography} from '../theme';

export type RegistrationFiltersState = {
  type: 'ALL' | PersonType;
  status: 'ALL' | DocumentationStatus;
  establishment: 'ALL' | EstablishmentType;
};

type Props = {
  open: boolean;
  onToggle: () => void;
  filters: RegistrationFiltersState;
  onChange: (next: RegistrationFiltersState) => void;
  activeCount: number;
};

export function RegistrationFiltersPanel({
  open,
  onToggle,
  filters,
  onChange,
  activeCount,
}: Props) {
  function clearAll() {
    onChange({type: 'ALL', status: 'ALL', establishment: 'ALL'});
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{expanded: open}}
        onPress={onToggle}
        style={[styles.trigger, open && styles.triggerOpen]}>
        <View style={styles.triggerLeft}>
          <AppIcon
            name="filter-variant"
            size={20}
            color={open ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.triggerLabel, open && styles.triggerLabelOpen]}>
            Filtros avançados
          </Text>
          {activeCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeCount}</Text>
            </View>
          ) : null}
        </View>
        <AppIcon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={colors.textMuted}
        />
      </Pressable>

      {open ? (
        <Card style={styles.panel}>
          <Text style={styles.sectionLabel}>Tipo de cadastro</Text>
          <PillTabs
            value={filters.type}
            onChange={type => onChange({...filters, type})}
            options={[
              {value: 'ALL', label: 'Todos'},
              {value: 'PF', label: 'Pessoa Física'},
              {value: 'PJ', label: 'Pessoa Jurídica'},
            ]}
          />

          <Text style={styles.sectionLabel}>Documentação</Text>
          <PillTabs
            value={filters.status}
            onChange={status => onChange({...filters, status})}
            options={[
              {value: 'ALL', label: 'Todos'},
              {value: 'complete', label: 'Completa'},
              {value: 'pending', label: 'Pendente'},
              {value: 'issue', label: 'Com pendência'},
            ]}
          />

          <Text style={styles.sectionLabel}>Classificação (PJ)</Text>
          <PillTabs
            value={filters.establishment}
            onChange={establishment => onChange({...filters, establishment})}
            options={[
              {value: 'ALL', label: 'Todas'},
              ...ESTABLISHMENT_TYPE_OPTIONS.map(option => ({
                value: option.value,
                label: option.label,
              })),
            ]}
          />

          <Button
            title="Limpar filtros"
            variant="ghost"
            onPress={clearAll}
            style={styles.clearBtn}
          />
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  triggerOpen: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  triggerLabel: {
    fontWeight: '600',
    color: colors.textSecondary,
    fontSize: 14,
  },
  triggerLabelOpen: {
    color: colors.primary,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  panel: {
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    marginTop: spacing.xs,
  },
  clearBtn: {
    alignSelf: 'flex-start',
    minHeight: 40,
  },
});
