import { useCallback } from "react";
import { api } from "../services/httpClient";
import type { LoanDataFormType, LoanDataType } from "../types/loans";

let loansRequest: Promise<LoanDataType[]> | null = null;

export default function useLoans() {
  const createLoan = async ({ loanData }: { loanData: LoanDataFormType }) => {
    try {
      const response = await api.post("/loans", loanData);
      return response;
    } catch (error) {
      console.error("Error creating loan:", error);
      throw error;
    }
  };

  const getLoans = useCallback(() => {
    if (!loansRequest) {
      loansRequest = api
        .get<LoanDataType[]>("/loans")
        .catch((error: unknown) => {
          console.error("Error fetching loans:", error);
          throw error;
        })
        .finally(() => {
          loansRequest = null;
        });
    }
    return loansRequest;
  }, []);

  const deleteLoan = async (loanId: number | string) => {
    try {
      await api.delete(`/loans/${loanId}`);
    } catch (error) {
      console.error("Error deleting loan:", error);
      throw error;
    }
  };

  return { createLoan, getLoans, deleteLoan };
}
