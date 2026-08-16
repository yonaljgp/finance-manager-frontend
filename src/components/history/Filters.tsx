import { Search, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Select } from "@mantine/core";
import type { DateFilterType, FilterType } from "../../types/history";
import {
  MONTHS,
  getDaysInMonth,
  buildYearOptions,
} from "../../utils/buildDateSelect";

type Props = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterType: FilterType;
  setFilterType: (v: FilterType) => void;
  date: DateFilterType;
  setDate: (v: DateFilterType) => void;
  resetFilters: boolean;
  setResetFilters: (reset: boolean) => void;
};

const selectStyles = {
  input: {
    backgroundColor: "var(--input-background)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
    padding: "0.5rem 0.75rem",
    paddingRight: "2.5rem",
    borderRadius: "0.5rem",
    fieldSizing: "content" as const,
    minWidth: "4rem",
    width: "auto",
  },
  dropdown: {
    backgroundColor: "var(--card)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  },
  option: { color: "var(--foreground)" },
  clear: {
    backgroundColor: "var(--input-background)",
    color: "var(--muted-foreground)",
    borderRadius: "0.25rem",
    width: "1.25rem",
    height: "1.25rem",
    insetInlineEnd: "0.5rem",
  },
};

export default function Filters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  date,
  setDate,
  resetFilters,
  setResetFilters,
}: Props) {
  const yearOptions = useMemo(buildYearOptions, []);

  useEffect(() => {
    if (resetFilters) {
      setSearchTerm("");
      setFilterType("all");
      setDate({ day: null, month: null, year: null });
      setResetFilters(false);
    }
  }, [resetFilters, setSearchTerm, setFilterType, setDate, setResetFilters]);

  const daysInMonth = getDaysInMonth(date.year, date.month);
  const dayOptions = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
      })),
    [daysInMonth],
  );

  // Si el día seleccionado ya no es válido (p.ej. 31 feb), lo limpiamos.
  useEffect(() => {
    if (date.day != null && date.day > daysInMonth) {
      setDate({ ...date, day: null });
    }
  }, [daysInMonth, date, setDate]);

  const hasAnyDate =
    date.day != null || date.month != null || date.year != null;

  return (
    <div className="bg-card border border-border rounded-xl p-3 md:p-4 mb-4 md:mb-6">
      {/* Todo en una fila en desktop, apilado y ordenado en mobile */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-stretch">
        {/* Buscador */}
        <div className="relative flex-1 min-w-0">
          <label htmlFor="history-search" className="sr-only">
            Buscar transacciones
          </label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="history-search"
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Selectores de fecha */}
        <div className="flex gap-1.5 items-center">
          <Select
            aria-label="Día"
            placeholder="Día"
            data={dayOptions}
            value={date.day != null ? String(date.day) : null}
            onChange={(v) => setDate({ ...date, day: v ? Number(v) : null })}
            clearable
            clearSectionMode="clear"
            comboboxProps={{ withinPortal: false }}
            styles={selectStyles}
            size="md"
          />
          <Select
            aria-label="Mes"
            placeholder="Mes"
            data={MONTHS}
            value={date.month != null ? String(date.month) : null}
            onChange={(v) => setDate({ ...date, month: v ? Number(v) : null })}
            clearable
            clearSectionMode="clear"
            comboboxProps={{ withinPortal: false }}
            styles={selectStyles}
            size="md"
          />
          <Select
            aria-label="Año"
            placeholder="Año"
            data={yearOptions}
            value={date.year != null ? String(date.year) : null}
            onChange={(v) => setDate({ ...date, year: v ? Number(v) : null })}
            clearable
            clearSectionMode="clear"
            comboboxProps={{ withinPortal: false }}
            styles={selectStyles}
            size="md"
          />
          {hasAnyDate && (
            <button
              type="button"
              onClick={() => setDate({ day: null, month: null, year: null })}
              className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              aria-label="Limpiar fecha"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Botones de tipo */}
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors ${
              filterType === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFilterType("ingreso")}
            className={`px-3 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors ${
              filterType === "ingreso"
                ? "bg-income text-income-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Ingreso
          </button>
          <button
            type="button"
            onClick={() => setFilterType("gasto")}
            className={`px-3 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors ${
              filterType === "gasto"
                ? "bg-expense text-expense-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Gasto
          </button>
        </div>
      </div>
    </div>
  );
}
