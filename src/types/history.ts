import type { TransactionDataType } from "./transactions";

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

export type DataStatementType = {
  transactions: TransactionDataType[];
  dateInit?: Date | string;
  dateEnd?: Date | string;
};

export type UserType = {
  name: string;
  email: string;
};
