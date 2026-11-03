import {buildTemplateCsv, parseCsv} from '../src/services/bulkImport/csvTemplates';
import {importRegistrationsFromCsv} from '../src/services/bulkImport/bulkImportService';

jest.mock('../src/repositories/registrationRepository', () => ({
  listDocumentKeys: jest.fn().mockResolvedValue([]),
}));

describe('bulk import csv', () => {
  it('builds PF template with header', () => {
    expect(buildTemplateCsv('PF')).toContain('nome_completo,cpf');
  });

  it('rejects invalid header', async () => {
    const result = await importRegistrationsFromCsv('a,b,c\n1,2,3', 'PF');
    expect(result.failed).toBe(1);
    expect(result.rows[0]?.ok).toBe(false);
  });

  it('parses semicolon separated values', () => {
    const rows = parseCsv('a;b\n1;2');
    expect(rows[1]).toEqual(['1', '2']);
  });
});
