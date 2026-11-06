import * as z from "zod";

export interface TransactionsSummaryType {
  totalIncome: number;
  totalExpense: number;
  /** Rango efectivo que se está reportando (texto legible). */
  rangeLabel: string;
}

export interface TransactionDataType {
  id?: number;
  id_transactions?: number;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  date: Date | string;
  note?: string;
}

export interface TransactionFormDataType {
  amount: number;
  description: string;
  category: string;
  date: string;
  note?: string;
}

export type TransactionType = "ingreso" | "gasto";

export const createTransactionsSchema = z.object({
  amount: z
    .number({ message: "El monto es obligatorio." })
    .min(1, { message: "El monto debe ser mayor que cero." })
    .positive({ message: "El monto debe ser mayor que cero." }),
  description: z
    .string()
    .min(3, { message: "La descripción es obligatoria." })
    .max(100, {
      message: "La descripción no puede superar los 100 caracteres.",
    }),
  category: z.string().min(1, { message: "Selecciona una categoría." }),
  date: z.iso
    .date({ message: "Selecciona una fecha." })
    .min(1, { message: "Selecciona una fecha." }),
  note: z.string().max(300).optional(),
});
