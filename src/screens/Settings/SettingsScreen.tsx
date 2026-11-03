import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, Card, Screen} from '../../components';
import {useRegistrations} from '../../context/RegistrationsContext';
import {colors, spacing, typography} from '../../theme';
import {confirmAction, showError, showSuccess} from '../../utils/alerts';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {clearLocalData, stats, refresh} = useRegistrations();

  return (
    <Screen
      scroll
      contentStyle={{paddingBottom: spacing.xxxl + Math.max(insets.bottom, 8)}}>
      <Text style={typography.title}>Configurações</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Opções relacionadas aos cadastros PF e PJ.
      </Text>

      <Card style={styles.card}>
        <Text style={typography.subtitle}>Validação de cadastros</Text>
        <Text style={typography.caption}>
          CPF e CNPJ são validados ao salvar e na importação em massa. Documentos
          duplicados no mesmo aparelho são bloqueados automaticamente.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={typography.subtitle}>Importação em massa</Text>
        <Text style={typography.caption}>
          Use a aba Cadastros para baixar o modelo CSV (PF ou PJ) e importar várias
          linhas de uma vez. Linhas inválidas são ignoradas e você vê o resumo ao
          final.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={typography.subtitle}>Resumo local</Text>
        <Text style={typography.caption}>
          {stats.total} cadastro(s) · {stats.pf} PF · {stats.pj} PJ ·{' '}
          {stats.pending} pendência(s) de documentação
        </Text>
        <Button title="Atualizar contagem" variant="ghost" onPress={() => refresh({})} />
      </Card>

      <Card style={styles.card}>
        <Text style={typography.subtitle}>Limpar cadastros</Text>
        <Text style={typography.caption}>
          Remove todos os cadastros e anexos deste aparelho. Essa ação não pode ser
          desfeita.
        </Text>
        <Button
          title="Limpar todos os cadastros"
          variant="secondary"
          onPress={() =>
            confirmAction(
              'Limpar cadastros?',
              'Todos os cadastros e documentos serão removidos deste aparelho.',
              async () => {
                try {
                  await clearLocalData();
                  showSuccess('Cadastros removidos.');
                } catch {
                  showError('Não foi possível limpar os cadastros.');
                }
              },
              'Limpar',
            )
          }
        />
      </Card>

      <View style={styles.meta}>
        <Text style={[typography.caption, {color: colors.textMuted}]}>
          Cadastro+ · versão 1.0.0
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
    marginBottom: spacing.xxl,
  },
});
