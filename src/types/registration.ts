import type {EstablishmentType, SexOption} from '../constants/catalog';

export type PersonType = 'PF' | 'PJ';

export type DocumentationStatus = 'complete' | 'pending' | 'issue';

export type Address = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type PersonData = {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  sexo?: SexOption | '';
  email: string;
  telefone: string;
  endereco: Address;
};

export type LegalRepresentative = {
  nomeCompleto: string;
  cpf: string;
  cargo: string;
  email: string;
  telefone: string;
};

export type CompanyData = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  tipoEstabelecimento?: EstablishmentType | '';
  cnpjMatriz?: string;
  situacaoCadastral?: string;
  dataAbertura?: string;
  naturezaJuridica?: string;
  cnaePrincipal?: string;
  email: string;
  telefone: string;
  endereco: Address;
  representante: LegalRepresentative;
};

export type DocumentKind =
  | 'identificacao'
  | 'comprovante_residencia'
  | 'complementar'
  | 'cartao_cnpj'
  | 'contrato_social'
  | 'documento_representante'
  | 'comprovante_endereco';

export type AttachedDocument = {
  id: string;
  kind: DocumentKind;
  name: string;
  mimeType: string;
  uri: string;
  size: number;
  createdAt: string;
};

export type Registration = {
  id: string;
  type: PersonType;
  person?: PersonData;
  company?: CompanyData;
  documents: AttachedDocument[];
  documentationStatus: DocumentationStatus;
  createdAt: string;
  updatedAt: string;
};

export const PF_REQUIRED_DOCS: DocumentKind[] = [
  'identificacao',
  'comprovante_residencia',
];

export const PJ_REQUIRED_DOCS: DocumentKind[] = [
  'cartao_cnpj',
  'contrato_social',
  'documento_representante',
  'comprovante_endereco',
];
