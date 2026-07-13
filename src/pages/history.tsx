import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import SummaryCards from "../components/history/SummaryCards";
import Filters from "../components/history/Filters";
import TransactionsTable from "../components/history/TransactionsTable";
import Pagination from "../components/history/Pagination";
import Header from "../components/history/Header";
import type {
  DateFilterType,
  FilterType,
  PaginatedResponseType,
  HistoryType,
} from "../types/history";
import { useTransactions } from "../hooks/useTransactions";

const PAGE_SIZE = 15;

const EMPTY_PAGE: PaginatedResponseType<HistoryType> = {
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  totalPages: 1,
};

export function meta() {
  return [
    { title: "Contacto - Mi Sitio" },
    { name: "description", content: "Página de contacto para soporte." },
  ];
}

export default function History() {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [resetFilters, setResetFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 300);
  const [date, setDate] = useState<DateFilterType>({
    day: null,
    month: null,
    year: null,
  });
  const [page, setPage] = useState(1);
  const [data, setData] =
    useState<PaginatedResponseType<HistoryType>>(EMPTY_PAGE);
  const { getTransactions, isLoading } = useTransactions();

  // Reset a página 1 cuando cambian los filtros (no cuando cambia `page`).
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterType, date]);

  useEffect(() => {
    let cancelled = false;
    const fetchTransactions = async () => {
      const result = await getTransactions({
        search: debouncedSearch,
        type: filterType,
        date,
        page,
        pageSize: PAGE_SIZE,
      });
      if (!cancelled) setData(result);
    };
    fetchTransactions();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, filterType, date, page, getTransactions]);

  // Resumen calculado sobre la página actual (consistente con la tabla).
  const { totalIncome, totalExpense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const t of data.items) {
      if (t.type === "ingreso") inc += t.amount;
      else exp += Math.abs(t.amount);
    }
    return { totalIncome: inc, totalExpense: exp };
  }, [data.items]);

  return (
    <div className="p-8">
      <Header />
      <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} />
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        date={date}
        setDate={setDate}
        resetFilters={resetFilters}
        setResetFilters={setResetFilters}
      />
      <TransactionsTable
        transactions={data.items}
        setResetFilters={setResetFilters}
      />
      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        totalItems={data.total}
        pageSize={data.pageSize}
        onPageChange={setPage}
      />

      {isLoading && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          Cargando...
        </p>
      )}
    </div>
  );
}
