export type FilterType = "all" | "ingreso" | "gasto";

/** Filtros de fecha separados: cada parte es independiente y opcional. */
export interface DateFilterType {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface TypeTransactionsQueryType {
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

export interface HistoryType {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  note?: string;
  type: "ingreso" | "gasto";
}
