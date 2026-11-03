import axios from 'axios';
import type {CompanyFormValues, PersonFormValues} from '../../types';
import {
  validateCompanyStepLocal,
  validatePersonStepLocal,
  validateUniqueDocumentLocal,
} from '../validation/localValidation';
import {http, getApiErrors} from './http';

export type ValidationResult =
  | {ok: true}
  | {ok: false; message: string; errors: Record<string, string>};

function isNetworkFailure(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}

export async function validatePersonStep(
  step: number,
  payload: PersonFormValues | Record<string, unknown>,
): Promise<ValidationResult> {
  try {
    await http.post(`/validations/person/step/${step}`, payload);
    return {ok: true};
  } catch (error) {
    if (isNetworkFailure(error)) {
      return validatePersonStepLocal(step, payload as PersonFormValues);
    }
    return {ok: false, ...getApiErrors(error)};
  }
}

export async function validateCompanyStep(
  step: number,
  payload: CompanyFormValues | Record<string, unknown>,
): Promise<ValidationResult> {
  try {
    await http.post(`/validations/company/step/${step}`, payload);
    return {ok: true};
  } catch (error) {
    if (isNetworkFailure(error)) {
      return validateCompanyStepLocal(step, payload as CompanyFormValues);
    }
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
    if (isNetworkFailure(error)) {
      return validateUniqueDocumentLocal(input);
    }
    return {ok: false, ...getApiErrors(error)};
  }
}

export async function checkApiHealth(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const {data} = await http.get('/health');
    return {
      ok: true,
      message: data?.status === 'ok' ? 'API online' : 'API respondeu',
    };
  } catch {
    return {
      ok: false,
      message: 'API indisponível — validações locais ativas',
    };
  }
}
