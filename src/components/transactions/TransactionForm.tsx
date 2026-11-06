import { NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  Control,
} from "react-hook-form";
import { DateInput } from "@mantine/dates";
import { Controller } from "react-hook-form";
import type {
  TransactionFormDataType,
  TransactionType,
} from "../../types/transactions";

interface TransactionFormProps {
  transactionType: TransactionType;
  register: UseFormRegister<TransactionFormDataType>;
  control: Control<TransactionFormDataType>;
  errors: FieldErrors<TransactionFormDataType>;
  handleSubmit: UseFormHandleSubmit<TransactionFormDataType>;
  onSubmit: (data: TransactionFormDataType) => void;
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

const fieldClassNames = {
  label: "!text-[var(--muted-foreground)]",
  input:
    "!border-[var(--border)] !bg-[var(--input-background)] !text-[var(--foreground)] placeholder:!text-[var(--muted-foreground)] focus:!ring-2 focus:!ring-[var(--input-focus)] focus:!border-[var(--input-focus)]",
};

export default function TransactionForm({
  transactionType,
  register,
  control,
  errors,
  handleSubmit,
  onSubmit,
}: TransactionFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-10">
      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <NumberInput
            {...field}
            label="Monto"
            placeholder="0.00"
            decimalScale={2}
            error={errors.amount?.message}
            classNames={fieldClassNames}
            onChange={(value) => {
              field.onChange(
                typeof value === "number"
                  ? value
                  : value === ""
                    ? Number.NaN
                    : Number(value),
              );
            }}
          />
        )}
      />

      <TextInput
        label="Descripción"
        placeholder="Ej: Compra en supermercado"
        {...register("description")}
        error={errors.description?.message}
        classNames={fieldClassNames}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            label="Categoría"
            placeholder="Selecciona una categoría"
            data={categories[transactionType]}
            error={errors.category?.message}
            classNames={{
              ...fieldClassNames,
              dropdown: "!border-[var(--border)] !bg-[var(--card)]",
              option:
                "!text-[var(--foreground)] data-[hovered]:!bg-[var(--accent)] data-[checked]:!bg-[var(--input-focus)] data-[checked]:!text-[var(--foreground)]",
            }}
          />
        )}
      />

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <DateInput
            {...field}
            label="Fecha"
            maxDate={new Date()}
            valueFormat="DD/MM/YYYY"
            placeholder="DD/MM/YYYY"
            error={errors.date?.message}
            classNames={fieldClassNames}
            onChange={(date) => field.onChange(date ?? "")}
          />
        )}
      />

      <Textarea
        label="Notas (opcional)"
        placeholder="Agrega notas adicionales..."
        rows={4}
        resize="none"
        classNames={fieldClassNames}
        {...register("note")}
      />

      <button
        type="submit"
        className={`w-full py-4 rounded-lg font-bold transition-colors ${
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
