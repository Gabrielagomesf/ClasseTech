import {initDatabase, getDatabase} from '../services/database';
import type {UserProfile} from '../types/userProfile';
import {emptyUserProfile} from '../types/userProfile';
import type {SexOption} from '../constants/catalog';

const PROFILE_ID = 1;

function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    displayName: String(row.display_name ?? ''),
    email: String(row.email ?? ''),
    jobTitle: String(row.job_title ?? ''),
    sexo: (String(row.gender ?? '') || '') as SexOption | '',
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

export async function getUserProfile(): Promise<UserProfile> {
  await initDatabase();
  const db = getDatabase();
  const result = await db.executeAsync(
    'SELECT display_name, email, job_title, gender, updated_at FROM user_profile WHERE id = ? LIMIT 1',
    [PROFILE_ID],
  );
  const rows = result.rows?._array ?? [];
  if (!rows.length) {
    return emptyUserProfile();
  }
  return rowToProfile(rows[0] as Record<string, unknown>);
}

export async function saveUserProfile(profile: UserProfile): Promise<UserProfile> {
  await initDatabase();
  const db = getDatabase();
  const updatedAt = new Date().toISOString();
  await db.executeAsync(
    `INSERT INTO user_profile (id, display_name, email, job_title, gender, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       display_name = excluded.display_name,
       email = excluded.email,
       job_title = excluded.job_title,
       gender = excluded.gender,
       updated_at = excluded.updated_at`,
    [
      PROFILE_ID,
      profile.displayName.trim(),
      profile.email.trim(),
      profile.jobTitle.trim(),
      profile.sexo || '',
      updatedAt,
    ],
  );
  return {...profile, updatedAt};
}
