import axios from 'axios';
import {API_BASE_URL} from '../../config/api';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export type ApiFieldErrors = Record<string, string>;

export type ApiErrorBody = {
  ok: false;
  message?: string;
  errors?: ApiFieldErrors;
};

export function getApiErrors(error: unknown): {
  message: string;
  errors: ApiFieldErrors;
} {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;
    return {
      message: data?.message ?? 'Não foi possível validar os dados',
      errors: data?.errors ?? {},
    };
  }

  return {
    message: 'Não foi possível validar os dados',
    errors: {},
  };
}
