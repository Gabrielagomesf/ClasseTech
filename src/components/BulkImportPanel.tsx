import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {pick, types} from '@react-native-documents/picker';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {Button} from './ui/Button';
import {Card} from './ui/Card';
import {PillTabs} from './ui/PillTabs';
import {useRegistrations} from '../context/RegistrationsContext';
import type {PersonType} from '../types';
import {colors, spacing, typography} from '../theme';
import {importRegistrationsFromCsv} from '../services/bulkImport/bulkImportService';
import {shareBulkTemplate} from '../services/bulkImport/shareTemplate';
import {showError, showSuccess} from '../utils/alerts';

export function BulkImportPanel() {
  const {save, refresh} = useRegistrations();
  const [bulkType, setBulkType] = useState<PersonType>('PF');
  const [loading, setLoading] = useState(false);
  const [lastReport, setLastReport] = useState<string | null>(null);

  async function handleDownloadTemplate() {
    await shareBulkTemplate(bulkType);
  }

  async function handleImport() {
    try {
      setLoading(true);
      setLastReport(null);
      const [file] = await pick({
        type: [types.csv, types.plainText, types.allFiles],
        allowMultiSelection: false,
      });
      if (!file?.uri) {
        return;
      }
      const csvText = await RNFS.readFile(file.uri, 'utf8');
      const summary = await importRegistrationsFromCsv(csvText, bulkType);
      if (summary.total === 0 && summary.failed === 0) {
        showError('Planilha vazia ou sem linhas de dados.');
        return;
      }
      const toSave = summary.rows
        .filter(row => row.ok && row.registration)
        .map(row => row.registration!);
      for (const registration of toSave) {
        await save(registration);
      }
      await refresh({});
      const report = `${summary.imported} importado(s), ${summary.failed} com erro.`;
      setLastReport(report);
      if (summary.imported > 0) {
        showSuccess(`Importação concluída: ${report}`);
      } else {
        showError(`Nenhuma linha importada. ${report}`);
      }
    } catch {
      showError('Não foi possível ler a planilha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card style={styles.card}>
      <Text style={typography.subtitle}>Cadastro em massa</Text>
      <Text style={typography.caption}>
        Baixe o modelo CSV, preencha CPF ou CNPJ e importe. Cada linha é validada
        antes de salvar.
      </Text>
      <PillTabs
        value={bulkType}
        onChange={setBulkType}
        options={[
          {value: 'PF', label: 'CPF (PF)'},
          {value: 'PJ', label: 'CNPJ (PJ)'},
        ]}
      />
      <View style={styles.actions}>
        <Button
          title="Baixar modelo"
          variant="secondary"
          onPress={handleDownloadTemplate}
          style={styles.flex}
          disabled={loading}
        />
        <Button
          title="Importar planilha"
          onPress={handleImport}
          style={styles.flex}
          loading={loading}
        />
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{marginTop: spacing.sm}} />
      ) : null}
      {lastReport ? (
        <Text style={styles.report}>{lastReport}</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  report: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});
