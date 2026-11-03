import {z} from 'zod';
import {isValidCnpj, stripCnpj} from '../utils/cnpj';
import {isValidCpf} from '../utils/cpf';
import {isValidPhoneBr} from '../utils/date';
import {addressSchema} from './person';

const establishmentTypeSchema = z.enum(
  ['matriz', 'filial', 'unidade', 'escritorio', 'outro'],
  {message: 'Selecione matriz, filial ou unidade'},
);

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
  cargo: z.string().trim().min(2, 'Selecione o cargo'),
  email: z.email('E-mail inválido'),
  telefone: z.string().refine(isValidPhoneBr, 'Telefone inválido'),
});

export const companyStep1Schema = z
  .object({
    cnpj: z.string().refine(isValidCnpj, 'CNPJ inválido'),
    razaoSocial: z.string().trim().min(2, 'Informe a razão social'),
    nomeFantasia: z.string().optional().default(''),
    tipoEstabelecimento: establishmentTypeSchema,
    cnpjMatriz: z.string().optional().default(''),
  situacaoCadastral: z.string().optional(),
  dataAbertura: z.string().optional(),
  naturezaJuridica: z.string().optional(),
  cnaePrincipal: z.string().optional(),
  email: z.email('E-mail inválido'),
  telefone: z.string().refine(isValidPhoneBr, 'Telefone inválido'),
    endereco: addressSchema,
  })
  .superRefine((data, ctx) => {
    if (data.tipoEstabelecimento !== 'filial') {
      return;
    }
    const matriz = stripCnpj(data.cnpjMatriz ?? '');
    if (!matriz) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o CNPJ da matriz',
        path: ['cnpjMatriz'],
      });
      return;
    }
    if (!isValidCnpj(data.cnpjMatriz ?? '')) {
      ctx.addIssue({
        code: 'custom',
        message: 'CNPJ da matriz inválido',
        path: ['cnpjMatriz'],
      });
      return;
    }
    if (matriz === stripCnpj(data.cnpj)) {
      ctx.addIssue({
        code: 'custom',
        message: 'CNPJ da matriz deve ser diferente deste CNPJ',
        path: ['cnpjMatriz'],
      });
    }
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
