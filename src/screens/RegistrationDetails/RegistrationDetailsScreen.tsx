import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppIcon,
  Button,
  Card,
  Screen,
  SegmentedTabs,
  StatusDot,
} from '../../components';
import {useLayout} from '../../hooks/useLayout';
import {useRegistrations} from '../../context/RegistrationsContext';
import {getRegistrationById} from '../../repositories/registrationRepository';
import type {Registration, RootStackParamList} from '../../types';
import {
  CARGO_OPTIONS,
  ESTABLISHMENT_TYPE_OPTIONS,
  SEX_OPTIONS,
  getCatalogLabel,
} from '../../constants/catalog';
import {colors, radius, spacing, typography} from '../../theme';
import {
  confirmAction,
  documentKindLabel,
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
type DetailTab = 'dados' | 'documentos' | 'historico';

function FieldRow({label, value}: {label: string; value: string}) {
  const {scaleFont} = useLayout();
  return (
    <View style={styles.fieldRow}>
      <Text style={[styles.fieldLabel, {fontSize: scaleFont(12)}]}>{label}</Text>
      <Text style={[styles.fieldValue, {fontSize: scaleFont(15)}]}>{value}</Text>
    </View>
  );
}

function SectionCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={typography.subtitle}>{title}</Text>
        {onEdit ? (
          <Button
            title="Editar"
            variant="ghost"
            compact
            onPress={onEdit}
            style={styles.editBtn}
          />
        ) : null}
      </View>
      {children}
    </Card>
  );
}

export function RegistrationDetailsScreen({navigation, route}: Props) {
  const {remove} = useRegistrations();
  const {isCompact, scaleFont} = useLayout();
  const [item, setItem] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DetailTab>('dados');

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

  const history = useMemo(() => {
    if (!item) {
      return [];
    }
    const events = [
      {
        id: 'created',
        title: 'Cadastro criado',
        date: item.createdAt,
      },
      {
        id: 'updated',
        title: 'Última atualização',
        date: item.updatedAt,
      },
      ...item.documents.map(doc => ({
        id: doc.id,
        title: `Documento anexado · ${documentKindLabel(doc.kind)}`,
        date: doc.createdAt,
      })),
    ];
    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [item]);

  if (loading) {
    return (
      <Screen centered={false}>
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
  const formRoute = item.type === 'PF' ? 'PersonForm' : 'CompanyForm';

  const openEdit = (step: number) =>
    navigation.navigate(formRoute, {registrationId: item.id, step});

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text
            style={[typography.title, {fontSize: scaleFont(isCompact ? 20 : 24)}]}
            numberOfLines={2}>
            {getRegistrationDisplayName(item)}
          </Text>
          <View style={styles.statusRow}>
            <StatusDot status={item.documentationStatus} showIcon size={26} />
            <Text style={typography.caption}>
              {documentationLabel(item.documentationStatus)}
            </Text>
          </View>
        </View>
        <View style={styles.badgesCol}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </View>
          {item.type === 'PJ' && item.company?.tipoEstabelecimento ? (
            <View style={[styles.typeBadge, styles.establishmentBadge]}>
              <Text style={[styles.typeBadgeText, styles.establishmentText]}>
                {getCatalogLabel(
                  ESTABLISHMENT_TYPE_OPTIONS,
                  item.company.tipoEstabelecimento,
                )}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.tabsWrap}>
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          options={[
            {value: 'dados', label: 'Dados'},
            {value: 'documentos', label: 'Documentos'},
            {value: 'historico', label: 'Histórico'},
          ]}
        />
      </View>

      {tab === 'dados' ? (
        <View style={styles.tabContent}>
          <SectionCard title="Informações gerais" onEdit={() => openEdit(1)}>
            <FieldRow
              label="Tipo"
              value={item.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
            />
            {item.type === 'PF' && item.person ? (
              <>
                <FieldRow label="CPF" value={formatCpf(item.person.cpf)} />
                <FieldRow
                  label="Nascimento"
                  value={item.person.dataNascimento}
                />
                <FieldRow
                  label="Sexo"
                  value={getCatalogLabel(SEX_OPTIONS, item.person.sexo, '—')}
                />
                <FieldRow label="E-mail" value={item.person.email} />
                <FieldRow
                  label="Telefone"
                  value={formatPhone(item.person.telefone)}
                />
              </>
            ) : null}
            {item.type === 'PJ' && item.company ? (
              <>
                <FieldRow label="CNPJ" value={formatCnpj(item.company.cnpj)} />
                <FieldRow
                  label="Razão social"
                  value={item.company.razaoSocial}
                />
                <FieldRow
                  label="Nome fantasia"
                  value={item.company.nomeFantasia || '—'}
                />
                <FieldRow
                  label="Classificação"
                  value={getCatalogLabel(
                    ESTABLISHMENT_TYPE_OPTIONS,
                    item.company.tipoEstabelecimento,
                    '—',
                  )}
                />
                {item.company.tipoEstabelecimento === 'filial' &&
                item.company.cnpjMatriz ? (
                  <FieldRow
                    label="CNPJ matriz"
                    value={formatCnpj(item.company.cnpjMatriz)}
                  />
                ) : null}
                <FieldRow
                  label="Situação"
                  value={item.company.situacaoCadastral || '—'}
                />
                <FieldRow label="E-mail" value={item.company.email} />
                <FieldRow
                  label="Telefone"
                  value={formatPhone(item.company.telefone)}
                />
              </>
            ) : null}
          </SectionCard>

          {address ? (
            <SectionCard title="Endereço" onEdit={() => openEdit(2)}>
              <FieldRow
                label="Logradouro"
                value={`${address.logradouro}, ${address.numero}${
                  address.complemento ? ` — ${address.complemento}` : ''
                }`}
              />
              <FieldRow
                label="Bairro / Cidade"
                value={`${address.bairro} · ${address.cidade}/${address.estado}`}
              />
              <FieldRow label="CEP" value={formatCep(address.cep)} />
            </SectionCard>
          ) : null}

          {item.type === 'PJ' && item.company?.representante ? (
            <SectionCard title="Representante legal" onEdit={() => openEdit(1)}>
              <FieldRow
                label="Nome"
                value={item.company.representante.nomeCompleto}
              />
              <FieldRow
                label="CPF"
                value={formatCpf(item.company.representante.cpf)}
              />
              <FieldRow
                label="Cargo"
                value={getCatalogLabel(
                  CARGO_OPTIONS,
                  item.company.representante.cargo,
                )}
              />
              <FieldRow
                label="Contato"
                value={`${item.company.representante.email} · ${formatPhone(item.company.representante.telefone)}`}
              />
            </SectionCard>
          ) : null}
        </View>
      ) : null}

      {tab === 'documentos' ? (
        <View style={styles.tabContent}>
          <SectionCard title="Anexos" onEdit={() => openEdit(3)}>
            {item.documents.length === 0 ? (
              <Text style={typography.caption}>Nenhum documento anexado</Text>
            ) : (
              item.documents.map(doc => (
                <View key={doc.id} style={styles.docRow}>
                  <View style={styles.docIcon}>
                    <AppIcon
                      name={
                        doc.mimeType.startsWith('image/')
                          ? 'file-image-outline'
                          : 'file-pdf-box'
                      }
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.docMeta}>
                    <Text style={typography.subtitle} numberOfLines={1}>
                      {documentKindLabel(doc.kind)}
                    </Text>
                    <Text style={typography.caption} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text style={styles.docSize}>{formatFileSize(doc.size)}</Text>
                  </View>
                  <Button
                    title="Abrir"
                    variant="secondary"
                    compact
                    onPress={() => Linking.openURL(doc.uri)}
                  />
                </View>
              ))
            )}
          </SectionCard>
        </View>
      ) : null}

      {tab === 'historico' ? (
        <View style={styles.tabContent}>
          <Card style={styles.section}>
            <Text style={typography.subtitle}>Linha do tempo</Text>
            {history.map((event, index) => (
              <View key={event.id} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View style={styles.timelineDot} />
                  {index < history.length - 1 ? (
                    <View style={styles.timelineLine} />
                  ) : null}
                </View>
                <View style={styles.timelineBody}>
                  <Text style={typography.subtitle}>{event.title}</Text>
                  <Text style={typography.caption}>
                    {formatIsoDateBr(event.date)}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      <View style={[styles.actions, isCompact && styles.actionsStack]}>
        <Button
          title="Editar cadastro"
          variant="secondary"
          onPress={() => openEdit(1)}
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
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  heroText: {
    flex: 1,
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badgesCol: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  typeBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  establishmentBadge: {
    backgroundColor: colors.warningSoft,
  },
  typeBadgeText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  establishmentText: {
    color: colors.warning,
  },
  tabsWrap: {
    marginTop: spacing.sm,
  },
  tabContent: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  editBtn: {
    minHeight: 36,
    paddingHorizontal: spacing.sm,
  },
  fieldRow: {
    gap: 2,
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  fieldValue: {
    color: colors.text,
    fontWeight: '500',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docMeta: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  docSize: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  timelineRail: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
    minHeight: 28,
  },
  timelineBody: {
    flex: 1,
    gap: 2,
    paddingBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  actionsStack: {
    flexDirection: 'column',
  },
  flex: {
    flex: 1,
  },
});
