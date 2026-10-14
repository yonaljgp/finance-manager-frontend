import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { TransactionType } from "../../types/transactions";

interface TransactionTypeToggleProps {
  transactionType: TransactionType;
  setTransactionType: (value: TransactionType) => void;
}

export default function TransactionTypeToggle({
  transactionType,
  setTransactionType,
}: TransactionTypeToggleProps) {
  return (
    <fieldset className="mb-8 border-0 p-0 m-0">
      <legend className="text-sm text-muted-foreground mb-3 block">
        Tipo de Transacción
      </legend>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setTransactionType("ingreso")}
          aria-pressed={transactionType === "ingreso"}
          className={`p-6 rounded-lg border-2 transition-all ${
            transactionType === "ingreso"
              ? "border-income bg-income/10"
              : "border-border hover:border-income/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="bg-income/10 p-3 rounded-full">
              <ArrowUpRight className="w-6 h-6 text-income" />
            </div>
            <span className="font-medium">Ingreso</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setTransactionType("gasto")}
          aria-pressed={transactionType === "gasto"}
          className={`p-6 rounded-lg border-2 transition-all ${
            transactionType === "gasto"
              ? "border-expense bg-expense/10"
              : "border-border hover:border-expense/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="bg-expense/10 p-3 rounded-full">
              <ArrowDownRight className="w-6 h-6 text-expense" />
            </div>
            <span className="font-medium">Gasto</span>
          </div>
        </button>
      </div>
    </fieldset>
  );
}
