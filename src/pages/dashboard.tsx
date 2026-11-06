import { useEffect, useState } from "react";
import { api } from "../services/httpClient";
import { useTransactions } from "../hooks/useTransactions";
import type { DateFilterType } from "../types/history";
import type { TransactionDataType } from "../types/transactions";
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
  const [transactions, setTransactions] = useState<TransactionDataType[]>([]);
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
      const trasactions: TransactionDataType[] = await api.get(
        "/transactions",
        {
          params: {
            year: filterDate.year,
            month: filterDate.month ?? null,
            day: filterDate.day ?? null,
          },
        },
      );
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
      <div className="bg-card border border-border transition-colors rounded-xl p-6 my-8 gap-10">
        <h2 className="text-xl font-semibold pb-7">Transacciones Recientes</h2>
        <TransactionsTable
          transactions={transactions.slice(0, 5)}
          setResetFilters={setResetFilters}
        />
      </div>
    </div>
  );
}
