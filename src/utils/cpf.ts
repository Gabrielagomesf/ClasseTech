/** Remove máscara e normaliza CPF. */
export function stripCpf(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCpf(value: string): string {
  const digits = stripCpf(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskCpf(value: string): string {
  const digits = stripCpf(value);
  if (digits.length !== 11) {
    return formatCpf(value);
  }
  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
}

/** Valida dígitos verificadores do CPF. */
export function isValidCpf(value: string): boolean {
  const cpf = stripCpf(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  const calcDigit = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i += 1) {
      total += Number(base[i]) * (factor - i);
    }
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calcDigit(cpf.slice(0, 9), 10);
  const d2 = calcDigit(cpf.slice(0, 10), 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}
