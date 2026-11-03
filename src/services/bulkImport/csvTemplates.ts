import type {PersonType} from '../../types';

export const PF_CSV_HEADERS = [
  'nome_completo',
  'cpf',
  'data_nascimento',
  'sexo',
  'email',
  'telefone',
] as const;

export const PJ_CSV_HEADERS = [
  'cnpj',
  'razao_social',
  'nome_fantasia',
  'tipo_estabelecimento',
  'cnpj_matriz',
  'email',
  'telefone',
  'representante_nome',
  'representante_cpf',
  'representante_cargo',
] as const;

export function buildTemplateCsv(type: PersonType): string {
  if (type === 'PF') {
    const header = PF_CSV_HEADERS.join(',');
    const example =
      'Maria Silva Santos,52998224725,15/03/1990,feminino,maria@email.com,11999990000';
    return `${header}\n${example}\n`;
  }
  const header = PJ_CSV_HEADERS.join(',');
  const example =
    '11222333000181,Empresa Exemplo LTDA,Exemplo,matriz,,contato@empresa.com,1133334444,Joao Souza,52998224725,socio_administrador';
  return `${header}\n${example}\n`;
}

export function parseCsv(text: string): string[][] {
  const normalized = text.replace(/^\uFEFF/, '').trim();
  if (!normalized) {
    return [];
  }
  const lines = normalized.split(/\r?\n/).filter(line => line.trim());
  return lines.map(line => {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if ((char === ',' || char === ';') && !inQuotes) {
        cells.push(current.trim());
        current = '';
        continue;
      }
      current += char;
    }
    cells.push(current.trim());
    return cells;
  });
}
