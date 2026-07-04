import { api } from "../services/httpClient";
import { toAppError, type SetError } from "../utils/apiErrorMapper";
import { useState } from "react";

export interface TransactionDataType {
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
}

export type TransactionType = "ingreso" | "gasto";

export function useTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runTask<T>(
    setIsLoading: (v: boolean) => void,
    setError: SetError,
    fallback: string,
    task: () => Promise<T>,
  ) {
    setIsLoading(true);
    setError(null);
    try {
      await task();
      return task;
    } catch (err) {
      const appError = toAppError(err, fallback);
      setError(appError.message);
      return { errorMessage: appError.message };
    } finally {
      setIsLoading(false);
    }
  }

  const getTransactions = async () => {
    runTask(
      setIsLoading,
      setError,
      "Error al obtener las transacciones",
      async () => {
        const response = await api.get("/transactions");
        console.log("Transacciones obtenidas:", response);
      },
    );
  };

  const createTransaction = async (transactionData: TransactionDataType) => {
    runTask(
      setIsLoading,
      setError,
      "Error al crear la transacción",
      async () => {
        const response = await api.post("/transactions", transactionData);
        console.log("Transacción creada:", response);
      },
    );
  };

  return {
    isLoading,
    error,
    getTransactions,
    createTransaction,
  };
}
