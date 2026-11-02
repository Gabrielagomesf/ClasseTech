import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {isValidCpf} from './cpf';

describe('cpf', () => {
  it('aceita CPF válido', () => {
    assert.equal(isValidCpf('529.982.247-25'), true);
  });

  it('rejeita CPF inválido', () => {
    assert.equal(isValidCpf('111.111.111-11'), false);
  });
});
