import {
  CARGO_VALUES,
  ESTABLISHMENT_VALUES,
  SEX_VALUES,
  type SexOption,
} from '../../constants/catalog';
import type {CompanyFormValues, PersonFormValues} from '../../types';
import {
  isValidBirthDateBr,
  isValidCep,
  isValidCnpj,
  isValidCpf,
  isValidPhoneBr,
  stripCnpj,
  stripCpf,
  stripDigits,
} from '../../utils';
import type {ValidationResult} from '../api/validationApi';

function fail(
  errors: Record<string, string>,
  message = 'Revise os campos destacados',
): ValidationResult {
  return {ok: false, message, errors};
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateAddress(
  endereco: PersonFormValues['endereco'],
  prefix = 'endereco',
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!isValidCep(endereco.cep)) {
    errors[`${prefix}.cep`] = 'CEP inválido';
  }
  if (!endereco.logradouro?.trim()) {
    errors[`${prefix}.logradouro`] = 'Logradouro obrigatório';
  }
  if (!endereco.numero?.trim()) {
    errors[`${prefix}.numero`] = 'Número obrigatório';
  }
  if (!endereco.bairro?.trim()) {
    errors[`${prefix}.bairro`] = 'Bairro obrigatório';
  }
  if (!endereco.cidade?.trim()) {
    errors[`${prefix}.cidade`] = 'Cidade obrigatória';
  }
  if ((endereco.estado ?? '').trim().length !== 2) {
    errors[`${prefix}.estado`] = 'UF inválida';
  }
  return errors;
}

export function validatePersonStepLocal(
  step: number,
  values: PersonFormValues,
): ValidationResult {
  if (step === 1) {
    const errors: Record<string, string> = {};
    const nome = values.nomeCompleto?.trim() ?? '';
    if (nome.length < 3) {
      errors.nomeCompleto = 'Informe o nome completo';
    } else if (nome.split(/\s+/).length < 2) {
      errors.nomeCompleto = 'Informe nome e sobrenome';
    }
    if (!isValidCpf(values.cpf)) {
      errors.cpf = 'CPF inválido';
    }
    if (!isValidBirthDateBr(values.dataNascimento)) {
      errors.dataNascimento = 'Data de nascimento inválida';
    }
    if (!values.sexo || !SEX_VALUES.has(values.sexo as SexOption)) {
      errors.sexo = 'Selecione o sexo';
    }
    if (!isValidEmail(values.email ?? '')) {
      errors.email = 'E-mail inválido';
    }
    if (!isValidPhoneBr(values.telefone)) {
      errors.telefone = 'Telefone inválido';
    }
    return Object.keys(errors).length ? fail(errors) : {ok: true};
  }

  if (step === 2) {
    const errors = validateAddress(values.endereco);
    return Object.keys(errors).length ? fail(errors) : {ok: true};
  }

  if (step === 3) {
    return {ok: true};
  }

  return {ok: true};
}

export function validateCompanyStepLocal(
  step: number,
  values: CompanyFormValues,
): ValidationResult {
  if (step === 1) {
    const errors: Record<string, string> = {
      ...validateAddress(values.endereco),
    };
    if (!isValidCnpj(values.cnpj)) {
      errors.cnpj = 'CNPJ inválido';
    }
    const razao = (values.razaoSocial ?? '').trim();
    if (razao.length < 2) {
      errors.razaoSocial = 'Informe a razão social';
    }
    if (!isValidEmail(values.email ?? '')) {
      errors.email = 'E-mail inválido';
    }
    if (!isValidPhoneBr(values.telefone)) {
      errors.telefone = 'Telefone inválido';
    }
    if (
      !values.tipoEstabelecimento ||
      !ESTABLISHMENT_VALUES.has(values.tipoEstabelecimento)
    ) {
      errors.tipoEstabelecimento = 'Selecione matriz, filial ou unidade';
    }
    if (values.tipoEstabelecimento === 'filial') {
      const matriz = stripCnpj(values.cnpjMatriz ?? '');
      if (!matriz) {
        errors.cnpjMatriz = 'Informe o CNPJ da matriz';
      } else if (!isValidCnpj(values.cnpjMatriz ?? '')) {
        errors.cnpjMatriz = 'CNPJ da matriz inválido';
      } else if (matriz === stripCnpj(values.cnpj)) {
        errors.cnpjMatriz = 'CNPJ da matriz deve ser diferente deste CNPJ';
      }
    }
    return Object.keys(errors).length ? fail(errors) : {ok: true};
  }

  if (step === 2) {
    const r = values.representante;
    const errors: Record<string, string> = {};
    const nome = r?.nomeCompleto?.trim() ?? '';
    if (nome.length < 3) {
      errors['representante.nomeCompleto'] = 'Informe o nome completo';
    } else if (nome.split(/\s+/).length < 2) {
      errors['representante.nomeCompleto'] = 'Informe nome e sobrenome';
    }
    if (!isValidCpf(r?.cpf ?? '')) {
      errors['representante.cpf'] = 'CPF inválido';
    }
    const cargo = (r?.cargo ?? '').trim();
    if (!cargo || !CARGO_VALUES.has(cargo)) {
      errors['representante.cargo'] = 'Selecione o cargo';
    }
    if (!isValidEmail(r?.email ?? '')) {
      errors['representante.email'] = 'E-mail inválido';
    }
    if (!isValidPhoneBr(r?.telefone ?? '')) {
      errors['representante.telefone'] = 'Telefone inválido';
    }
    return Object.keys(errors).length ? fail(errors) : {ok: true};
  }

  if (step === 3) {
    return {ok: true};
  }

  return {ok: true};
}

export function validateUniqueDocumentLocal(input: {
  type: 'CPF' | 'CNPJ';
  document: string;
  existing: string[];
  excludeId?: string;
}): ValidationResult {
  const normalized =
    input.type === 'CPF'
      ? stripCpf(input.document)
      : stripCnpj(input.document);

  if (!normalized) {
    return fail(
      {
        [input.type === 'CPF' ? 'cpf' : 'cnpj']: `${input.type} inválido`,
      },
      `${input.type} inválido`,
    );
  }

  const duplicated = input.existing.some(entry => {
    const [id, doc] = entry.split('|');
    if (input.excludeId && id === input.excludeId) {
      return false;
    }
    return stripDigits(doc) === stripDigits(normalized) || doc === normalized;
  });

  if (duplicated) {
    const field = input.type === 'CPF' ? 'cpf' : 'cnpj';
    return fail(
      {[field]: `Já existe um cadastro com este ${input.type}`},
      `Já existe um cadastro com este ${input.type}`,
    );
  }

  return {ok: true};
}
