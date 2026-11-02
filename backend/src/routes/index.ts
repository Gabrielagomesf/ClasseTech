import {Router} from 'express';
import {
  validateCompany,
  validateCompanyStep,
  validatePerson,
  validatePersonStep,
} from '../controllers/validation.controller';
import {lookupCep, lookupCnpj} from '../controllers/lookup.controller';
import {validateUniqueDocument} from '../controllers/uniqueness.controller';
import {lookupRateLimit} from '../middleware/security';

export const routes = Router();

routes.get('/health', (_req, res) => {
  res.json({ok: true, service: 'cadastro-plus-api'});
});

routes.post('/validations/person/step/:step', validatePersonStep);
routes.post('/validations/person', validatePerson);
routes.post('/validations/company/step/:step', validateCompanyStep);
routes.post('/validations/company', validateCompany);
routes.post('/validations/unique-document', validateUniqueDocument);

routes.get('/lookups/cep/:cep', lookupRateLimit, lookupCep);
routes.get('/lookups/cnpj/:cnpj', lookupRateLimit, lookupCnpj);
