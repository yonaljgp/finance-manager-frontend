import { useEffect, useState } from "react";
import { api } from "../services/httpClient";
import { useTransactions } from "../hooks/useTransactions";
import type { DateFilterType } from "../types/history";
import type { TransactionType } from "../types/history";
import Header from "../components/dashboard/Header";
import SummaryCards from "../components/history/SummaryCards";
import DashboardStatement from "../components/dashboard/DashboardStatement";
import TransactionsTable from "../components/history/TransactionsTable";

export default function Dashboard() {
  const [filterDate, setFilterDate] = useState<DateFilterType>({
    day: null,
    month: null,
    year: new Date().getFullYear(),
  });
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [resetFilters, setResetFilters] = useState(false);
  const [summary, setSummary] = useState<{
    totalIncome: number;
    totalExpense: number;
    rangeLabel: string;
  }>({ totalIncome: 0, totalExpense: 0, rangeLabel: "totales" });
  const { getSummary } = useTransactions();

  useEffect(() => {
    if (!filterDate) return;
    let cancelled = false;
    const fetchTransactions = async () => {
      const trasactions: TransactionType[] = await api.get("/transactions", {
        params: {
          year: filterDate.year,
          month: filterDate.month ?? null,
          day: filterDate.day ?? null,
        },
      });
      if (!cancelled) setTransactions(trasactions);
    };

    const fetchSummary = async () => {
      const result = await getSummary(filterDate);
      if (!cancelled) setSummary(result);
    };
    fetchSummary();
    fetchTransactions();
    return () => {
      cancelled = true;
    };
  }, [filterDate, getSummary]);

  return (
    <div className="flex flex-col px-8 gap-2">
      <Header
        setFilterDate={setFilterDate}
        filterDate={filterDate}
        resetFilters={resetFilters}
      />
      <SummaryCards summary={summary} />
      <DashboardStatement Transactions={transactions} filterDate={filterDate} />
      <TransactionsTable
        transactions={transactions}
        setResetFilters={setResetFilters}
      />
    </div>
  );
}
