import { useEffect, useState } from "react";
import TransactionHeader from "../components/transactions/TransactionHeader";
import TransactionTypeToggle from "../components/transactions/TransactionTypeToggle";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionSuccessAlert from "../components/transactions/TransactionSuccessAlert";
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
    .number({ message: "El monto es obligatorio." })
    .min(1, { message: "El monto debe ser mayor que cero." })
    .positive({ message: "El monto debe ser mayor que cero." }),
  description: z
    .string()
    .min(3, { message: "La descripción es obligatoria." })
    .max(100, {
      message: "La descripción no puede superar los 100 caracteres.",
    }),
  category: z.string().min(1, { message: "Selecciona una categoría." }),
  // Mantine v9 (DateInput) trabaja con strings ISO (YYYY-MM-DD), por lo
  // que el schema valida string y se convierte a Date recién en onSubmit.
  date: z.iso
    .date({ message: "Selecciona una fecha." })
    .min(1, { message: "Selecciona una fecha." }),
  note: z.string().max(300).optional(),
});

/** Formatea un Date como YYYY-MM-DD usando hora local (evita corrimientos por UTC). */
function toLocalISODate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function Transactions() {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("gasto");
  const [showSuccess, setShowSuccess] = useState(false);
  const { createTransaction } = useTransactions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<TransactionDataType>({
    resolver: zodResolver(createTransactionsSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      // Mantine v9 espera un string ISO. Usamos la fecha local actual.
      date: toLocalISODate(new Date()),
      note: "",
    },
  });

  useEffect(() => {
    document.title =
      transactionType === "ingreso" ? "Registrar ingreso" : "Registrar gasto";
  }, [transactionType]);

  const onSubmit = (data: TransactionDataType) => {
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
    console.log("Nueva transacción:", payload);
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
            isValid={isValid}
          />
        </div>
      </div>
    </div>
  );
}

export default Transactions;
