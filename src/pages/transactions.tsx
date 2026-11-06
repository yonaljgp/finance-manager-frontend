import { useEffect, useState } from "react";
import TransactionHeader from "../components/transactions/TransactionHeader";
import TransactionTypeToggle from "../components/transactions/TransactionTypeToggle";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionSuccessAlert from "../components/transactions/TransactionSuccessAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransactions } from "../hooks/useTransactions";
import { type TransactionType } from "../types/transactions";
import useToLocalISODate from "../hooks/useToLocalISODate";
import { createTransactionsSchema } from "../types/transactions";

function Transactions() {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("gasto");
  const [showSuccess, setShowSuccess] = useState(false);
  const { createTransaction } = useTransactions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof createTransactionsSchema>>({
    resolver: zodResolver(createTransactionsSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      date: useToLocalISODate(new Date()),
      note: "",
    },
  });

  useEffect(() => {
    document.title =
      transactionType === "ingreso" ? "Registrar ingreso" : "Registrar gasto";
  }, [transactionType]);

  const onSubmit = (data: z.infer<typeof createTransactionsSchema>) => {
    // El input entrega un string ISO (YYYY-MM-DD) en hora local; lo
    // reenviamos tal cual al backend para evitar corrimientos por UTC.
    const payload = {
      amount: data.amount,
      description: data.description,
      category: data.category,
      note: data.note,
      date: data.date,
      type: transactionType,
    };
    createTransaction(payload);
    setShowSuccess(true);
    reset();
    window.setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <TransactionHeader transactionType={transactionType} />
        <TransactionSuccessAlert visible={showSuccess} />

        <div className="bg-card border border-border rounded-xl p-8">
          <TransactionTypeToggle
            transactionType={transactionType}
            setTransactionType={setTransactionType}
          />
          <TransactionForm
            transactionType={transactionType}
            register={register}
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default Transactions;
