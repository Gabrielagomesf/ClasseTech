import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Card, Screen} from '../../components';
import type {RootStackParamList} from '../../types';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectPersonType'>;

export function SelectPersonTypeScreen({navigation}: Props) {
  return (
    <Screen scroll>
      <Text style={typography.title}>Novo cadastro</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Selecione o tipo de pessoa que deseja cadastrar.
      </Text>

      <Card
        style={styles.option}
        onPress={() => navigation.navigate('PersonForm')}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PF</Text>
        </View>
        <View style={styles.optionText}>
          <Text style={typography.subtitle}>Pessoa Física</Text>
          <Text style={typography.caption}>
            Dados pessoais, endereço e documentos de identificação.
          </Text>
        </View>
      </Card>

      <Card
        style={styles.option}
        onPress={() => navigation.navigate('CompanyForm')}>
        <View style={[styles.badge, styles.badgePj]}>
          <Text style={[styles.badgeText, styles.badgeTextPj]}>PJ</Text>
        </View>
        <View style={styles.optionText}>
          <Text style={typography.subtitle}>Pessoa Jurídica</Text>
          <Text style={typography.caption}>
            Empresa, representante legal e documentos societários.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePj: {
    backgroundColor: '#E2E8F0',
  },
  badgeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  badgeTextPj: {
    color: colors.secondary,
  },
  optionText: {
    flex: 1,
    gap: spacing.xs,
  },
});
