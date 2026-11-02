import type {
  AttachedDocument,
  DocumentationStatus,
  DocumentKind,
  PersonType,
} from '../types';
import {PF_REQUIRED_DOCS, PJ_REQUIRED_DOCS} from '../types';

export function requiredDocsFor(type: PersonType): DocumentKind[] {
  return type === 'PF' ? PF_REQUIRED_DOCS : PJ_REQUIRED_DOCS;
}

export function resolveDocumentationStatus(
  type: PersonType,
  documents: AttachedDocument[],
): DocumentationStatus {
  const required = requiredDocsFor(type);
  const kinds = new Set(documents.map(doc => doc.kind));
  const missing = required.filter(kind => !kinds.has(kind));
  return missing.length === 0 ? 'complete' : 'pending';
}

export function documentationLabel(status: DocumentationStatus): string {
  switch (status) {
    case 'complete':
      return 'Documentação completa';
    case 'pending':
      return 'Documentação pendente';
    case 'issue':
      return 'Documentação com pendência';
  }
}
