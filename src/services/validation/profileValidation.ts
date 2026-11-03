import {
  CARGO_VALUES,
  SEX_VALUES,
  type SexOption,
} from '../../constants/catalog';
import type {UserProfile} from '../../types/userProfile';
import type {ValidationResult} from '../api/validationApi';

function fail(errors: Record<string, string>, message?: string): ValidationResult {
  return {
    ok: false,
    message: message ?? 'Revise os campos do perfil',
    errors,
  };
}

function isValidEmail(value: string): boolean {
  if (!value.trim()) {
    return true;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateUserProfile(profile: UserProfile): ValidationResult {
  const errors: Record<string, string> = {};
  const name = profile.displayName.trim();

  if (!name) {
    errors.displayName = 'Informe seu nome';
  } else if (name.length < 3) {
    errors.displayName = 'Nome muito curto';
  } else if (name.split(/\s+/).length < 2) {
    errors.displayName = 'Informe nome e sobrenome';
  }

  if (!isValidEmail(profile.email)) {
    errors.email = 'E-mail inválido';
  }

  if (!profile.jobTitle || !CARGO_VALUES.has(profile.jobTitle)) {
    errors.jobTitle = 'Selecione seu cargo/função';
  }

  if (profile.sexo && !SEX_VALUES.has(profile.sexo as SexOption)) {
    errors.sexo = 'Selecione uma opção válida';
  }

  return Object.keys(errors).length ? fail(errors) : {ok: true};
}
