import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";

export default function History() {
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const transactions = [
    {
      id: 1,
      date: "2026-05-24",
      description: "Supermercado Central",
      category: "Alimentación",
      amount: -125.5,
      type: "expense",
    },
    {
      id: 2,
      date: "2026-05-23",
      description: "Salario Mayo",
      category: "Ingreso",
      amount: 4500.0,
      type: "income",
    },
    {
      id: 3,
      date: "2026-05-22",
      description: "Gasolina Shell",
      category: "Transporte",
      amount: -65.0,
      type: "expense",
    },
    {
      id: 4,
      date: "2026-05-21",
      description: "Netflix Suscripción",
      category: "Servicios",
      amount: -15.99,
      type: "expense",
    },
    {
      id: 5,
      date: "2026-05-20",
      description: "Freelance Proyecto Web",
      category: "Ingreso",
      amount: 800.0,
      type: "income",
    },
    {
      id: 6,
      date: "2026-05-19",
      description: "Restaurante La Cocina",
      category: "Alimentación",
      amount: -45.8,
      type: "expense",
    },
    {
      id: 7,
      date: "2026-05-18",
      description: "Amazon Compra",
      category: "Otros",
      amount: -89.99,
      type: "expense",
    },
    {
      id: 8,
      date: "2026-05-17",
      description: "Gym Mensualidad",
      category: "Salud",
      amount: -50.0,
      type: "expense",
    },
    {
      id: 9,
      date: "2026-05-16",
      description: "Uber",
      category: "Transporte",
      amount: -12.5,
      type: "expense",
    },
    {
      id: 10,
      date: "2026-05-15",
      description: "Reembolso Compra",
      category: "Ingreso",
      amount: 35.0,
      type: "income",
    },
    {
      id: 11,
      date: "2026-05-14",
      description: "Electricidad",
      category: "Servicios",
      amount: -85.0,
      type: "expense",
    },
    {
      id: 12,
      date: "2026-05-13",
      description: "Cine",
      category: "Entretenimiento",
      amount: -25.0,
      type: "expense",
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
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = Math.abs(
    filteredTransactions
      .filter((t) => t.type === "expense")
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Total Ingresos</p>
          <p className="text-2xl font-semibold text-green-500 mt-2">
            +${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Total Gastos</p>
          <p className="text-2xl font-semibold text-red-500 mt-2">
            -${totalExpense.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Balance Neto</p>
          <p
            className={`text-2xl font-semibold mt-2 ${
              totalIncome - totalExpense >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {totalIncome - totalExpense >= 0 ? "+" : ""}
            {(totalIncome - totalExpense).toFixed(2)} USD
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar transacciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                filterType === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                filterType === "income"
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                filterType === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Gastos
            </button>
          </div>

          {/* Export Button */}
          <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 dark:bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Fecha
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Descripción
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Categoría
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-accent/30 dark:hover:bg-accent/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {transaction.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "income"
                            ? "bg-green-500/10"
                            : "bg-red-500/10"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-5 h-5 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">
                        {transaction.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount.toFixed(2)} USD
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron transacciones
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredTransactions.length} transacciones
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
              Anterior
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
