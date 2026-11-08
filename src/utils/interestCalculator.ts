import dayjs from "dayjs";
import type { InterestType, LoanDataType } from "../types/loans";

export interface GenerateInterestsOptions {
  startDate: string;
  amount: number;
  interestPercentage: number;
  period?: LoanDataType["interestPeriod"];
  existingInterests?: InterestType[];
  targetDate?: string | Date | dayjs.Dayjs;
  loanId?: number | string;
}

/**
 * Retorna la etiqueta singular o plural según el período del préstamo.
 */
export function getPeriodLabel(
  period?: LoanDataType["interestPeriod"],
  count: number = 1,
): string {
  switch (period) {
    case "Quincenal":
      return count === 1 ? "Quincena" : "Quincenas";
    case "Mensual":
      return count === 1 ? "Mes" : "Meses";
    case "Semanal":
    default:
      return count === 1 ? "Semana" : "Semanas";
  }
}

/**
 * Calcula el monto del interés correspondiente al porcentaje sobre el monto prestado.
 */
export function calculateInterestAmount(
  amount: number,
  interestPercentage: number,
): number {
  if (amount <= 0 || interestPercentage <= 0) return 0;
  return Number(((amount * interestPercentage) / 100).toFixed(2));
}

/**
 * Genera automáticamente todas las cuotas de interés desde la fecha de inicio
 * hasta la fecha actual (más la próxima cuota a vencer), respetando el período
 * (semanal = cada 7 días, quincenal = cada 14 días, mensual = cada mes)
 * y preservando los pagos ya registrados.
 */
export function generateInterestsUpToDate({
  startDate,
  amount,
  interestPercentage,
  period = "Semanal",
  existingInterests = [],
  targetDate,
  loanId,
}: GenerateInterestsOptions): InterestType[] {
  if (!startDate || amount <= 0) return existingInterests;

  const interestAmount = calculateInterestAmount(amount, interestPercentage);
  const baseDate = dayjs(startDate).startOf("day");
  if (!baseDate.isValid()) return existingInterests;

  const today = (targetDate ? dayjs(targetDate) : dayjs()).startOf("day");

  // Mapeamos los intereses existentes para conservar su estado de cobrado/pendiente
  const existingMap = new Map<number, InterestType>();
  existingInterests.forEach((item, index) => {
    const num = item.weekNumber || index + 1;
    existingMap.set(num, item);
  });

  const result: InterestType[] = [];
  let step = 1;
  let keepGoing = true;

  while (keepGoing) {
    let nextDate = baseDate;

    if (period === "Quincenal") {
      nextDate = baseDate.add(step * 14, "day");
    } else if (period === "Mensual") {
      nextDate = baseDate.add(step, "month");
    } else {
      // Semanal: cada 7 días
      nextDate = baseDate.add(step * 7, "day");
    }

    if (existingMap.has(step)) {
      // Conservar la cuota existente intacta (con su paid y paidAt)
      result.push(existingMap.get(step)!);
    } else {
      // SOLO generar automáticamente si el período ya se ha cumplido (nextDate <= today)
      if (nextDate.isAfter(today)) {
        keepGoing = false;
        break;
      }

      const nextDateFormatted = nextDate.format("YYYY-MM-DD");
      const uniqueId = loanId ? Number(`${loanId}${step}`) : Date.now() + step;

      result.push({
        id: uniqueId,
        weekNumber: step,
        amount: interestAmount,
        rate: interestPercentage,
        paymentDate: nextDateFormatted,
        paid: false,
        paidAt: null,
      });
    }

    // Si la fecha ya superó hoy, detenemos el ciclo
    if (nextDate.isAfter(today)) {
      keepGoing = false;
    }

    step++;

    // Límite de seguridad
    if (step > 300) {
      break;
    }
  }

  // Conservar cualquier cuota agregada manualmente que esté más allá del step
  existingInterests.forEach((item) => {
    if (
      !result.some((r) => r.weekNumber === item.weekNumber || r.id === item.id)
    ) {
      result.push(item);
    }
  });

  // Ordenar cronológicamente por número de cuota
  result.sort((a, b) => a.weekNumber - b.weekNumber);

  return result;
}

/**
 * Sincroniza un préstamo calculando sus cuotas de interés hasta el día de hoy.
 */
export function syncLoanInterests(
  loan: LoanDataType,
  targetDate?: string | Date,
): LoanDataType {
  const updatedInterests = generateInterestsUpToDate({
    startDate: loan.date,
    amount: loan.amount - (loan.principalAmount || 0),
    interestPercentage: loan.interestRate,
    period: loan.interestPeriod,
    existingInterests: loan.interests ?? [],
    targetDate,
    loanId: loan.id,
  });

  return {
    ...loan,
    interests: updatedInterests,
  };
}

/**
 * Genera manualmente la siguiente cuota de interés para un préstamo.
 */
export function generateNextInterestWeek(loan: LoanDataType): InterestType {
  const currentInterests = loan.interests ?? [];
  const nextWeekNumber = currentInterests.length + 1;
  const weeklyAmount = calculateInterestAmount(
    loan.amount - (loan.principalAmount || 0),
    loan.interestRate,
  );

  let nextDate = dayjs(loan.date);

  if (currentInterests.length > 0) {
    const lastInterest = currentInterests[currentInterests.length - 1];
    const lastDate = dayjs(lastInterest.paymentDate);
    if (loan.interestPeriod === "Quincenal") {
      nextDate = lastDate.add(14, "day");
    } else if (loan.interestPeriod === "Mensual") {
      nextDate = lastDate.add(1, "month");
    } else {
      nextDate = lastDate.add(7, "day");
    }
  } else {
    if (loan.interestPeriod === "Quincenal") {
      nextDate = nextDate.add(14, "day");
    } else if (loan.interestPeriod === "Mensual") {
      nextDate = nextDate.add(1, "month");
    } else if (loan.interestPeriod === "Anual") {
      nextDate = nextDate.add(1, "year");
    } else {
      nextDate = nextDate.add(7, "day");
    }
  }

  return {
    id: Date.now(),
    weekNumber: nextWeekNumber,
    amount: weeklyAmount,
    rate: loan.interestRate,
    paymentDate: nextDate.format("YYYY-MM-DD"),
    paid: false,
    paidAt: null,
  };
}

/**
 * Calcula totales e información de resumen sobre las cuotas de intereses.
 */
export function calculateInterestsSummary(interests: InterestType[] = []) {
  const totalWeeks = interests.length;
  const paidWeeks = interests.filter((i) => i.paid).length;
  const pendingWeeks = totalWeeks - paidWeeks;

  const totalAmount = interests.reduce((acc, curr) => acc + curr.amount, 0);
  const paidAmount = interests
    .filter((i) => i.paid)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return {
    totalWeeks,
    paidWeeks,
    pendingWeeks,
    totalAmount,
    paidAmount,
    pendingAmount,
    allPaid: totalWeeks > 0 && paidWeeks === totalWeeks,
  };
}
