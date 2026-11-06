import { Search, X, Calendar, ChevronDown } from "lucide-react";
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
  filterDate: DateFilterType;
  setFilterDate: (v: DateFilterType) => void;
  resetFilters: boolean;
  setResetFilters: (reset: boolean) => void;
};

const selectStyles = {
  root: {
    width: "fit-content",
  },
  input: {
    backgroundColor: "var(--input-background)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
    borderRadius: "0.5rem",
    fieldSizing: "content" as const,
    minWidth: 0,
    width: "fit-content",
    fontSize: "0.75rem",
    padding: "0.375rem 2.25rem 0.375rem 0.75rem",
  },
  dropdown: {
    backgroundColor: "var(--card)",
    borderColor: "var(--border)",
    borderRadius: "0.5rem",
    width: "max-content",
    minWidth: "max-content",
    maxWidth: "none",
  },
  option: {
    color: "var(--foreground)",
    whiteSpace: "nowrap" as const,
    width: "max-content",
    overflow: "visible",
  },
};

export default function Filters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterDate,
  setFilterDate,
  resetFilters,
  setResetFilters,
}: Props) {
  const yearOptions = useMemo(buildYearOptions, []);
  const currentYear = new Date().getFullYear();
  // El año siempre tiene un valor por defecto para mantener consistencia.
  const yearValue =
    filterDate.year != null ? String(filterDate.year) : String(currentYear);

  // Reset filters
  useEffect(() => {
    if (resetFilters) {
      setSearchTerm("");
      setFilterType("all");
      setFilterDate({ day: null, month: null, year: null });
      setResetFilters(false);
    }
  }, [
    resetFilters,
    setSearchTerm,
    setFilterType,
    setFilterDate,
    setResetFilters,
  ]);

  const daysInMonth = getDaysInMonth(filterDate.year, filterDate.month);
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
    if (filterDate.day != null && filterDate.day > daysInMonth) {
      setFilterDate({ ...filterDate, day: null });
    }
  }, [daysInMonth, filterDate, setFilterDate]);

  const hasAnyDate = filterDate.day != null || filterDate.month != null;

  const typeButton = (
    label: string,
    value: FilterType,
    activeClass: string,
  ) => {
    const isActive = filterType === value;
    return (
      <button
        type="button"
        onClick={() => setFilterType(value)}
        className={`flex-1 md:flex-none px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg font-medium text-[11px] md:text-xs transition-colors text-center ${
          isActive
            ? activeClass
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-3 md:p-4 mb-4 md:mb-6">
      {/* MÓVIL: cada filtro en su propia fila con label visible
          DESKTOP: tres categorías separadas por divisores verticales */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0">
        {/* Buscador */}
        <div className="md:flex-1 md:min-w-0 md:pr-4">
          <label
            htmlFor="history-search"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none md:hidden" />
            <input
              id="history-search"
              type="text"
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 md:pl-3 pr-3 py-2 md:py-1.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Divisor vertical (solo desktop) */}
        <div className="hidden md:block h-10 w-px bg-border" />

        {/* Selectores de fecha */}
        <div className="md:shrink-0 md:px-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Fecha
          </p>
          <div className="flex gap-1.5 items-center">
            <Select
              aria-label="Día"
              placeholder="Día"
              data={dayOptions}
              value={filterDate.day != null ? String(filterDate.day) : null}
              onChange={(v) =>
                setFilterDate({ ...filterDate, day: v ? Number(v) : null })
              }
              clearable
              variant="unstyled"
              rightSection={<ChevronDown size={16} />}
              clearSectionMode="clear"
              comboboxProps={{ withinPortal: false }}
              styles={selectStyles}
              size="sm"
            />
            <Select
              aria-label="Mes"
              placeholder="Mes"
              data={MONTHS}
              value={filterDate.month != null ? String(filterDate.month) : null}
              onChange={(v) =>
                setFilterDate({ ...filterDate, month: v ? Number(v) : null })
              }
              clearable
              rightSection={<ChevronDown size={16} />}
              clearSectionMode="clear"
              variant="unstyled"
              comboboxProps={{ withinPortal: false }}
              styles={selectStyles}
              size="sm"
            />
            <Select
              aria-label="Año"
              placeholder="Año"
              data={yearOptions}
              value={yearValue}
              onChange={(v) =>
                // Si se borra, vuelve al año actual en vez de quedar null.
                setFilterDate({
                  ...filterDate,
                  year: v ? Number(v) : currentYear,
                })
              }
              clearable={false}
              rightSection={<ChevronDown size={16} />}
              comboboxProps={{ withinPortal: false }}
              styles={selectStyles}
              size="sm"
            />
            {hasAnyDate && (
              <button
                type="button"
                onClick={() =>
                  // Al limpiar, el año vuelve al actual (nunca queda null).
                  setFilterDate({
                    day: null,
                    month: null,
                    year: currentYear,
                  })
                }
                className="p-1.5 md:p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors shrink-0"
                aria-label="Limpiar fecha"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Divisor vertical (solo desktop) */}
        <div className="hidden md:block h-10 w-px bg-border" />

        {/* Botones de tipo */}
        <div className="md:shrink-0 md:pl-4">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Tipo
          </p>
          <div className="flex gap-1.5 md:gap-2 items-center">
            {typeButton("Todas", "all", "bg-primary text-primary-foreground")}
            {typeButton(
              "Ingreso",
              "ingreso",
              "bg-income text-income-foreground",
            )}
            {typeButton("Gasto", "gasto", "bg-expense text-expense-foreground")}
          </div>
        </div>
      </div>
    </div>
  );
}
