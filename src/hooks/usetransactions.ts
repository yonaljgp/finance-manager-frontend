import { api } from "../services/httpClient";
import { toAppError, type SetError } from "../utils/apiErrorMapper";
import { useState, useTransition } from "react";

export interface TransactionDataType {
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
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

export function useTransactions() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const getTransactions = async () => {
    startTransition(() => {
      void runTask(setError, "Error al obtener las transacciones", async () => {
        const response = await api.get("/transactions");
        console.log("Transacciones obtenidas:", response);
        return response;
      });
    });
  };

  const createTransaction = async (transactionData: TransactionDataType) => {
    startTransition(() => {
      void runTask(setError, "Error al crear la transacción", async () => {
        const response = await api.post("/transactions", transactionData);
        console.log("Transacción creada:", response);
        return response;
      });
    });
  };

  return {
    isLoading: isPending,
    error,
    getTransactions,
    createTransaction,
  };
}
