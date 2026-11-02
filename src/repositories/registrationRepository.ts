import {getDatabase} from '../services/database';
import {deleteDocuments} from '../services/storage/documents';
import type {
  DocumentationStatus,
  PersonType,
  Registration,
} from '../types';
import {stripCnpj} from '../utils/cnpj';
import {stripCpf} from '../utils/cpf';
import {resolveDocumentationStatus} from '../utils/documentation';
import {
  getRegistrationDisplayName,
} from '../utils/display';

type RegistrationRow = {
  id: string;
  type: PersonType;
  document_number: string;
  display_name: string;
  documentation_status: DocumentationStatus;
  payload: string;
  created_at: string;
  updated_at: string;
};

export type RegistrationFilters = {
  query?: string;
  type?: PersonType | 'ALL';
  documentationStatus?: DocumentationStatus | 'ALL';
};

function mapRow(row: RegistrationRow): Registration {
  return JSON.parse(row.payload) as Registration;
}

function documentNumberOf(registration: Registration): string {
  if (registration.type === 'PF') {
    return stripCpf(registration.person?.cpf ?? '');
  }
  return stripCnpj(registration.company?.cnpj ?? '');
}

function withStatus(registration: Registration): Registration {
  return {
    ...registration,
    documentationStatus: resolveDocumentationStatus(
      registration.type,
      registration.documents,
    ),
  };
}

export async function listRegistrations(
  filters: RegistrationFilters = {},
): Promise<Registration[]> {
  const db = getDatabase();
  const clauses: string[] = [];
  const params: Array<string> = [];

  if (filters.type && filters.type !== 'ALL') {
    clauses.push('type = ?');
    params.push(filters.type);
  }

  if (filters.documentationStatus && filters.documentationStatus !== 'ALL') {
    clauses.push('documentation_status = ?');
    params.push(filters.documentationStatus);
  }

  if (filters.query?.trim()) {
    const q = `%${filters.query.trim().toLowerCase()}%`;
    clauses.push(
      '(LOWER(display_name) LIKE ? OR document_number LIKE ? OR LOWER(payload) LIKE ?)',
    );
    const digits = filters.query.replace(/\D/g, '');
    params.push(q, digits ? `%${digits}%` : q, q);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const result = await db.executeAsync<RegistrationRow>(
    `SELECT * FROM registrations ${where} ORDER BY datetime(created_at) DESC`,
    params,
  );

  return (result.rows?._array ?? []).map(mapRow);
}

export async function getRegistrationById(
  id: string,
): Promise<Registration | null> {
  const db = getDatabase();
  const result = await db.executeAsync<RegistrationRow>(
    'SELECT * FROM registrations WHERE id = ? LIMIT 1',
    [id],
  );
  const rows = result.rows?._array ?? [];
  if (!rows.length) {
    return null;
  }
  return mapRow(rows[0]);
}

export async function saveRegistration(
  registration: Registration,
): Promise<Registration> {
  const db = getDatabase();
  const ready = withStatus(registration);
  const documentNumber = documentNumberOf(ready);
  const displayName = getRegistrationDisplayName(ready);

  await db.executeAsync(
    `INSERT INTO registrations (
      id, type, document_number, display_name, documentation_status, payload, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      type = excluded.type,
      document_number = excluded.document_number,
      display_name = excluded.display_name,
      documentation_status = excluded.documentation_status,
      payload = excluded.payload,
      updated_at = excluded.updated_at`,
    [
      ready.id,
      ready.type,
      documentNumber,
      displayName,
      ready.documentationStatus,
      JSON.stringify(ready),
      ready.createdAt,
      ready.updatedAt,
    ],
  );

  return ready;
}

export async function deleteRegistration(id: string): Promise<void> {
  const existing = await getRegistrationById(id);
  if (!existing) {
    return;
  }

  await deleteDocuments(existing.documents.map(doc => doc.uri));
  const db = getDatabase();
  await db.executeAsync('DELETE FROM registrations WHERE id = ?', [id]);
}

export async function listDocumentKeys(): Promise<string[]> {
  const db = getDatabase();
  const result = await db.executeAsync<{id: string; document_number: string}>(
    'SELECT id, document_number FROM registrations',
  );
  const rows = result.rows?._array ?? [];
  return rows.map(row => `${row.id}|${row.document_number}`);
}

export async function getDashboardStats() {
  const items = await listRegistrations();
  return {
    total: items.length,
    pf: items.filter(item => item.type === 'PF').length,
    pj: items.filter(item => item.type === 'PJ').length,
    pending: items.filter(item => item.documentationStatus === 'pending')
      .length,
    recent: items.slice(0, 5),
  };
}
