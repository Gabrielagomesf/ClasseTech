import axios from 'axios';

const client = axios.create({
  baseURL: 'https://brasilapi.com.br/api',
  timeout: 12000,
});

export type CepResponse = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

export type CnpjResponse = {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  descricao_situacao_cadastral?: string;
  data_inicio_atividade?: string;
  natureza_juridica?: string;
  cnae_fiscal_descricao?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  ddd_telefone_1?: string;
  email?: string;
};

export async function fetchAddressByCep(cep: string): Promise<CepResponse> {
  const digits = cep.replace(/\D/g, '');
  const {data} = await client.get<CepResponse>(`/cep/v1/${digits}`);
  return data;
}

export async function fetchCompanyByCnpj(cnpj: string): Promise<CnpjResponse> {
  const normalized = cnpj.replace(/[^0-9A-Za-z]/g, '');
  const {data} = await client.get<CnpjResponse>(`/cnpj/v1/${normalized}`);
  return data;
}
