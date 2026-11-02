import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Screen, StatusDot} from '../../components';
import {useRegistrations} from '../../context/RegistrationsContext';
import {getRegistrationById} from '../../repositories/registrationRepository';
import type {Registration, RootStackParamList} from '../../types';
import {colors, spacing, typography} from '../../theme';
import {
  confirmAction,
  documentationLabel,
  formatCep,
  formatCnpj,
  formatCpf,
  formatFileSize,
  formatIsoDateBr,
  formatPhone,
  getRegistrationDisplayName,
  showError,
  showSuccess,
} from '../../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrationDetails'>;

export function RegistrationDetailsScreen({navigation, route}: Props) {
  const {remove} = useRegistrations();
  const [item, setItem] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getRegistrationById(route.params.registrationId);
        if (mounted) {
          setItem(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [route.params.registrationId]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen>
        <Text style={typography.subtitle}>Cadastro não encontrado</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  const address =
    item.type === 'PF' ? item.person?.endereco : item.company?.endereco;

  return (
    <Screen scroll>
      <Text style={typography.title}>{getRegistrationDisplayName(item)}</Text>
      <View style={styles.statusRow}>
        <StatusDot status={item.documentationStatus} />
        <Text style={typography.caption}>
          {documentationLabel(item.documentationStatus)}
        </Text>
      </View>

      <Card style={styles.section}>
        <Text style={typography.subtitle}>Informações gerais</Text>
        <Text style={typography.caption}>Tipo: {item.type}</Text>
        {item.type === 'PF' && item.person ? (
          <>
            <Text style={typography.caption}>
              CPF: {formatCpf(item.person.cpf)}
            </Text>
            <Text style={typography.caption}>
              Nascimento: {item.person.dataNascimento}
            </Text>
            <Text style={typography.caption}>E-mail: {item.person.email}</Text>
            <Text style={typography.caption}>
              Telefone: {formatPhone(item.person.telefone)}
            </Text>
          </>
        ) : null}
        {item.type === 'PJ' && item.company ? (
          <>
            <Text style={typography.caption}>
              CNPJ: {formatCnpj(item.company.cnpj)}
            </Text>
            <Text style={typography.caption}>
              Razão social: {item.company.razaoSocial}
            </Text>
            <Text style={typography.caption}>
              Nome fantasia: {item.company.nomeFantasia || '—'}
            </Text>
            <Text style={typography.caption}>
              Situação: {item.company.situacaoCadastral || '—'}
            </Text>
            <Text style={typography.caption}>E-mail: {item.company.email}</Text>
            <Text style={typography.caption}>
              Telefone: {formatPhone(item.company.telefone)}
            </Text>
          </>
        ) : null}
      </Card>

      {address ? (
        <Card style={styles.section}>
          <Text style={typography.subtitle}>Endereço</Text>
          <Text style={typography.caption}>
            {address.logradouro}, {address.numero}
            {address.complemento ? ` — ${address.complemento}` : ''}
          </Text>
          <Text style={typography.caption}>
            {address.bairro} · {address.cidade}/{address.estado}
          </Text>
          <Text style={typography.caption}>CEP: {formatCep(address.cep)}</Text>
        </Card>
      ) : null}

      {item.type === 'PJ' && item.company?.representante ? (
        <Card style={styles.section}>
          <Text style={typography.subtitle}>Representante legal</Text>
          <Text style={typography.caption}>
            {item.company.representante.nomeCompleto}
          </Text>
          <Text style={typography.caption}>
            CPF: {formatCpf(item.company.representante.cpf)}
          </Text>
          <Text style={typography.caption}>
            Cargo: {item.company.representante.cargo}
          </Text>
          <Text style={typography.caption}>
            {item.company.representante.email} ·{' '}
            {formatPhone(item.company.representante.telefone)}
          </Text>
        </Card>
      ) : null}

      <Card style={styles.section}>
        <Text style={typography.subtitle}>Documentos</Text>
        {item.documents.length === 0 ? (
          <Text style={typography.caption}>Nenhum documento anexado</Text>
        ) : (
          item.documents.map(doc => (
            <View key={doc.id} style={styles.docRow}>
              <View style={styles.docMeta}>
                <Text style={typography.caption} numberOfLines={1}>
                  {doc.name}
                </Text>
                <Text style={styles.docSize}>{formatFileSize(doc.size)}</Text>
              </View>
              <Button
                title="Abrir"
                variant="ghost"
                onPress={() => Linking.openURL(doc.uri)}
              />
            </View>
          ))
        )}
      </Card>

      <Text style={typography.caption}>
        Criado em {formatIsoDateBr(item.createdAt)} · Atualizado em{' '}
        {formatIsoDateBr(item.updatedAt)}
      </Text>

      <View style={styles.actions}>
        <Button
          title="Editar"
          variant="secondary"
          onPress={() =>
            navigation.navigate(
              item.type === 'PF' ? 'PersonForm' : 'CompanyForm',
              {registrationId: item.id},
            )
          }
          style={styles.flex}
        />
        <Button
          title="Excluir"
          variant="secondary"
          onPress={() =>
            confirmAction(
              'Excluir cadastro?',
              'Os documentos associados também serão removidos.',
              async () => {
                try {
                  await remove(item.id);
                  showSuccess('Cadastro excluído.');
                  navigation.goBack();
                } catch {
                  showError('Não foi possível excluir o cadastro.');
                }
              },
              'Excluir',
            )
          }
          style={styles.flex}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  docMeta: {
    flex: 1,
    gap: 2,
  },
  docSize: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  flex: {
    flex: 1,
  },
});
