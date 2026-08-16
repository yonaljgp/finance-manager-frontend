export type FilterType = "all" | "ingreso" | "gasto";

/** Filtros de fecha separados: cada parte es independiente y opcional. */
export interface DateFilterType {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface TransactionsQueryType {
  search: string;
  type: FilterType;
  date: DateFilterType;
  page: number;
  pageSize: number;
}

export interface PaginatedResponseType<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TransactionType {
  id?: number;
  id_transactions?: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  note?: string;
  type: "ingreso" | "gasto";
}

export type dataStatementType = {
  transactions: TransactionType[];
  dateInit?: Date | string;
  dateEnd?: Date | string;
};

export type userType = {
  name: string;
  email: string;
};
