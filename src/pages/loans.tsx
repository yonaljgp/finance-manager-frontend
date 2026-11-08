"use client";

import { useEffect, useState } from "react";
import LoansHeader from "../components/loans/LoansHeader";
import LoansSummary from "../components/loans/LoansSummary";
import LoanItem from "../components/loans/LoanItem";
import LoansEmpty from "../components/loans/loansEmpty";
import type { LoanDataType } from "../types/loans";
import useLoans from "../hooks/useLoans";

export default function Loans() {
  const { getLoans } = useLoans();
  const [loansData, setLoansData] = useState<LoanDataType[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    getLoans()
      .then((loans) => {
        if (isCurrent) setLoansData(loans);
      })
      .catch((error: unknown) => {
        if (isCurrent) console.error("Error fetching loans:", error);
      });

    return () => {
      isCurrent = false;
    };
  }, [getLoans]);

  const activeLoansSummary = {
    total: loansData
      .filter((loan) => loan.status === "Pendiente")
      .reduce((sum, loan) => sum + loan.amount, 0),
    count: loansData.filter((loan) => loan.status === "Pendiente").length,
  };

  const avgRate =
    loansData
      .filter((loan) => loan.status === "Pendiente")
      .reduce((sum, loan) => sum + loan.interestRate, 0) /
    (activeLoansSummary.count || 1);

  return (
    <div className="p-8">
      <LoansHeader
        opened={openModal}
        openModal={() => setOpenModal(true)}
        closeModal={() => setOpenModal(false)}
      />

      {loansData.length === 0 ? (
        <LoansEmpty openModal={() => setOpenModal(true)} />
      ) : (
        <div className="space-y-6">
          <LoansSummary
            total={activeLoansSummary.total}
            count={activeLoansSummary.count}
            avgRate={avgRate}
          />
          <LoanItem loans={loansData} />
        </div>
      )}
    </div>
  );
}
