import {listDocumentKeys} from '../../repositories/registrationRepository';
import type {PersonType, Registration} from '../../types';
import {emptyCompanyValues, emptyPersonValues} from '../../types/forms';
import {
  validateCompanyStepLocal,
  validatePersonStepLocal,
  validateUniqueDocumentLocal,
} from '../validation/localValidation';
import {
  PF_CSV_HEADERS,
  PJ_CSV_HEADERS,
  parseCsv,
} from './csvTemplates';
import {createId, normalizeCompanyValues, normalizePersonValues} from '../../utils';

export type BulkImportRowResult = {
  line: number;
  ok: boolean;
  message?: string;
  registration?: Registration;
};

export type BulkImportSummary = {
  type: PersonType;
  total: number;
  imported: number;
  failed: number;
  rows: BulkImportRowResult[];
};

function rowToRecord(headers: readonly string[], cells: string[]) {
  const record: Record<string, string> = {};
  headers.forEach((header, index) => {
    record[header] = cells[index]?.trim() ?? '';
  });
  return record;
}

function headersMatch(
  headerRow: string[],
  expected: readonly string[],
): boolean {
  const normalized = headerRow.map(value => value.trim().toLowerCase());
  return expected.every((header, index) => normalized[index] === header);
}

export async function importRegistrationsFromCsv(
  csvText: string,
  type: PersonType,
): Promise<BulkImportSummary> {
  const rows = parseCsv(csvText);
  const expectedHeaders = type === 'PF' ? PF_CSV_HEADERS : PJ_CSV_HEADERS;
  const results: BulkImportRowResult[] = [];

  if (rows.length === 0) {
    return {type, total: 0, imported: 0, failed: 0, rows: []};
  }

  const [headerRow, ...dataRows] = rows;
  if (!headersMatch(headerRow, expectedHeaders)) {
    return {
      type,
      total: 0,
      imported: 0,
      failed: 1,
      rows: [
        {
          line: 1,
          ok: false,
          message: `Cabeçalho inválido. Use: ${expectedHeaders.join(', ')}`,
        },
      ],
    };
  }

  const existingDocs = await listDocumentKeys();
  const batchCpfs = new Set<string>();
  const batchCnpjs = new Set<string>();
  let imported = 0;

  for (let index = 0; index < dataRows.length; index += 1) {
    const line = index + 2;
    const record = rowToRecord(expectedHeaders, dataRows[index]);
    if (Object.values(record).every(value => !value)) {
      continue;
    }

    if (type === 'PF') {
      const personValues = {
        ...emptyPersonValues,
        nomeCompleto: record.nome_completo,
        cpf: record.cpf,
        dataNascimento: record.data_nascimento,
        sexo: record.sexo as typeof emptyPersonValues.sexo,
        email: record.email,
        telefone: record.telefone,
      };
      const normalized = normalizePersonValues(personValues);
      const validation = validatePersonStepLocal(1, normalized);
      if (!validation.ok) {
        const firstError = Object.values(validation.errors)[0];
        results.push({line, ok: false, message: firstError ?? validation.message});
        continue;
      }
      const cpfKey = normalized.cpf;
      if (batchCpfs.has(cpfKey)) {
        results.push({line, ok: false, message: 'CPF duplicado na planilha'});
        continue;
      }
      batchCpfs.add(cpfKey);
      const unique = validateUniqueDocumentLocal({
        type: 'CPF',
        document: normalized.cpf,
        existing: existingDocs,
      });
      if (!unique.ok) {
        results.push({
          line,
          ok: false,
          message: unique.message ?? 'CPF já cadastrado',
        });
        continue;
      }
      const now = new Date().toISOString();
      const registration: Registration = {
        id: createId('pf'),
        type: 'PF',
        person: normalized,
        documents: [],
        documentationStatus: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      existingDocs.push(`${registration.id}|${normalized.cpf}`);
      imported += 1;
      results.push({line, ok: true, registration});
      continue;
    }

    const companyValues = {
      ...emptyCompanyValues,
      cnpj: record.cnpj,
      razaoSocial: record.razao_social,
      nomeFantasia: record.nome_fantasia,
      tipoEstabelecimento:
        record.tipo_estabelecimento as typeof emptyCompanyValues.tipoEstabelecimento,
      cnpjMatriz: record.cnpj_matriz,
      email: record.email,
      telefone: record.telefone,
      representante: {
        ...emptyCompanyValues.representante,
        nomeCompleto: record.representante_nome,
        cpf: record.representante_cpf,
        cargo: record.representante_cargo,
        email: record.email,
        telefone: record.telefone,
      },
    };
    const normalized = normalizeCompanyValues(companyValues);
    const step1 = validateCompanyStepLocal(1, normalized);
    if (!step1.ok) {
      const firstError = Object.values(step1.errors)[0];
      results.push({line, ok: false, message: firstError ?? step1.message});
      continue;
    }
    const step2 = validateCompanyStepLocal(2, normalized);
    if (!step2.ok) {
      const firstError = Object.values(step2.errors)[0];
      results.push({line, ok: false, message: firstError ?? step2.message});
      continue;
    }
    const cnpjKey = normalized.cnpj;
    if (batchCnpjs.has(cnpjKey)) {
      results.push({line, ok: false, message: 'CNPJ duplicado na planilha'});
      continue;
    }
    batchCnpjs.add(cnpjKey);
    const unique = validateUniqueDocumentLocal({
      type: 'CNPJ',
      document: normalized.cnpj,
      existing: existingDocs,
    });
    if (!unique.ok) {
      results.push({
        line,
        ok: false,
        message: unique.message ?? 'CNPJ já cadastrado',
      });
      continue;
    }
    const now = new Date().toISOString();
    const registration: Registration = {
      id: createId('pj'),
      type: 'PJ',
      company: normalized,
      documents: [],
      documentationStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    existingDocs.push(`${registration.id}|${normalized.cnpj}`);
    imported += 1;
    results.push({line, ok: true, registration});
  }

  const failed = results.filter(row => !row.ok).length;
  return {
    type,
    total: results.length,
    imported,
    failed,
    rows: results,
  };
}
