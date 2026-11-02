import {personStep1Schema, personStep2Schema} from '../src/schemas/person';
import {companyStep1Schema, companyStep2Schema} from '../src/schemas/company';

describe('person schemas', () => {
  it('valida etapa 1 com dados corretos', () => {
    const result = personStep1Schema.safeParse({
      nomeCompleto: 'Maria Silva',
      cpf: '529.982.247-25',
      dataNascimento: '10/05/1990',
      email: 'maria@email.com',
      telefone: '(11) 98888-7777',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita CPF inválido', () => {
    const result = personStep1Schema.safeParse({
      nomeCompleto: 'Maria Silva',
      cpf: '111.111.111-11',
      dataNascimento: '10/05/1990',
      email: 'maria@email.com',
      telefone: '(11) 98888-7777',
    });
    expect(result.success).toBe(false);
  });

  it('valida endereço', () => {
    const result = personStep2Schema.safeParse({
      endereco: {
        cep: '01310-100',
        logradouro: 'Av Paulista',
        numero: '1000',
        complemento: '',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    });
    expect(result.success).toBe(true);
  });
});

describe('company schemas', () => {
  it('valida CNPJ e empresa', () => {
    const result = companyStep1Schema.safeParse({
      cnpj: '04.252.011/0001-10',
      razaoSocial: 'Empresa Exemplo LTDA',
      nomeFantasia: 'Exemplo',
      email: 'contato@exemplo.com',
      telefone: '(11) 4000-0000',
      endereco: {
        cep: '01310100',
        logradouro: 'Av Paulista',
        numero: '1000',
        complemento: '',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    });
    expect(result.success).toBe(true);
  });

  it('exige representante legal', () => {
    const result = companyStep2Schema.safeParse({
      representante: {
        nomeCompleto: 'João Souza',
        cpf: '529.982.247-25',
        cargo: 'Sócio',
        email: 'joao@email.com',
        telefone: '(11) 99999-0000',
      },
    });
    expect(result.success).toBe(true);
  });
});
