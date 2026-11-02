import type {NextFunction, Request, Response} from 'express';
import {companySchema, companySchemasByStep} from '../schemas/company';
import {personSchema, personSchemasByStep} from '../schemas/person';

function parseStep(value: string) {
  const step = Number(value);
  if (![1, 2, 3].includes(step)) {
    return null;
  }
  return step as 1 | 2 | 3;
}

export function validatePersonStep(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const step = parseStep(String(req.params.step));
    if (!step) {
      return res.status(400).json({ok: false, message: 'Etapa inválida'});
    }

    const data = personSchemasByStep[step].parse(req.body);
    return res.json({ok: true, step, data});
  } catch (error) {
    return next(error);
  }
}

export function validatePerson(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = personSchema.parse(req.body);
    return res.json({ok: true, data});
  } catch (error) {
    return next(error);
  }
}

export function validateCompanyStep(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const step = parseStep(String(req.params.step));
    if (!step) {
      return res.status(400).json({ok: false, message: 'Etapa inválida'});
    }

    const data = companySchemasByStep[step].parse(req.body);
    return res.json({ok: true, step, data});
  } catch (error) {
    return next(error);
  }
}

export function validateCompany(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = companySchema.parse(req.body);
    return res.json({ok: true, data});
  } catch (error) {
    return next(error);
  }
}
