import { useEffect, useState } from "react";
import TransactionHeader from "../components/transactions/TransactionHeader";
import TransactionTypeToggle from "../components/transactions/TransactionTypeToggle";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionSuccessAlert from "../components/transactions/TransactionSuccessAlert";
import TransactionStats from "../components/transactions/TransactionStats";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useTransactions,
  type TransactionDataType,
  type TransactionType,
} from "../hooks/useTransactions";

const createTransactionsSchema = z.object({
  amount: z
    .number()
    .min(1, { message: "El monto debe ser mayor que cero." })
    .positive({ message: "El monto debe ser mayor que cero." }),
  description: z
    .string()
    .min(3, { message: "La descripción es obligatoria." })
    .max(100, {
      message: "La descripción no puede superar los 100 caracteres.",
    }),
  category: z.string().min(1, { message: "Selecciona una categoría." }),
  date: z.string().min(1, { message: "Selecciona una fecha." }),
  note: z.string().max(300).optional(),
});

function Transactions() {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("gasto");
  const [showSuccess, setShowSuccess] = useState(false);
  const { createTransaction } = useTransactions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionDataType>({
    resolver: zodResolver(createTransactionsSchema as never),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    },
  });

  useEffect(() => {
    document.title =
      transactionType === "ingreso" ? "Registrar ingreso" : "Registrar gasto";
  }, [transactionType]);

  const onSubmit = (data: TransactionDataType) => {
    console.log("Nueva transacción:", { ...data, type: transactionType });
    const payload = { ...data, type: transactionType };
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
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </div>

        <TransactionStats />
      </div>
    </div>
  );
}

export default Transactions;
