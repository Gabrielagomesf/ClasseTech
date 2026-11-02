import {z} from 'zod';
import {isValidCnpj} from '../utils/cnpj';
import {isValidCpf} from '../utils/cpf';
import {isValidPhoneBr} from '../utils/date';
import {addressSchema} from './person';

export const legalRepresentativeSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, 'Informe o nome completo')
    .refine(
      value => value.split(/\s+/).length >= 2,
      'Informe nome e sobrenome',
    ),
  cpf: z.string().refine(isValidCpf, 'CPF inválido'),
  cargo: z.string().trim().min(2, 'Informe o cargo'),
  email: z.email('E-mail inválido'),
  telefone: z.string().refine(isValidPhoneBr, 'Telefone inválido'),
});

export const companyStep1Schema = z.object({
  cnpj: z.string().refine(isValidCnpj, 'CNPJ inválido'),
  razaoSocial: z.string().trim().min(2, 'Informe a razão social'),
  nomeFantasia: z.string().optional().default(''),
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

export const companySchemasByStep = {
  1: companyStep1Schema,
  2: companyStep2Schema,
  3: z.object({}),
} as const;
