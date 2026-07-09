export type FilterType = "all" | "ingreso" | "gasto";

/** Filtros de fecha separados: cada parte es independiente y opcional. */
export interface DateFilter {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface TransactionsQuery {
  search: string;
  type: FilterType;
  date: DateFilter;
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default interface History {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  note?: string;
  type: "ingreso" | "gasto";
}
