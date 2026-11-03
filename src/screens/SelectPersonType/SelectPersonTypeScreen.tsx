import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppIcon, Card, Screen} from '../../components';
import {useLayout} from '../../hooks/useLayout';
import type {RootStackParamList} from '../../types';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectPersonType'>;

export function SelectPersonTypeScreen({navigation}: Props) {
  const {isTablet, scaleFont} = useLayout();

  return (
    <Screen scroll>
      <Text style={[typography.title, {fontSize: scaleFont(24)}]}>
        Novo cadastro
      </Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Selecione o tipo de pessoa que deseja cadastrar.
      </Text>

      <View style={[styles.options, isTablet && styles.optionsTablet]}>
        <Card
          style={styles.option}
          onPress={() => navigation.navigate('PersonForm')}>
          <View style={styles.optionTop}>
            <View style={styles.badge}>
              <AppIcon name="account-outline" size={28} color={colors.primary} />
            </View>
            <AppIcon name="chevron-right" size={28} color={colors.textMuted} />
          </View>
          <Text style={typography.subtitle}>Pessoa Física</Text>
          <Text style={typography.caption}>
            Dados pessoais, endereço e documentos de identificação.
          </Text>
        </Card>

        <Card
          style={styles.option}
          onPress={() => navigation.navigate('CompanyForm')}>
          <View style={styles.optionTop}>
            <View style={[styles.badge, styles.badgePj]}>
              <AppIcon name="domain" size={28} color={colors.secondary} />
            </View>
            <AppIcon name="chevron-right" size={28} color={colors.textMuted} />
          </View>
          <Text style={typography.subtitle}>Pessoa Jurídica</Text>
          <Text style={typography.caption}>
            Empresa, representante legal e documentos societários.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  options: {
    gap: spacing.lg,
  },
  optionsTablet: {
    flexDirection: 'row',
  },
  option: {
    gap: spacing.sm,
    minHeight: 140,
    flex: 1,
  },
  optionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePj: {
    backgroundColor: '#E2E8F0',
  },
});
