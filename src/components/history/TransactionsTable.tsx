import { ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { type HistoryType } from "../../types/history";
import { Button, EmptyState } from "@mantine/core";
import { Search } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import CardTransactions from "./CardTransactions";

type Props = {
  transactions: HistoryType[];
  setResetFilters: (reset: boolean) => void;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formato = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
  return formato;
};

export default function TransactionsTable({
  transactions,
  setResetFilters,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
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
          <tbody className="divide-y divide-border divide-black/0 dark:divide-white/5">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="bg-card-hover transition-colors"
                onClick={() => {
                  setSelectedId(transaction.id);
                  open();
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(transaction.date)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === "ingreso" ? "bg-income/10" : "bg-expense/10"}`}
                    >
                      {transaction.type === "ingreso" ? (
                        <ArrowUpRight className="w-5 h-5 text-income" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-expense" />
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
                    className={`font-semibold ${transaction.type === "ingreso" ? "text-income" : "text-expense"}`}
                  >
                    {transaction.type === "gasto" ? "-" : "+"}
                    {transaction.amount.toFixed(2)} USD
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(() => {
        const selected = transactions.find((t) => t.id === selectedId);
        return selected ? (
          <CardTransactions history={selected} opened={opened} close={close} />
        ) : null;
      })()}

      {transactions.length === 0 && (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="No se encontraron transacciones"
          description="Intenta ajustar tus filtros o agregar nuevas transacciones."
          className="p-10"
        >
          <EmptyState.Actions>
            <Button variant="default" onClick={() => setResetFilters(true)}>
              restablecer filtros
            </Button>
          </EmptyState.Actions>
        </EmptyState>
      )}
    </div>
  );
}
