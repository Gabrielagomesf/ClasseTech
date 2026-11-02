import type {Request, Response} from 'express';
import {isValidCnpj} from '../utils/cnpj';
import {isValidCep} from '../utils/date';
import {
  fetchAddressByCep,
  fetchCompanyByCnpj,
} from '../services/brasilApi';

export async function lookupCep(req: Request, res: Response) {
  const cep = String(req.params.cep ?? '');
  if (!isValidCep(cep)) {
    return res.status(400).json({
      ok: false,
      message: 'CEP inválido',
      errors: {cep: 'CEP inválido'},
    });
  }

  try {
    const data = await fetchAddressByCep(cep);
    return res.json({ok: true, data});
  } catch {
    return res.status(502).json({
      ok: false,
      message: 'Não foi possível consultar o CEP',
    });
  }
}

export async function lookupCnpj(req: Request, res: Response) {
  const cnpj = String(req.params.cnpj ?? '');
  if (!isValidCnpj(cnpj)) {
    return res.status(400).json({
      ok: false,
      message: 'CNPJ inválido',
      errors: {cnpj: 'CNPJ inválido'},
    });
  }

  try {
    const data = await fetchCompanyByCnpj(cnpj);
    return res.json({ok: true, data});
  } catch {
    return res.status(502).json({
      ok: false,
      message: 'Não foi possível consultar o CNPJ',
    });
  }
}
