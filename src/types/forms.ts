export type AddressFormValues = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

import type {EstablishmentType, SexOption} from '../constants/catalog';

export type PersonFormValues = {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  sexo: SexOption | '';
  email: string;
  telefone: string;
  endereco: AddressFormValues;
};

export type LegalRepresentativeFormValues = {
  nomeCompleto: string;
  cpf: string;
  cargo: string;
  email: string;
  telefone: string;
};

export type CompanyFormValues = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  tipoEstabelecimento: EstablishmentType | '';
  cnpjMatriz?: string;
  situacaoCadastral?: string;
  dataAbertura?: string;
  naturezaJuridica?: string;
  cnaePrincipal?: string;
  email: string;
  telefone: string;
  endereco: AddressFormValues;
  representante: LegalRepresentativeFormValues;
};

export const emptyPersonValues: PersonFormValues = {
  nomeCompleto: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
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
};

export const emptyCompanyValues: CompanyFormValues = {
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  tipoEstabelecimento: '',
  cnpjMatriz: '',
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
