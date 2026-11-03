import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {CatalogOption} from '../../constants/catalog';
import {colors, radius, spacing, typography} from '../../theme';
import {AppIcon} from './AppIcon';

type Props<T extends string = string> = {
  label: string;
  value: string;
  options: readonly CatalogOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
};

export function SelectField<T extends string = string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Selecione uma opção',
  required = false,
  error,
  hint,
  containerStyle,
}: Props<T>) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    return options.find(option => option.value === value)?.label;
  }, [options, value]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={typography.label}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          error ? styles.triggerError : null,
          !selectedLabel && styles.triggerPlaceholder,
        ]}>
        <Text
          style={[
            styles.triggerText,
            !selectedLabel && styles.placeholderText,
          ]}
          numberOfLines={1}>
          {selectedLabel ?? placeholder}
        </Text>
        <AppIcon name="chevron-down" size={22} color={colors.textMuted} />
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View
          style={[
            styles.sheet,
            {paddingBottom: Math.max(insets.bottom, spacing.lg)},
          ]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{label}</Text>
          <FlatList
            data={options as CatalogOption<T>[]}
            keyExtractor={item => item.value}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const active = item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={[styles.option, active && styles.optionActive]}>
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionLabel,
                        active && styles.optionLabelActive,
                      ]}>
                      {item.label}
                    </Text>
                    {item.description ? (
                      <Text style={styles.optionDescription}>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  {active ? (
                    <AppIcon name="check" size={20} color={colors.primary} />
                  ) : null}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  asterisk: {
    color: colors.danger,
    fontWeight: '700',
  },
  trigger: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  triggerError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  triggerPlaceholder: {},
  triggerText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  placeholderText: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  error: {
    color: colors.danger,
    fontSize: 12,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '70%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  sheetTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionActive: {
    backgroundColor: colors.primarySoft,
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderBottomWidth: 0,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  optionLabelActive: {
    color: colors.primary,
  },
  optionDescription: {
    ...typography.caption,
    lineHeight: 18,
  },
});
