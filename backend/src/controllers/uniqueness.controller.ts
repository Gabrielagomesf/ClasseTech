import type {NextFunction, Request, Response} from 'express';
import {z} from 'zod';
import {stripCnpj} from '../utils/cnpj';
import {stripCpf} from '../utils/cpf';

const bodySchema = z.object({
  type: z.enum(['CPF', 'CNPJ']),
  document: z.string().min(1, 'Documento obrigatório'),
  existing: z.array(z.string()).default([]),
  excludeId: z.string().optional(),
});

function normalize(type: 'CPF' | 'CNPJ', value: string) {
  return type === 'CPF' ? stripCpf(value) : stripCnpj(value);
}

export function validateUniqueDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = bodySchema.parse(req.body);
    const current = normalize(body.type, body.document);

    if (!current) {
      return res.status(400).json({
        ok: false,
        message: 'Documento inválido',
        errors: {
          [body.type === 'CPF' ? 'cpf' : 'cnpj']: 'Documento inválido',
        },
      });
    }

    const duplicated = body.existing.some(item => {
      const [id, doc] = item.includes('|') ? item.split('|') : ['', item];
      if (body.excludeId && id === body.excludeId) {
        return false;
      }
      return normalize(body.type, doc) === current;
    });

    if (duplicated) {
      const field = body.type === 'CPF' ? 'cpf' : 'cnpj';
      return res.status(400).json({
        ok: false,
        message: 'Documento já cadastrado',
        errors: {
          [field]: `Já existe um cadastro com este ${body.type}`,
        },
      });
    }

    return res.json({ok: true});
  } catch (error) {
    return next(error);
  }
}
