import {z} from 'zod';
import {isValidCpf} from '../utils/cpf';
import {
  isValidBirthDateBr,
  isValidCep,
  isValidPhoneBr,
} from '../utils/date';

export const addressSchema = z.object({
  cep: z.string().refine(isValidCep, 'CEP inválido'),
  logradouro: z.string().min(1, 'Logradouro obrigatório'),
  numero: z.string().min(1, 'Número obrigatório'),
  complemento: z.string().optional().default(''),
  bairro: z.string().min(1, 'Bairro obrigatório'),
  cidade: z.string().min(1, 'Cidade obrigatória'),
  estado: z
    .string()
    .transform(value => value.toUpperCase())
    .refine(value => value.length === 2, 'UF inválida'),
});

export const personStep1Schema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, 'Informe o nome completo')
    .refine(
      value => value.split(/\s+/).length >= 2,
      'Informe nome e sobrenome',
    ),
  cpf: z.string().refine(isValidCpf, 'CPF inválido'),
  dataNascimento: z
    .string()
    .refine(isValidBirthDateBr, 'Data de nascimento inválida'),
  email: z.email('E-mail inválido'),
  telefone: z.string().refine(isValidPhoneBr, 'Telefone inválido'),
});

export const personStep2Schema = z.object({
  endereco: addressSchema,
});

export const personSchema = personStep1Schema.extend({
  endereco: addressSchema,
});

export const personSchemasByStep = {
  1: personStep1Schema,
  2: personStep2Schema,
  3: z.object({}),
} as const;
