import LoansHeader from "../components/loans/LoansHeader";
import LoansSummary from "../components/loans/LoansSummary";
import LoanItem from "../components/loans/LoanItem";
import type Loans from "../types/loans";

export default function Loans() {
  const loans: Loans[] = [
    {
      id: 1,
      name: "Préstamo Personal",
      totalAmount: 10000,
      remainingAmount: 6500,
      monthlyPayment: 350,
      interestRate: 8.5,
      nextPayment: "2026-06-01",
      status: "pagado",
    },
    {
      id: 2,
      name: "Tarjeta de Crédito",
      totalAmount: 5000,
      remainingAmount: 2000,
      monthlyPayment: 150,
      interestRate: 18.9,
      nextPayment: "2026-06-05",
      status: "pendiente",
    },
    {
      id: 3,
      name: "Préstamo Estudiantil",
      totalAmount: 15000,
      remainingAmount: 0,
      monthlyPayment: 0,
      interestRate: 5.5,
      nextPayment: null,
      status: "pagado",
    },
  ];

  const activeLoansSummary = {
    total: loans
      .filter((l) => l.status === "pendiente")
      .reduce((sum, l) => sum + l.remainingAmount, 0),
    monthlyPayment: loans
      .filter((l) => l.status === "pendiente")
      .reduce((sum, l) => sum + l.monthlyPayment, 0),
    count: loans.filter((l) => l.status === "pendiente").length,
  };

  const avgRate =
    loans
      .filter((l) => l.status === "pendiente")
      .reduce((sum, l) => sum + l.interestRate, 0) /
    (activeLoansSummary.count || 1);

  return (
    <div className="p-8">
      <LoansHeader />
      <LoansSummary
        total={activeLoansSummary.total}
        monthlyPayment={activeLoansSummary.monthlyPayment}
        count={activeLoansSummary.count}
        avgRate={avgRate}
      />

      <div className="space-y-4">
        {loans.map((loan) => (
          <LoanItem key={loan.id} loan={loan as Loans} />
        ))}
      </div>
    </div>
  );
}
