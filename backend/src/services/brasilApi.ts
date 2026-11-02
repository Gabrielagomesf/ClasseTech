import axios from 'axios';

const client = axios.create({
  baseURL: 'https://brasilapi.com.br/api',
  timeout: 12000,
});

export async function fetchAddressByCep(cep: string) {
  const digits = cep.replace(/\D/g, '');
  const {data} = await client.get(`/cep/v1/${digits}`);
  return data;
}

export async function fetchCompanyByCnpj(cnpj: string) {
  const normalized = cnpj.replace(/[^0-9A-Za-z]/g, '');
  const {data} = await client.get(`/cnpj/v1/${normalized}`);
  return data;
}
