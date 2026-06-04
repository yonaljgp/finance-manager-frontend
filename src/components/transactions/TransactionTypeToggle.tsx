import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type TransactionType = "ingreso" | "gasto";

interface TransactionTypeToggleProps {
  transactionType: TransactionType;
  setTransactionType: (value: TransactionType) => void;
}

export default function TransactionTypeToggle({
  transactionType,
  setTransactionType,
}: TransactionTypeToggleProps) {
  return (
    <div className="mb-8">
      <label className="text-sm text-muted-foreground mb-3 block">
        Tipo de Transacción
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setTransactionType("ingreso")}
          className={`p-6 rounded-lg border-2 transition-all ${
            transactionType === "ingreso"
              ? "border-green-500 bg-green-500/10"
              : "border-border hover:border-green-500/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="bg-green-500/10 p-3 rounded-full">
              <ArrowUpRight className="w-6 h-6 text-green-500" />
            </div>
            <span className="font-medium">Ingreso</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setTransactionType("gasto")}
          className={`p-6 rounded-lg border-2 transition-all ${
            transactionType === "gasto"
              ? "border-red-500 bg-red-500/10"
              : "border-border hover:border-red-500/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="bg-red-500/10 p-3 rounded-full">
              <ArrowDownRight className="w-6 h-6 text-red-500" />
            </div>
            <span className="font-medium">Gasto</span>
          </div>
        </button>
      </div>
    </div>
  );
}
