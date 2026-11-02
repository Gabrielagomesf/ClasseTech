import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Screen} from '../../components';
import {useRegistrations} from '../../context/RegistrationsContext';
import type {RootStackParamList} from '../../types';
import {radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Filters'>;

export function FiltersScreen({navigation, route}: Props) {
  const {refresh} = useRegistrations();
  const [type, setType] = useState<'ALL' | 'PF' | 'PJ'>(
    route.params?.type ?? 'ALL',
  );
  const [status, setStatus] = useState<'ALL' | 'complete' | 'pending'>(
    route.params?.documentationStatus ?? 'ALL',
  );

  return (
    <Screen scroll>
      <Text style={typography.title}>Filtros</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Filtrar por tipo e situação da documentação.
      </Text>

      <Card style={styles.block}>
        <Text style={typography.subtitle}>Tipo de cadastro</Text>
        <View style={styles.chips}>
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
              variant={type === value ? 'primary' : 'secondary'}
              onPress={() => setType(value)}
              style={styles.chip}
            />
          ))}
        </View>
      </Card>

      <Card style={styles.block}>
        <Text style={typography.subtitle}>Documentação</Text>
        <View style={styles.chips}>
          {(
            [
              ['ALL', 'Todos'],
              ['complete', 'Completa'],
              ['pending', 'Pendente'],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              title={label}
              variant={status === value ? 'primary' : 'secondary'}
              onPress={() => setStatus(value)}
              style={styles.chip}
            />
          ))}
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Limpar"
          variant="secondary"
          onPress={async () => {
            await refresh({type: 'ALL', documentationStatus: 'ALL'});
            navigation.goBack();
          }}
          style={styles.flex}
        />
        <Button
          title="Aplicar"
          onPress={async () => {
            await refresh({type, documentationStatus: status});
            navigation.goBack();
          }}
          style={styles.flex}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  block: {
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  flex: {
    flex: 1,
  },
});
