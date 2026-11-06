import { useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Select } from "@mantine/core";
import { useAuth } from "../../hooks/useAuth";
import { MONTHS, buildYearOptions } from "../../utils/buildDateSelect";
import type { DateFilterType } from "../../types/history";

type HeaderProps = {
  setFilterDate: (v: DateFilterType) => void;
  filterDate?: DateFilterType;
  resetFilters: boolean;
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
    <div className="w-full flex justify-between items-center gap-2 p-6">
      <p className="text-[0.65rem] font-semibold text-left whitespace-nowrap sm:text-xs">
        Bienvenido {user?.name}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold whitespace-nowrap">Resumen:</p>

        {/* Mes */}
        <div className="inline-block w-fit">
          <Select
            aria-label="Mes"
            placeholder="Mes"
            data={MONTHS}
            value={month || null}
            onChange={(value) =>
              setFilterDate({
                day: filterDate?.day ?? null,
                month: value ? Number(value) : null,
                year: filterDate?.year ?? currentYear,
              })
            }
            clearable
            variant="unstyled"
            comboboxProps={{ withinPortal: false }}
            rightSection={<ChevronDown size={16} />}
            clearSectionMode="clear"
            styles={selectStyles}
            size="xs"
          />
        </div>

        {/* Año */}
        <div className="inline-block w-fit">
          <Select
            aria-label="Año"
            data={yearOptions}
            value={year}
            onChange={(value) =>
              setFilterDate({
                day: filterDate?.day ?? null,
                month: filterDate?.month ?? null,
                year: value ? Number(value) : currentYear,
              })
            }
            variant="unstyled"
            rightSection={<ChevronDown size={16} />}
            clearSectionMode="clear"
            comboboxProps={{ withinPortal: false }}
            styles={selectStyles}
            size="xs"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
