import * as RNFS from '@dr.pogodin/react-native-fs';
import type {AttachedDocument, DocumentKind} from '../../types';

const ROOT = `${RNFS.DocumentDirectoryPath}/cadastro_plus_docs`;

async function ensureRoot() {
  const exists = await RNFS.exists(ROOT);
  if (!exists) {
    await RNFS.mkdir(ROOT);
  }
}

function createId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function persistDocument(
  sourceUri: string,
  fileName: string,
  mimeType: string,
  size: number,
  kind: DocumentKind,
): Promise<AttachedDocument> {
  await ensureRoot();

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const id = createId();
  const dest = `${ROOT}/${id}_${safeName}`;

  const from = sourceUri.startsWith('file://')
    ? sourceUri.replace('file://', '')
    : sourceUri;

  await RNFS.copyFile(from, dest);

  return {
    id,
    kind,
    name: fileName,
    mimeType,
    uri: `file://${dest}`,
    size,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteDocument(uri: string): Promise<void> {
  const path = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
  if (await RNFS.exists(path)) {
    await RNFS.unlink(path);
  }
}

export async function deleteDocuments(uris: string[]): Promise<void> {
  await Promise.all(uris.map(uri => deleteDocument(uri)));
}

export async function clearAllStoredDocuments(): Promise<void> {
  if (await RNFS.exists(ROOT)) {
    await RNFS.unlink(ROOT);
  }
  await ensureRoot();
}
