import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Controller, useForm} from 'react-hook-form';
import {
  Button,
  DocumentPickerField,
  FormField,
  FormRow,
  Screen,
  SelectField,
  StepIndicator,
} from '../../components';
import {SEX_OPTIONS, type SexOption} from '../../constants/catalog';
import {useLayout} from '../../hooks/useLayout';
import {useRegistrations} from '../../context/RegistrationsContext';
import {useCepLookup} from '../../hooks';
import {
  getRegistrationById,
  listDocumentKeys,
} from '../../repositories/registrationRepository';
import {
  validatePersonStep,
  validateUniqueDocument,
} from '../../services/api/validationApi';
import type {
  AttachedDocument,
  DocumentKind,
  PersonFormValues,
  RootStackParamList,
} from '../../types';
import {emptyPersonValues} from '../../types/forms';
import {colors, spacing, typography} from '../../theme';
import {
  applyApiErrors,
  createId,
  formatCep,
  formatCpf,
  formatDateBr,
  formatPhone,
  normalizePersonValues,
  resolveDocumentationStatus,
  showError,
  showSuccess,
} from '../../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonForm'>;

const STEP_LABELS = ['Dados', 'Endereço', 'Documentos'];

export function PersonFormScreen({navigation, route}: Props) {
  const {formMaxWidth} = useLayout();
  const {save} = useRegistrations();
  const {lookup, loading: cepLoading} = useCepLookup();
  const [step, setStep] = useState(route.params?.step ?? 1);

  useEffect(() => {
    if (route.params?.step) {
      setStep(route.params.step);
    }
  }, [route.params?.step]);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(
    Boolean(route.params?.registrationId),
  );
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [docs, setDocs] = useState<
    Partial<Record<DocumentKind, AttachedDocument>>
  >({});
  const editingId = route.params?.registrationId;

  const {
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: {errors},
  } = useForm<PersonFormValues>({
    defaultValues: emptyPersonValues,
  });

  useEffect(() => {
    let mounted = true;
    if (!editingId) {
      setLoadingEdit(false);
      return;
    }

    (async () => {
      try {
        const data = await getRegistrationById(editingId);
        if (!mounted) {
          return;
        }
        if (!data || data.type !== 'PF' || !data.person) {
          showError('Não foi possível carregar o cadastro para edição.');
          navigation.goBack();
          return;
        }
        reset({
          ...emptyPersonValues,
          ...data.person,
          endereco: {
            ...emptyPersonValues.endereco,
            ...data.person.endereco,
          },
        });
        setCreatedAt(data.createdAt);
        const nextDocs: Partial<Record<DocumentKind, AttachedDocument>> = {};
        data.documents.forEach(doc => {
          nextDocs[doc.kind] = doc;
        });
        setDocs(nextDocs);
      } finally {
        if (mounted) {
          setLoadingEdit(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [editingId, navigation, reset]);

  const documentList = useMemo(
    () => Object.values(docs).filter(Boolean) as AttachedDocument[],
    [docs],
  );

  async function validateStep(current: number) {
    clearErrors();
    const values = getValues();

    const result = await validatePersonStep(current, values);
    if (!result.ok) {
      applyApiErrors(setError, result.errors);
      if (!Object.keys(result.errors).length) {
        showError(result.message);
      }
      return false;
    }

    if (current === 1) {
      const unique = await validateUniqueDocument({
        type: 'CPF',
        document: values.cpf,
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

  async function handleCepLookup() {
    const cep = getValues('endereco.cep');
    const address = await lookup(cep);
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
    try {
      setValidating(true);
      const ok = await validateStep(step);
      if (!ok) {
        return;
      }
      if (step < 3) {
        setStep(current => current + 1);
        return;
      }

      if (!docs.identificacao || !docs.comprovante_residencia) {
        showError('Anexe os documentos obrigatórios para continuar.');
        return;
      }

      setSaving(true);
      const normalized = normalizePersonValues(getValues());
      const now = new Date().toISOString();
      await save({
        id: editingId ?? createId('pf'),
        type: 'PF',
        person: normalized,
        documents: documentList,
        documentationStatus: resolveDocumentationStatus('PF', documentList),
        createdAt: createdAt ?? now,
        updatedAt: now,
      });
      showSuccess(
        editingId
          ? 'Cadastro atualizado com sucesso.'
          : 'Cadastro de pessoa física salvo com sucesso.',
      );
      navigation.navigate('MainTabs');
    } catch {
      showError('Não foi possível salvar o cadastro.');
    } finally {
      setValidating(false);
      setSaving(false);
    }
  }

  if (loadingEdit) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
        <Text style={[typography.caption, styles.loadingText]}>
          Carregando cadastro...
        </Text>
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      contentStyle={
        formMaxWidth
          ? {maxWidth: formMaxWidth, width: '100%', alignSelf: 'center'}
          : undefined
      }>
      <Text style={typography.title}>
        {editingId ? 'Editar pessoa física' : 'Pessoa Física'}
      </Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Campos com * são obrigatórios.
      </Text>

      <StepIndicator current={step} labels={STEP_LABELS} />

      {step === 1 && (
        <View style={styles.fields}>
          <Controller
            control={control}
            name="nomeCompleto"
            render={({field: {onChange, onBlur, value}}) => (
              <FormField
                label="Nome completo"
                required
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.nomeCompleto?.message}
                autoCapitalize="words"
              />
            )}
          />
          <Controller
            control={control}
            name="sexo"
            render={({field: {onChange, value}}) => (
              <SelectField<SexOption>
                label="Sexo"
                required
                value={value}
                options={SEX_OPTIONS}
                onChange={onChange}
                placeholder="Selecione o sexo"
                error={errors.sexo?.message}
              />
            )}
          />
          <FormRow>
            <Controller
              control={control}
              name="cpf"
              render={({field: {onChange, onBlur, value}}) => (
                <FormField
                  label="CPF"
                  required
                  value={formatCpf(value)}
                  onBlur={onBlur}
                  onChangeText={text => onChange(formatCpf(text))}
                  keyboardType="number-pad"
                  placeholder="000.000.000-00"
                  error={errors.cpf?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="dataNascimento"
              render={({field: {onChange, onBlur, value}}) => (
                <FormField
                  label="Data de nascimento"
                  required
                  value={formatDateBr(value)}
                  onBlur={onBlur}
                  onChangeText={text => onChange(formatDateBr(text))}
                  keyboardType="number-pad"
                  placeholder="DD/MM/AAAA"
                  error={errors.dataNascimento?.message}
                />
              )}
            />
          </FormRow>
          <FormRow>
            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <FormField
                  label="E-mail"
                  required
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="email@exemplo.com"
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
                  placeholder="(00) 00000-0000"
                  error={errors.telefone?.message}
                />
              )}
            />
          </FormRow>
        </View>
      )}

      {step === 2 && (
        <View style={styles.fields}>
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
                placeholder="00000-000"
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
                placeholder="Preenchido automaticamente"
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
                placeholder="Apto, sala..."
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
          <FormRow>
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
                  autoCapitalize="characters"
                  maxLength={2}
                  placeholder="UF"
                  error={errors.endereco?.estado?.message}
                />
              )}
            />
          </FormRow>
        </View>
      )}

      {step === 3 && (
        <View style={styles.fields}>
          <DocumentPickerField
            title="Documento de identificação"
            kind="identificacao"
            required
            value={docs.identificacao}
            onChange={doc =>
              setDocs(current => ({
                ...current,
                identificacao: doc ?? undefined,
              }))
            }
          />
          <DocumentPickerField
            title="Comprovante de residência"
            kind="comprovante_residencia"
            required
            value={docs.comprovante_residencia}
            onChange={doc =>
              setDocs(current => ({
                ...current,
                comprovante_residencia: doc ?? undefined,
              }))
            }
          />
          <DocumentPickerField
            title="Documento complementar"
            kind="complementar"
            value={docs.complementar}
            onChange={doc =>
              setDocs(current => ({
                ...current,
                complementar: doc ?? undefined,
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
          loading={saving || validating}
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
  loadingText: {
    marginTop: spacing.md,
    textAlign: 'center',
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
