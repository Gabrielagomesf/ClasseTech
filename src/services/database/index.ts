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
  `CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    display_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    job_title TEXT NOT NULL DEFAULT '',
    gender TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL
  )`,
];

const OPTIONAL_ALTER_STATEMENTS = [
  `ALTER TABLE user_profile ADD COLUMN gender TEXT NOT NULL DEFAULT ''`,
];

export async function initDatabase(): Promise<NitroSQLiteConnection> {
  if (db) {
    return db;
  }

  db = open({name: DB_NAME});
  for (const statement of MIGRATIONS) {
    await db.executeAsync(statement);
  }
  for (const statement of OPTIONAL_ALTER_STATEMENTS) {
    try {
      await db.executeAsync(statement);
    } catch {
      // Column already exists on upgraded databases.
    }
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
