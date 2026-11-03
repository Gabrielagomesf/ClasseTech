import {validateUserProfile} from '../src/services/validation/profileValidation';

describe('validateUserProfile', () => {
  const base = {
    displayName: 'Gabriela Silva',
    email: 'gabi@exemplo.com',
    jobTitle: 'analista_cadastros',
    sexo: 'feminino' as const,
    updatedAt: new Date().toISOString(),
  };

  it('accepts valid profile', () => {
    expect(validateUserProfile(base).ok).toBe(true);
  });

  it('requires full name with surname', () => {
    const result = validateUserProfile({...base, displayName: 'Gabriela'});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.displayName).toBeTruthy();
    }
  });

  it('requires cargo from catalog', () => {
    const result = validateUserProfile({...base, jobTitle: ''});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.jobTitle).toBeTruthy();
    }
  });

  it('rejects invalid email when provided', () => {
    const result = validateUserProfile({...base, email: 'invalido'});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.email).toBeTruthy();
    }
  });

  it('allows empty email', () => {
    expect(validateUserProfile({...base, email: ''}).ok).toBe(true);
  });
});
