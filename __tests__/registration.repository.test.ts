const mockExecuteAsync = jest.fn();

jest.mock('../src/services/database', () => ({
  getDatabase: () => ({executeAsync: mockExecuteAsync}),
}));

jest.mock('../src/services/storage/documents', () => ({
  deleteDocuments: jest.fn(async () => undefined),
}));

import {
  getRegistrationById,
  listDocumentKeys,
  listRegistrations,
  saveRegistration,
} from '../src/repositories/registrationRepository';

describe('registration repository', () => {
  beforeEach(() => {
    mockExecuteAsync.mockReset();
  });

  it('salva cadastro e lista chaves de documento', async () => {
    mockExecuteAsync.mockResolvedValueOnce({rows: {_array: []}});
    mockExecuteAsync.mockResolvedValueOnce({
      rows: {
        _array: [
          {
            id: 'repo-test-1',
            type: 'PF',
            document_number: '52998224725',
            display_name: 'Maria Souza',
            documentation_status: 'pending',
            payload: JSON.stringify({
              id: 'repo-test-1',
              type: 'PF',
              person: {
                nomeCompleto: 'Maria Souza',
                cpf: '52998224725',
              },
              documents: [],
              documentationStatus: 'pending',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            }),
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    });
    mockExecuteAsync.mockResolvedValueOnce({
      rows: {
        _array: [{id: 'repo-test-1', document_number: '52998224725'}],
      },
    });

    await saveRegistration({
      id: 'repo-test-1',
      type: 'PF',
      person: {
        nomeCompleto: 'Maria Souza',
        cpf: '529.982.247-25',
        dataNascimento: '01/01/1990',
        email: 'maria@email.com',
        telefone: '11999990000',
        endereco: {
          cep: '01000000',
          logradouro: 'Rua A',
          numero: '100',
          complemento: '',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      },
      documents: [],
      documentationStatus: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });

    const list = await listRegistrations();
    expect(list[0]?.person?.nomeCompleto).toBe('Maria Souza');

    const keys = await listDocumentKeys();
    expect(keys[0]).toBe('repo-test-1|52998224725');

    mockExecuteAsync.mockResolvedValueOnce({
      rows: {
        _array: [
          {
            payload: JSON.stringify({id: 'repo-test-1', type: 'PF'}),
          },
        ],
      },
    });
    const byId = await getRegistrationById('repo-test-1');
    expect(byId?.id).toBe('repo-test-1');
  });
});
