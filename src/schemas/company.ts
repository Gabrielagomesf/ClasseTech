import {z} from 'zod';
import {isValidCnpj} from '../utils/cnpj';
import {isValidCpf} from '../utils/cpf';
import {isValidPhoneBr} from '../utils/date';
import {stripDigits} from '../utils/masks';
import {addressSchema} from './person';

export const legalRepresentativeSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, 'Informe o nome completo')
    .refine(value => value.split(/\s+/).length >= 2, 'Informe nome e sobrenome'),
  cpf: z.string().refine(isValidCpf, 'CPF inválido'),
  cargo: z.string().trim().min(2, 'Informe o cargo'),
  email: z.email('E-mail inválido'),
  telefone: z.string().refine(isValidPhoneBr, 'Telefone inválido'),
});

export const companyStep1Schema = z.object({
  cnpj: z.string().refine(isValidCnpj, 'CNPJ inválido'),
  razaoSocial: z.string().trim().min(2, 'Informe a razão social'),
  nomeFantasia: z.string(),
  situacaoCadastral: z.string().optional(),
  dataAbertura: z.string().optional(),
  naturezaJuridica: z.string().optional(),
  cnaePrincipal: z.string().optional(),
  email: z.email('E-mail inválido'),
  telefone: z.string().refine(isValidPhoneBr, 'Telefone inválido'),
  endereco: addressSchema,
});

export const companyStep2Schema = z.object({
  representante: legalRepresentativeSchema,
});

export const companySchema = companyStep1Schema.extend({
  representante: legalRepresentativeSchema,
});

export type CompanyFormValues = z.infer<typeof companySchema>;

export const emptyCompanyValues: CompanyFormValues = {
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  situacaoCadastral: '',
  dataAbertura: '',
  naturezaJuridica: '',
  cnaePrincipal: '',
  email: '',
  telefone: '',
  endereco: {
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  },
  representante: {
    nomeCompleto: '',
    cpf: '',
    cargo: '',
    email: '',
    telefone: '',
  },
};

export function normalizeCompanyValues(
  values: CompanyFormValues,
): CompanyFormValues {
  return {
    ...values,
    telefone: stripDigits(values.telefone),
    endereco: {
      ...values.endereco,
      cep: stripDigits(values.endereco.cep),
      estado: values.endereco.estado.toUpperCase(),
    },
    representante: {
      ...values.representante,
      cpf: stripDigits(values.representante.cpf),
      telefone: stripDigits(values.representante.telefone),
    },
  };
}
