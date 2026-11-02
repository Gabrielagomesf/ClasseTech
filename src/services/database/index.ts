import {open, type NitroSQLiteConnection} from 'react-native-nitro-sqlite';

const DB_NAME = 'cadastro_plus.db';

let db: NitroSQLiteConnection | null = null;

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    display_name TEXT NOT NULL,
    documentation_status TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_document
    ON registrations(document_number)`,
  `CREATE INDEX IF NOT EXISTS idx_registrations_type
    ON registrations(type)`,
  `CREATE INDEX IF NOT EXISTS idx_registrations_status
    ON registrations(documentation_status)`,
];

export async function initDatabase(): Promise<NitroSQLiteConnection> {
  if (db) {
    return db;
  }

  db = open({name: DB_NAME});
  for (const statement of MIGRATIONS) {
    await db.executeAsync(statement);
  }
  return db;
}

export function getDatabase(): NitroSQLiteConnection {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function clearAllRegistrations(): Promise<void> {
  const database = getDatabase();
  await database.executeAsync('DELETE FROM registrations');
}
