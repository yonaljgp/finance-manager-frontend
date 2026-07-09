import { api } from "../services/httpClient";
import { toAppError, type SetError } from "../utils/apiErrorMapper";
import { useCallback, useState } from "react";
import type { PaginatedResponse, TransactionsQuery } from "../types/history";
import type HistoryType from "../types/history";

export interface TransactionDataType {
  amount: number;
  description: string;
  category: string;
  date: string;
  note?: string;
}

export type TransactionType = "ingreso" | "gasto";

/**
 * Helper reusable: ejecuta una tarea de red envolviendo el manejo de
 * loading / error. Vive en module-scope para no re-crearse en cada render.
 */
async function runTask<T>(
  setError: SetError,
  fallback: string,
  task: () => Promise<T>,
): Promise<T | { errorMessage: string }> {
  setError(null);
  try {
    return await task();
  } catch (err) {
    const appError = toAppError(err, fallback);
    setError(appError.message);
    return { errorMessage: appError.message };
  }
}

/**
 * Convierte los filtros UI a query params para el backend.
 * Si backend no soporta algún filtro, simplemente lo ignoramos.
 */
function buildQueryParams(query: TransactionsQuery): Record<string, string> {
  const params: Record<string, string> = {
    page: String(query.page),
    pageSize: String(query.pageSize),
  };
  if (query.search.trim()) params.search = query.search.trim();
  if (query.type !== "all") params.type = query.type;
  if (query.date.year != null) params.year = String(query.date.year);
  if (query.date.month != null) params.month = String(query.date.month);
  if (query.date.day != null) params.day = String(query.date.day);
  return params;
}

export function useTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Pide transacciones paginadas. Si el backend responde con un array
   * plano (versión anterior) lo envolvemos para mantener compatibilidad.
   */
  const getTransactions = useCallback(
    async (
      query: TransactionsQuery,
    ): Promise<PaginatedResponse<HistoryType>> => {
      setIsLoading(true);
      const result = await runTask(
        setError,
        "Error al obtener las transacciones",
        async () => {
          const response = await api.get<unknown>("/transactions", {
            params: buildQueryParams(query),
          });
          if (Array.isArray(response)) {
            const start = (query.page - 1) * query.pageSize;
            const items = (response as HistoryType[]).slice(
              start,
              start + query.pageSize,
            );
            const total = (response as HistoryType[]).length;
            return {
              items,
              total,
              page: query.page,
              pageSize: query.pageSize,
              totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
            };
          }
          return response as PaginatedResponse<HistoryType>;
        },
      );
      setIsLoading(false);
      if (!result || (typeof result === "object" && "errorMessage" in result)) {
        return {
          items: [],
          total: 0,
          page: query.page,
          pageSize: query.pageSize,
          totalPages: 1,
        };
      }
      return result as PaginatedResponse<HistoryType>;
    },
    [],
  );

  const createTransaction = async (transactionData: TransactionDataType) => {
    setIsLoading(true);
    const result = await runTask(
      setError,
      "Error al crear la transacción",
      async () => {
        const response = await api.post("/transactions", transactionData);
        console.log("Transacción creada:", response);
        return response;
      },
    );
    setIsLoading(false);
    return result;
  };

  return {
    isLoading,
    error,
    getTransactions,
    createTransaction,
  };
}
