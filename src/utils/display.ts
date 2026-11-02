import type {Registration} from '../types';
import {maskCnpj} from './cnpj';
import {maskCpf} from './cpf';

export function getRegistrationDisplayName(item: Registration): string {
  if (item.type === 'PF') {
    return item.person?.nomeCompleto ?? 'Pessoa física';
  }
  return (
    item.company?.nomeFantasia ||
    item.company?.razaoSocial ||
    'Pessoa jurídica'
  );
}

export function getRegistrationDocumentMasked(item: Registration): string {
  if (item.type === 'PF') {
    return maskCpf(item.person?.cpf ?? '');
  }
  return maskCnpj(item.company?.cnpj ?? '');
}

export function formatIsoDateBr(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString('pt-BR');
}
