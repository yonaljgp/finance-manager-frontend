import { api } from "../services/httpClient";
import type { LoanDataFormType } from "../types/loans";

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

  return { createLoan };
}
