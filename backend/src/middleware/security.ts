import cors from 'cors';
import type {Express, RequestHandler} from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const lookupRateLimit: RequestHandler = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Limite de consultas atingido. Tente novamente em breve.',
  },
});

export function applySecurity(app: Express) {
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: {policy: 'cross-origin'},
    }),
  );

  app.use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept'],
      maxAge: 600,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        ok: false,
        message: 'Muitas requisições. Aguarde um momento e tente novamente.',
      },
    }),
  );
}
