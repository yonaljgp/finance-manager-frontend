import { useMemo } from "react";
import type { FormEvent } from "react";
import { Calendar, DollarSign, FileText, Tag } from "lucide-react";

type TransactionType = "ingreso" | "gasto";

interface TransactionFormProps {
  transactionType: TransactionType;
  onSubmit: (event: FormEvent) => void;
}

const categories: Record<TransactionType, string[]> = {
  ingreso: ["Salario", "Freelance", "Inversiones", "Ventas", "Otros"],
  gasto: [
    "Alimentación",
    "Transporte",
    "Servicios",
    "Entretenimiento",
    "Salud",
    "Educación",
    "Otros",
  ],
};

export default function TransactionForm({
  transactionType,
  onSubmit,
}: TransactionFormProps) {
  const categoryOptions = useMemo(
    () => categories[transactionType],
    [transactionType],
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Monto
        </label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Descripción
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ej: Compra en supermercado"
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Categoría
        </label>
        <div className="relative">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <select
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-colors text-foreground"
            required
          >
            <option value="" className="bg-card">
              Selecciona una categoría
            </option>
            {categoryOptions.map((category: string) => (
              <option key={category} value={category} className="bg-card">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Fecha
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Notas (opcional)
        </label>
        <textarea
          placeholder="Agrega notas adicionales..."
          rows={4}
          className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-colors text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <button
        type="submit"
        className={`w-full py-4 rounded-lg font-medium transition-colors ${
          transactionType === "ingreso"
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        Registrar {transactionType === "ingreso" ? "Ingreso" : "Gasto"}
      </button>
    </form>
  );
}
