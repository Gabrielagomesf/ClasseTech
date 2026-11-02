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
    return code - 48;
  }
  return 0;
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
  if (cnpj.length !== 14 || /^([0-9A-Z])\1+$/.test(cnpj)) {
    return false;
  }

  const base = cnpj.slice(0, 12);
  const d1 = calcCheckDigit(base, CNPJ_WEIGHTS_1);
  const d2 = calcCheckDigit(base + String(d1), CNPJ_WEIGHTS_2);
  return cnpj === `${base}${d1}${d2}`;
}
