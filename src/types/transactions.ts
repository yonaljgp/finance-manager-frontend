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
