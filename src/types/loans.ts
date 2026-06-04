export default interface Loans {
  id: number;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  nextPayment: string | null;
  status: "pendiente" | "pagado";
}
