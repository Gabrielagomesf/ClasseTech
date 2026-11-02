import {isValidCpf, stripCpf} from '../src/utils/cpf';
import {isValidCnpj, stripCnpj} from '../src/utils/cnpj';

describe('CPF', () => {
  it('valida dígitos verificadores', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('529.982.247-24')).toBe(false);
  });

  it('remove máscara', () => {
    expect(stripCpf('529.982.247-25')).toBe('52998224725');
  });
});

describe('CNPJ', () => {
  it('valida dígitos verificadores numéricos', () => {
    expect(isValidCnpj('04.252.011/0001-10')).toBe(true);
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
  });

  it('normaliza entrada', () => {
    expect(stripCnpj('04.252.011/0001-10')).toBe('04252011000110');
  });
});
