import { type FormEvent, useState } from "react";
import TransactionHeader from "../components/transactions/TransactionHeader";
import TransactionTypeToggle from "../components/transactions/TransactionTypeToggle";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionSuccessAlert from "../components/transactions/TransactionSuccessAlert";
import TransactionStats from "../components/transactions/TransactionStats";

type TransactionType = "ingreso" | "gasto";

function Transactions() {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("gasto");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <TransactionHeader />
        <TransactionSuccessAlert visible={showSuccess} />

        <div className="bg-card border border-border rounded-xl p-8">
          <TransactionTypeToggle
            transactionType={transactionType}
            setTransactionType={setTransactionType}
          />
          <TransactionForm
            transactionType={transactionType}
            onSubmit={handleSubmit}
          />
        </div>

        <TransactionStats />
      </div>
    </div>
  );
}

export default Transactions;
