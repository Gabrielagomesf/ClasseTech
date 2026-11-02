import type {CompanyFormValues, PersonFormValues} from '../types/forms';
import {stripDigits} from './masks';

export function normalizePersonValues(
  values: PersonFormValues,
): PersonFormValues {
  return {
    ...values,
    cpf: stripDigits(values.cpf),
    telefone: stripDigits(values.telefone),
    endereco: {
      ...values.endereco,
      cep: stripDigits(values.endereco.cep),
      estado: values.endereco.estado.toUpperCase(),
    },
  };
}

export function normalizeCompanyValues(
  values: CompanyFormValues,
): CompanyFormValues {
  return {
    ...values,
    telefone: stripDigits(values.telefone),
    endereco: {
      ...values.endereco,
      cep: stripDigits(values.endereco.cep),
      estado: values.endereco.estado.toUpperCase(),
    },
    representante: {
      ...values.representante,
      cpf: stripDigits(values.representante.cpf),
      telefone: stripDigits(values.representante.telefone),
    },
  };
}
