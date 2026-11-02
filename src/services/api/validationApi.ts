import {http, getApiErrors} from './http';

export type ValidationResult =
  | {ok: true}
  | {ok: false; message: string; errors: Record<string, string>};

export async function validatePersonStep(
  step: number,
  payload: Record<string, unknown>,
): Promise<ValidationResult> {
  try {
    await http.post(`/validations/person/step/${step}`, payload);
    return {ok: true};
  } catch (error) {
    return {ok: false, ...getApiErrors(error)};
  }
}

export async function validateCompanyStep(
  step: number,
  payload: Record<string, unknown>,
): Promise<ValidationResult> {
  try {
    await http.post(`/validations/company/step/${step}`, payload);
    return {ok: true};
  } catch (error) {
    return {ok: false, ...getApiErrors(error)};
  }
}

export async function validateUniqueDocument(input: {
  type: 'CPF' | 'CNPJ';
  document: string;
  existing: string[];
  excludeId?: string;
}): Promise<ValidationResult> {
  try {
    await http.post('/validations/unique-document', input);
    return {ok: true};
  } catch (error) {
    return {ok: false, ...getApiErrors(error)};
  }
}
