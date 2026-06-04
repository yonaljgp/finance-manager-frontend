import { useState } from "react";
import SummaryCards from "../components/history/SummaryCards";
import Filters from "../components/history/Filters";
import TransactionsTable from "../components/history/TransactionsTable";
import Pagination from "../components/history/Pagination";
import type HistoryType from "../types/history";

export default function History() {
  const [filterType, setFilterType] = useState<"all" | "ingreso" | "gasto">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const transactions: HistoryType[] = [
    {
      id: 1,
      date: "2026-05-24",
      description: "Supermercado Central",
      category: "Alimentación",
      amount: -125.5,
      type: "gasto",
    },
    {
      id: 2,
      date: "2026-05-23",
      description: "Salario Mayo",
      category: "Ingreso",
      amount: 4500.0,
      type: "ingreso",
    },
    {
      id: 3,
      date: "2026-05-22",
      description: "Gasolina Shell",
      category: "Transporte",
      amount: -65.0,
      type: "gasto",
    },
    {
      id: 4,
      date: "2026-05-21",
      description: "Netflix Suscripción",
      category: "Servicios",
      amount: -15.99,
      type: "gasto",
    },
    {
      id: 5,
      date: "2026-05-20",
      description: "Freelance Proyecto Web",
      category: "Ingreso",
      amount: 800.0,
      type: "ingreso",
    },
    {
      id: 6,
      date: "2026-05-19",
      description: "Restaurante La Cocina",
      category: "Alimentación",
      amount: -45.8,
      type: "gasto",
    },
    {
      id: 7,
      date: "2026-05-18",
      description: "Amazon Compra",
      category: "Otros",
      amount: -89.99,
      type: "gasto",
    },
    {
      id: 8,
      date: "2026-05-17",
      description: "Gym Mensualidad",
      category: "Salud",
      amount: -50.0,
      type: "gasto",
    },
    {
      id: 9,
      date: "2026-05-16",
      description: "Uber",
      category: "Transporte",
      amount: -12.5,
      type: "gasto",
    },
    {
      id: 10,
      date: "2026-05-15",
      description: "Reembolso Compra",
      category: "Ingreso",
      amount: 35.0,
      type: "ingreso",
    },
    {
      id: 11,
      date: "2026-05-14",
      description: "Electricidad",
      category: "Servicios",
      amount: -85.0,
      type: "gasto",
    },
    {
      id: 12,
      date: "2026-05-13",
      description: "Cine",
      category: "Entretenimiento",
      amount: -25.0,
      type: "gasto",
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "ingreso")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = Math.abs(
    filteredTransactions
      .filter((t) => t.type === "gasto")
      .reduce((sum, t) => sum + t.amount, 0),
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-foreground">
          Historial de Transacciones
        </h2>
        <p className="text-muted-foreground mt-1">
          Visualiza y analiza todas tus transacciones
        </p>
      </div>

      <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} />
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      <TransactionsTable transactions={filteredTransactions} />
      <Pagination count={filteredTransactions.length} />
    </div>
  );
}
