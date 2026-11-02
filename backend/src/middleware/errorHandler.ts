import type {NextFunction, Request, Response} from 'express';
import {ZodError} from 'zod';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of error.issues) {
      const path = issue.path.join('.') || '_form';
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }

    return res.status(400).json({
      ok: false,
      message: 'Dados inválidos',
      errors: fieldErrors,
    });
  }

  if (error instanceof Error) {
    return res.status(500).json({
      ok: false,
      message: error.message || 'Erro interno',
    });
  }

  return res.status(500).json({
    ok: false,
    message: 'Erro interno',
  });
}
