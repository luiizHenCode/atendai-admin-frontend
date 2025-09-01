export function clearString(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatPhone(value: string): string {
  const digits = clearString(value);

  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export function formatDocument(value: string): string {
  const digits = clearString(value);

  if (digits.length <= 11) {
    // CPF
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  // CNPJ
  return digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
}
