export function stripDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidBirthDateBr(value: string): boolean {
  const digits = stripDigits(value);
  if (digits.length !== 8) {
    return false;
  }

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const now = new Date();
  if (date > now) {
    return false;
  }

  return now.getFullYear() - year <= 120;
}

export function isValidPhoneBr(value: string): boolean {
  const digits = stripDigits(value);
  return digits.length === 10 || digits.length === 11;
}

export function isValidCep(value: string): boolean {
  return stripDigits(value).length === 8;
}
