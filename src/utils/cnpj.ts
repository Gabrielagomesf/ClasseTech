/** Aceita CNPJ numérico e o formato alfanumérico. */
const CNPJ_WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

export function stripCnpj(value: string): string {
  return value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
}

function charValue(char: string): number {
  const code = char.charCodeAt(0);
  if (code >= 48 && code <= 57) {
    return code - 48;
  }
  if (code >= 65 && code <= 90) {
    return code - 48; // A=17 ... conforme especificação alfanumérica
  }
  return 0;
}

export function formatCnpj(value: string): string {
  const raw = stripCnpj(value).slice(0, 14);
  return raw
    .replace(/^([0-9A-Z]{2})([0-9A-Z])/, '$1.$2')
    .replace(/^([0-9A-Z]{2})\.([0-9A-Z]{3})([0-9A-Z])/, '$1.$2.$3')
    .replace(/\.([0-9A-Z]{3})([0-9A-Z])/, '.$1/$2')
    .replace(/([0-9A-Z]{4})([0-9A-Z]{1,2})$/, '$1-$2');
}

export function maskCnpj(value: string): string {
  const raw = stripCnpj(value);
  if (raw.length < 8) {
    return formatCnpj(value);
  }
  return `**.***.***/${raw.slice(8, 12)}-**`;
}

function calcCheckDigit(base: string, weights: number[]): number {
  const total = base
    .split('')
    .reduce((sum, char, index) => sum + charValue(char) * weights[index], 0);
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCnpj(value: string): boolean {
  const cnpj = stripCnpj(value);
  if (cnpj.length !== 14) {
    return false;
  }
  if (/^([0-9A-Z])\1+$/.test(cnpj)) {
    return false;
  }

  const base = cnpj.slice(0, 12);
  const d1 = calcCheckDigit(base, CNPJ_WEIGHTS_1);
  const d2 = calcCheckDigit(base + String(d1), CNPJ_WEIGHTS_2);
  return cnpj === `${base}${d1}${d2}`;
}
