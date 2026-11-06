import { z } from "zod";

export const LoanPeriodsType = [
  "semanal",
  "quincenal",
  "mensual",
  "anual",
] as const;

export type InterestType = {
  id: number | string;
  weekNumber: number;
  amount: number;
  rate: number;
  paymentDate: string;
  paid: boolean;
  paidAt?: string | null;
};

export type LoanDataType = {
  id?: number;
  name: string;
  description: string;
  amount: number;
  interestRate: number;
  interestperiod: (typeof LoanPeriodsType)[number];
  paymentDate: string;
  loanType: "debit" | "credit";
  status?: "Pendiente" | "Pagado";
  installmentsCount?: number;
  interests?: InterestType[];
  note?: string;
};

export type LoanDataFormType = {
  name: string;
  description: string;
  amount: number;
  interestRate: number;
  interestPeriod: (typeof LoanPeriodsType)[number];
  date: string;
  loanType: "debit" | "credit";
  note?: string;
};

export type LoanCardType = {
  id: number;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  nextPayment: string | null;
  status: "pendiente" | "pagado";
};

export const createLoanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "El nombre es obligatorio." })
    .max(100, {
      message: "El nombre no puede superar los 100 caracteres.",
    }),
  amount: z
    .number({ message: "El monto es obligatorio." })
    .min(1, { message: "El monto debe ser mayor que cero." })
    .positive({ message: "El monto debe ser mayor que cero." }),
  interestRate: z
    .number({ message: "La tasa de interés es obligatoria." })
    .min(0, { message: "La tasa de interés debe ser al menos 0." })
    .max(100, { message: "La tasa de interés no puede superar 100." }),
  description: z
    .string()
    .trim()
    .min(3, { message: "La descripción es obligatoria." })
    .max(100, {
      message: "La descripción no puede superar los 100 caracteres.",
    }),
  interestPeriod: z.enum(LoanPeriodsType),
  date: z.iso
    .date({ message: "Selecciona una fecha." })
    .min(1, { message: "Selecciona una fecha." }),
  note: z.string().trim().max(300).optional(),
  loanType: z.enum(["debit", "credit"], {
    message: "Selecciona un tipo de préstamo.",
  }),
});
