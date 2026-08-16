import { api } from "../services/httpClient";
import { toAppError, type SetError } from "../utils/apiErrorMapper";
import { useCallback, useState } from "react";
import type { DateFilterType } from "../types/history";

/** Resumen agregado de ingresos / gastos para un set de filtros. */
export interface TransactionsSummaryType {
  totalIncome: number;
  totalExpense: number;
  /** Rango efectivo que se está reportando (texto legible). */
  rangeLabel: string;
}

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

const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/**
 * Genera una etiqueta humana para el rango filtrado.
 * - Solo año  → "del año YYYY"
 * - Mes + año → "de <mes> YYYY"
 * - Sin filtros → "totales" (todas las transacciones)
 */
export function buildRangeLabel(date: DateFilterType): string {
  if (date.year != null && date.month != null) {
    return `de ${MONTH_NAMES[date.month - 1]} ${date.year}`;
  }
  if (date.year != null) {
    return `del año ${date.year}`;
  }
  return `del año ${new Date().getFullYear()}`;
}

/**
 * Convierte el filtro de fecha UI a query params que se envían al backend.
 * Si no hay año, se usa el año actual como default.
 */
function buildSummaryParams(date: DateFilterType): Record<string, string> {
  const params: Record<string, string> = {};
  if (date.year != null) params.year = String(date.year);
  else params.year = String(new Date().getFullYear());
  if (date.month != null) params.month = String(date.month);
  return params;
}

export function useTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSummary = useCallback(
    async (date: DateFilterType): Promise<TransactionsSummaryType> => {
      const rangeLabel = buildRangeLabel(date);
      setIsLoading(true);
      const result = await runTask(
        setError,
        "Error al obtener el resumen",
        async () => {
          const data = await api.get<{
            totalIncome: number;
            totalExpense: number;
          }>("/transactions/summary", {
            params: buildSummaryParams(date),
          });
          return {
            totalIncome: data.totalIncome,
            totalExpense: data.totalExpense,
            rangeLabel,
          };
        },
      );
      setIsLoading(false);
      if (!result || (typeof result === "object" && "errorMessage" in result)) {
        return { totalIncome: 0, totalExpense: 0, rangeLabel };
      }
      return result as TransactionsSummaryType;
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
    getSummary,
    createTransaction,
  };
}
