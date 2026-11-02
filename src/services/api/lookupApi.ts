import {http} from './http';

export type CepData = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

export type CnpjData = {
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

export async function lookupCep(cep: string): Promise<CepData> {
  const {data} = await http.get<{ok: boolean; data: CepData}>(
    `/lookups/cep/${cep.replace(/\D/g, '')}`,
  );
  return data.data;
}

export async function lookupCnpj(cnpj: string): Promise<CnpjData> {
  const {data} = await http.get<{ok: boolean; data: CnpjData}>(
    `/lookups/cnpj/${cnpj.replace(/[^0-9A-Za-z]/g, '')}`,
  );
  return data.data;
}
