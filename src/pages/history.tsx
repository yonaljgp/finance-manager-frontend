import { useEffect, useState } from "react";
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
} from "../types/history";
import type { TransactionDataType } from "../types/transactions";
import { useTransactions } from "../hooks/useTransactions";
import { useTransactionsList } from "../hooks/useTransactionsList";

const PAGE_SIZE = 15;

const EMPTY_PAGE: PaginatedResponseType<TransactionDataType> = {
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  totalPages: 1,
};

export function Meta() {
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
  const [filterDate, setFilterDate] = useState<DateFilterType>({
    day: null,
    month: null,
    year: new Date().getFullYear(),
  });
  const [page, setPage] = useState(1);
  const [data, setData] =
    useState<PaginatedResponseType<TransactionDataType>>(EMPTY_PAGE);
  const { getTransactions, isLoading: isListLoading } = useTransactionsList();
  const { getSummary, isLoading: isSummaryLoading } = useTransactions();

  // Estado del resumen: ingresos / gastos del rango filtrado actual
  // (independiente de la paginación).
  const [summary, setSummary] = useState<{
    totalIncome: number;
    totalExpense: number;
    rangeLabel: string;
  }>({ totalIncome: 0, totalExpense: 0, rangeLabel: "totales" });

  // Reset a página 1 cuando cambian los filtros (no cuando cambia `page`).
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterType, filterDate]);

  useEffect(() => {
    let cancelled = false;
    const fetchTransactions = async () => {
      const result = await getTransactions({
        search: debouncedSearch,
        type: filterType,
        date: filterDate,
        page,
        pageSize: PAGE_SIZE,
      });
      if (!cancelled) setData(result);
    };
    fetchTransactions();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, filterType, filterDate, page, getTransactions]);

  // El resumen se recalcula con los filtros, **no** con la paginación.
  useEffect(() => {
    let cancelled = false;
    const fetchSummary = async () => {
      const result = await getSummary(filterDate);
      if (!cancelled) setSummary(result);
    };
    fetchSummary();
    return () => {
      cancelled = true;
    };
  }, [filterDate, getSummary]);

  return (
    <div className="p-8">
      <Header />
      <SummaryCards summary={summary} />
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
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

      {(isListLoading || isSummaryLoading) && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          Cargando...
        </p>
      )}
    </div>
  );
}
