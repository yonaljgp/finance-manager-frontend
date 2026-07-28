import { useMemo } from "react";
import { Calendar, DollarSign, FileText, Tag } from "lucide-react";
import type { FieldErrors, UseFormRegister, Control } from "react-hook-form";
import { DateInput } from "@mantine/dates";
import { Controller } from "react-hook-form";
import type { TransactionDataType } from "../../hooks/useTransactions";
type TransactionType = "ingreso" | "gasto";

interface TransactionFormProps {
  transactionType: TransactionType;
  register: UseFormRegister<TransactionDataType>;
  control: Control<TransactionDataType>;
  errors: FieldErrors<TransactionDataType>;
  handleSubmit: (
    callback: (data: TransactionDataType) => void,
  ) => (event?: React.FormEvent) => Promise<void>;
  onSubmit: (data: TransactionDataType) => void;
  isValid: boolean;
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
  control,
  errors,
  handleSubmit,
  onSubmit,
  isValid,
}: TransactionFormProps) {
  const categoryOptions = useMemo(
    () => categories[transactionType],
    [transactionType],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="transaction-amount"
          className="text-sm text-muted-foreground mb-2 block"
        >
          Monto
        </label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="transaction-amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount", { valueAsNumber: true })}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {errors.amount && (
          <p className="mt-2 text-sm text-destructive">
            {errors.amount.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-description"
          className="text-sm text-muted-foreground mb-2 block"
        >
          Descripción
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="transaction-description"
            type="text"
            placeholder="Ej: Compra en supermercado"
            {...register("description")}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {errors.description && (
          <p className="mt-2 text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-category"
          className="text-sm text-muted-foreground mb-2 block"
        >
          Categoría
        </label>
        <div className="relative">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <select
            id="transaction-category"
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
          <p className="mt-2 text-sm text-destructive">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-date"
          className="text-sm text-muted-foreground mb-2 block"
        >
          Fecha
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DateInput
                id="transaction-date"
                clearable
                maxDate={new Date()}
                valueFormat="DD/MM/YYYY"
                value={field.value}
                onChange={field.onChange}
                className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground"
                placeholder="DD/MM/YYYY"
                classNames={{
                  input:
                    "!border-0 !bg-transparent !focus:ring-0 !outline-none text-foreground placeholder:text-muted-foreground p-0",
                  root: "m-0 p-0",
                  wrapper: "m-0 p-0",
                }}
                styles={{
                  input: {
                    border: "none !important",
                    background: "transparent !important",
                    outline: "none !important",
                    boxShadow: "none !important",
                  },
                  wrapper: {
                    border: "none !important",
                  },
                }}
              />
            )}
          />
        </div>
        {errors.date && (
          <p className="mt-2 text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-notes"
          className="text-sm text-muted-foreground mb-2 block"
        >
          Notas (opcional)
        </label>
        <textarea
          id="transaction-notes"
          placeholder="Agrega notas adicionales..."
          rows={4}
          {...register("note")}
          className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-colors text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full py-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
          transactionType === "ingreso"
            ? "bg-income hover:brightness-90 text-income-foreground"
            : "bg-expense hover:brightness-90 text-expense-foreground"
        }`}
      >
        Registrar {transactionType === "ingreso" ? "Ingreso" : "Gasto"}
      </button>
    </form>
  );
}
