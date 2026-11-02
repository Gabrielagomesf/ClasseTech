export type AddressFormValues = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type PersonFormValues = {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
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
