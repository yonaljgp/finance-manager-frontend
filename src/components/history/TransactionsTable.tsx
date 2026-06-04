import { ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import type HistoryType from "../../types/history";

type Props = {
  transactions: HistoryType[];
};

export default function TransactionsTable({ transactions }: Props) {
  return (
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
            {transactions.map((transaction) => (
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === "ingreso" ? "bg-green-500/10" : "bg-red-500/10"}`}
                    >
                      {transaction.type === "ingreso" ? (
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
                    className={`font-semibold ${transaction.type === "ingreso" ? "text-green-500" : "text-red-500"}`}
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

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No se encontraron transacciones
          </p>
        </div>
      )}
    </div>
  );
}
