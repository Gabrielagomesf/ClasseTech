import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Card, Screen} from '../../components';
import {useRegistrations} from '../../context/RegistrationsContext';
import {colors, spacing, typography} from '../../theme';
import {confirmAction, showSuccess} from '../../utils/alerts';

export function SettingsScreen() {
  const {clearLocalData, stats} = useRegistrations();

  return (
    <Screen scroll>
      <Text style={typography.title}>Configurações</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Informações do aplicativo e privacidade.
      </Text>

      <Card style={styles.card}>
        <Text style={typography.subtitle}>Sobre</Text>
        <Text style={typography.caption}>
          Cadastro+ gerencia cadastros de pessoas físicas e jurídicas neste
          dispositivo, sem login e sem sincronização em nuvem.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={typography.subtitle}>Privacidade</Text>
        <Text style={typography.caption}>
          São solicitados apenas os dados necessários ao cadastro. CPF e CNPJ
          aparecem parcialmente ocultos nas listagens. Documentos ficam na área
          privada do aplicativo e são removidos com o cadastro.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={typography.subtitle}>Armazenamento</Text>
        <Text style={typography.caption}>
          {stats.total} cadastro(s) no SQLite. Consultas de CEP e CNPJ usam a
          BrasilAPI e precisam de internet.
        </Text>
      </Card>

      <Button
        title="Limpar dados locais"
        variant="secondary"
        onPress={() =>
          confirmAction(
            'Limpar dados?',
            'Todos os cadastros e documentos deste aparelho serão removidos.',
            async () => {
              await clearLocalData();
              showSuccess('Dados locais removidos.');
            },
            'Limpar',
          )
        }
      />

      <View style={styles.meta}>
        <Text style={typography.caption}>Versão 1.0.0</Text>
        <Text style={[typography.caption, {color: colors.textMuted}]}>
          ClasseTech · teste técnico mobile
        </Text>
      </View>
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
  meta: {
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
});
