import { useMemo } from "react";
import { Calendar, DollarSign, FileText, Tag } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type TransactionType = "ingreso" | "gasto";

export interface TransactionFormValues {
  amount: number;
  description: string;
  category: string;
  date: string;
  note?: string;
}

interface TransactionFormProps {
  transactionType: TransactionType;
  register: UseFormRegister<TransactionFormValues>;
  errors: FieldErrors<TransactionFormValues>;
  handleSubmit: (
    callback: (data: TransactionFormValues) => void,
  ) => (event?: React.FormEvent) => Promise<void>;
  onSubmit: (data: TransactionFormValues) => void;
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
  register,
  errors,
  handleSubmit,
  onSubmit,
}: TransactionFormProps) {
  const categoryOptions = useMemo(
    () => categories[transactionType],
    [transactionType],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            {...register("amount", { valueAsNumber: true })}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {errors.amount && (
          <p className="mt-2 text-sm text-red-500">{errors.amount.message}</p>
        )}
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
            {...register("description")}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {errors.description && (
          <p className="mt-2 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Categoría
        </label>
        <div className="relative">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <select
            {...register("category")}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-colors text-foreground"
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
        {errors.category && (
          <p className="mt-2 text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Fecha
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="date"
            {...register("date")}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground"
          />
        </div>
        {errors.date && (
          <p className="mt-2 text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Notas (opcional)
        </label>
        <textarea
          placeholder="Agrega notas adicionales..."
          rows={4}
          {...register("note")}
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
