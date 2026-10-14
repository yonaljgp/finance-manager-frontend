import { useMemo, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { MONTHS, buildYearOptions } from "../../utils/buildDateSelect";
import type { DateFilterType } from "../../types/history";

type HeaderProps = {
  setFilterDate: (v: DateFilterType) => void;
  filterDate?: DateFilterType;
  resetFilters: boolean;
};

const baseSelectClass =
  "appearance-none cursor-pointer bg-[var(--input-background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg py-[0.35rem] pl-2 pr-7 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-[var(--accent)] transition-colors";

function Header({ setFilterDate, filterDate, resetFilters }: HeaderProps) {
  const { user } = useAuth();
  const yearOptions = useMemo(buildYearOptions, []);
  const currentYear = new Date().getFullYear();
  const month = filterDate?.month != null ? String(filterDate.month) : "";
  const year =
    filterDate?.year != null ? String(filterDate.year) : String(currentYear);

  useEffect(() => {
    if (!resetFilters) return;
    setFilterDate({ day: null, month: null, year: currentYear });
  }, [resetFilters]);

  return (
    <div className="w-full flex flex-col gap-5 p-4 pb-10">
      <p className="text-[0.65rem] font-semibold text-left whitespace-nowrap sm:text-xs">
        Bienvenido {user?.name}
      </p>
      <div className="flex items-center justify-end gap-2">
        <p className="text-xs font-semibold whitespace-nowrap">Resumen:</p>

        {/* Mes */}
        <div className="relative inline-block w-fit">
          <select
            aria-label="Mes"
            value={month}
            onChange={(e) =>
              setFilterDate({
                day: filterDate?.day ?? null,
                month: e.target.value ? Number(e.target.value) : null,
                year: filterDate?.year ?? currentYear,
              })
            }
            className={`${baseSelectClass}`}
          >
            <option value="">Mes</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]"
          >
            <path
              fill="currentColor"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            />
          </svg>
        </div>

        {/* Año */}
        <div className="relative inline-block w-fit">
          <select
            aria-label="Año"
            value={year}
            onChange={(e) =>
              setFilterDate({
                day: filterDate?.day ?? null,
                month: filterDate?.month ?? null,
                year: e.target.value ? Number(e.target.value) : currentYear,
              })
            }
            className={`${baseSelectClass}`}
          >
            {yearOptions.map((y) => (
              <option key={y.value} value={y.value}>
                {y.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]"
          >
            <path
              fill="currentColor"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Header;
