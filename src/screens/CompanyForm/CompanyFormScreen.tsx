import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Controller, useForm} from 'react-hook-form';
import {
  Button,
  DocumentPickerField,
  FormField,
  Screen,
  StepIndicator,
} from '../../components';
import {useRegistrations} from '../../context/RegistrationsContext';
import {useCepLookup, useCnpjLookup} from '../../hooks';
import {listDocumentKeys} from '../../repositories/registrationRepository';
import {
  validateCompanyStep,
  validateUniqueDocument,
} from '../../services/api/validationApi';
import type {
  AttachedDocument,
  CompanyFormValues,
  DocumentKind,
  RootStackParamList,
} from '../../types';
import {emptyCompanyValues} from '../../types/forms';
import {colors, spacing, typography} from '../../theme';
import {
  applyApiErrors,
  createId,
  formatCep,
  formatCnpj,
  formatCpf,
  formatPhone,
  normalizeCompanyValues,
  resolveDocumentationStatus,
  showError,
  showSuccess,
  stripDigits,
} from '../../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'CompanyForm'>;

const STEP_LABELS = ['Empresa', 'Representante', 'Documentos'];

export function CompanyFormScreen({navigation, route}: Props) {
  const {save} = useRegistrations();
  const {lookup: lookupCnpj, loading: cnpjLoading} = useCnpjLookup();
  const {lookup: lookupCep, loading: cepLoading} = useCepLookup();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [docs, setDocs] = useState<Partial<Record<DocumentKind, AttachedDocument>>>(
    {},
  );
  const editingId = route.params?.registrationId;

  const {
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: {errors},
  } = useForm<CompanyFormValues>({
    defaultValues: emptyCompanyValues,
  });

  const documentList = useMemo(
    () => Object.values(docs).filter(Boolean) as AttachedDocument[],
    [docs],
  );

  async function validateStep(current: number) {
    clearErrors();
    const values = getValues();
    const payload =
      current === 1
        ? values
        : current === 2
          ? {representante: values.representante}
          : {};

    const result = await validateCompanyStep(current, payload);
    if (!result.ok) {
      applyApiErrors(setError, result.errors);
      if (!Object.keys(result.errors).length) {
        showError(result.message);
      }
      return false;
    }

    if (current === 1) {
      const unique = await validateUniqueDocument({
        type: 'CNPJ',
        document: values.cnpj,
        existing: await listDocumentKeys(),
        excludeId: editingId,
      });
      if (!unique.ok) {
        applyApiErrors(setError, unique.errors);
        if (!Object.keys(unique.errors).length) {
          showError(unique.message);
        }
        return false;
      }
    }

    return true;
  }

  async function handleCnpjLookup() {
    const cnpj = getValues('cnpj');
    if (!cnpj) {
      setError('cnpj', {type: 'server', message: 'Informe o CNPJ'});
      return;
    }
    const data = await lookupCnpj(cnpj);
    if (!data) {
      showError(
        'Não foi possível consultar o CNPJ. Você pode continuar preenchendo manualmente.',
      );
      return;
    }

    setValue('razaoSocial', data.razao_social ?? '');
    setValue('nomeFantasia', data.nome_fantasia ?? '');
    setValue('situacaoCadastral', data.descricao_situacao_cadastral ?? '');
    setValue('dataAbertura', data.data_inicio_atividade ?? '');
    setValue('naturezaJuridica', data.natureza_juridica ?? '');
    setValue('cnaePrincipal', data.cnae_fiscal_descricao ?? '');
    if (data.email) {
      setValue('email', data.email);
    }
    if (data.ddd_telefone_1) {
      setValue('telefone', formatPhone(stripDigits(data.ddd_telefone_1)));
    }
    if (data.cep) {
      setValue('endereco.cep', formatCep(data.cep));
    }
    setValue('endereco.logradouro', data.logradouro ?? '');
    setValue('endereco.numero', data.numero ?? '');
    setValue('endereco.complemento', data.complemento ?? '');
    setValue('endereco.bairro', data.bairro ?? '');
    setValue('endereco.cidade', data.municipio ?? '');
    setValue('endereco.estado', data.uf ?? '');
    showSuccess('Dados do CNPJ preenchidos. Revise antes de continuar.', 'Consulta OK');
  }

  async function handleCepLookup() {
    const cep = getValues('endereco.cep');
    const address = await lookupCep(cep);
    if (!address) {
      showError('Não foi possível consultar o CEP. Preencha manualmente.');
      return;
    }
    setValue('endereco.logradouro', address.street ?? '');
    setValue('endereco.bairro', address.neighborhood ?? '');
    setValue('endereco.cidade', address.city ?? '');
    setValue('endereco.estado', address.state ?? '');
  }

  async function handleContinue() {
    const ok = await validateStep(step);
    if (!ok) {
      return;
    }
    if (step < 3) {
      setStep(current => current + 1);
      return;
    }

    const required: DocumentKind[] = [
      'cartao_cnpj',
      'contrato_social',
      'documento_representante',
      'comprovante_endereco',
    ];
    const missing = required.some(kind => !docs[kind]);
    if (missing) {
      showError('Anexe todos os documentos obrigatórios da empresa.');
      return;
    }

    try {
      setSaving(true);
      const normalized = normalizeCompanyValues(getValues());
      const now = new Date().toISOString();
      await save({
        id: editingId ?? createId('pj'),
        type: 'PJ',
        company: normalized,
        documents: documentList,
        documentationStatus: resolveDocumentationStatus('PJ', documentList),
        createdAt: now,
        updatedAt: now,
      });
      showSuccess('Cadastro de pessoa jurídica salvo com sucesso.');
      navigation.navigate('MainTabs');
    } catch {
      showError('Não foi possível salvar o cadastro.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll>
      <Text style={typography.title}>Pessoa Jurídica</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Consulte o CNPJ para preencher os dados. O representante legal é
        obrigatório.
      </Text>

      <StepIndicator current={step} labels={STEP_LABELS} />

      {step === 1 && (
        <View style={styles.fields}>
          <Controller
            control={control}
            name="cnpj"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="CNPJ"
                required
                value={formatCnpj(value)}
                onBlur={onBlur}
                onChangeText={text => onChange(formatCnpj(text))}
                autoCapitalize="characters"
                placeholder="00.000.000/0000-00"
                error={errors.cnpj?.message}
              />
            )}
          />
          <Button
            title="Consultar dados do CNPJ"
            variant="secondary"
            loading={cnpjLoading}
            onPress={handleCnpjLookup}
          />
          <Controller
            control={control}
            name="razaoSocial"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Razão social"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.razaoSocial?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="nomeFantasia"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Nome fantasia"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="E-mail empresarial"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="telefone"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Telefone"
                required
                value={formatPhone(value)}
                onBlur={onBlur}
                onChangeText={text => onChange(formatPhone(text))}
                keyboardType="phone-pad"
                error={errors.telefone?.message}
              />
            )}
          />
          <Text style={typography.subtitle}>Endereço da empresa</Text>
          <Controller
            control={control}
            name="endereco.cep"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="CEP"
                required
                value={formatCep(value)}
                onBlur={onBlur}
                onChangeText={text => onChange(formatCep(text))}
                keyboardType="number-pad"
                error={errors.endereco?.cep?.message}
                rightElement={
                  <Button
                    title="Buscar"
                    variant="ghost"
                    loading={cepLoading}
                    onPress={handleCepLookup}
                  />
                }
              />
            )}
          />
          <Controller
            control={control}
            name="endereco.logradouro"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Logradouro"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.endereco?.logradouro?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="endereco.numero"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Número"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.endereco?.numero?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="endereco.complemento"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Complemento"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="endereco.bairro"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Bairro"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.endereco?.bairro?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="endereco.cidade"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Cidade"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.endereco?.cidade?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="endereco.estado"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Estado"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={text => onChange(text.toUpperCase().slice(0, 2))}
                maxLength={2}
                autoCapitalize="characters"
                error={errors.endereco?.estado?.message}
              />
            )}
          />
        </View>
      )}

      {step === 2 && (
        <View style={styles.fields}>
          <Text style={typography.subtitle}>Representante legal</Text>
          <Controller
            control={control}
            name="representante.nomeCompleto"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Nome completo"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.representante?.nomeCompleto?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="representante.cpf"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="CPF"
                required
                value={formatCpf(value)}
                onBlur={onBlur}
                onChangeText={text => onChange(formatCpf(text))}
                keyboardType="number-pad"
                error={errors.representante?.cpf?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="representante.cargo"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Cargo/função"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Sócio, Diretor..."
                error={errors.representante?.cargo?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="representante.email"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="E-mail"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.representante?.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="representante.telefone"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Telefone"
                required
                value={formatPhone(value)}
                onBlur={onBlur}
                onChangeText={text => onChange(formatPhone(text))}
                keyboardType="phone-pad"
                error={errors.representante?.telefone?.message}
              />
            )}
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.fields}>
          <DocumentPickerField
            title="Cartão CNPJ"
            kind="cartao_cnpj"
            required
            value={docs.cartao_cnpj}
            onChange={doc =>
              setDocs(current => ({...current, cartao_cnpj: doc ?? undefined}))
            }
          />
          <DocumentPickerField
            title="Contrato social"
            kind="contrato_social"
            required
            value={docs.contrato_social}
            onChange={doc =>
              setDocs(current => ({
                ...current,
                contrato_social: doc ?? undefined,
              }))
            }
          />
          <DocumentPickerField
            title="Documento do representante"
            kind="documento_representante"
            required
            value={docs.documento_representante}
            onChange={doc =>
              setDocs(current => ({
                ...current,
                documento_representante: doc ?? undefined,
              }))
            }
          />
          <DocumentPickerField
            title="Comprovante de endereço"
            kind="comprovante_endereco"
            required
            value={docs.comprovante_endereco}
            onChange={doc =>
              setDocs(current => ({
                ...current,
                comprovante_endereco: doc ?? undefined,
              }))
            }
          />
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title={step === 1 ? 'Cancelar' : 'Voltar'}
          variant="secondary"
          onPress={() => {
            if (step === 1) {
              navigation.goBack();
              return;
            }
            setStep(current => current - 1);
          }}
          style={styles.flex}
        />
        <Button
          title={step === 3 ? 'Salvar cadastro' : 'Continuar'}
          variant={step === 3 ? 'success' : 'primary'}
          loading={saving}
          onPress={handleContinue}
          style={styles.flex}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  fields: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  flex: {
    flex: 1,
  },
});
