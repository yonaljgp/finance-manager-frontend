export const MONTHS = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

/** Días válidos para un mes/año concretos (maneja bisiestos). */
export function getDaysInMonth(
  year: number | null,
  month: number | null,
): number {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

export function buildYearOptions(): { value: string; label: string }[] {
  const current = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];
  for (let y = current; y >= current - 10; y--) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}
