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

const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  identificacao: 'Documento de identificação',
  comprovante_residencia: 'Comprovante de residência',
  complementar: 'Documento complementar',
  cartao_cnpj: 'Cartão CNPJ',
  contrato_social: 'Contrato social',
  documento_representante: 'Documento do representante',
  comprovante_endereco: 'Comprovante de endereço',
};

export function documentKindLabel(kind: DocumentKind): string {
  return DOCUMENT_KIND_LABELS[kind] ?? kind;
}
