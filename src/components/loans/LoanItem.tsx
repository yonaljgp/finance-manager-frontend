import { CreditCard, Calendar, AlertCircle } from "lucide-react";
import type { LoanCardType } from "../../types/loans";

const SEVEN_DAYS_FROM_NOW = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export default function LoanItem({ loan }: { loan: LoanCardType }) {
  const progress =
    ((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) * 100;

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg ${loan.status === "pendiente" ? "bg-info/10" : "bg-income/10"}`}
          >
            <CreditCard
              className={`w-6 h-6 ${loan.status === "pendiente" ? "text-info" : "text-income"}`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {loan.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tasa de interés: {loan.interestRate}% anual
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${loan.status === "pendiente" ? "bg-pending/10 text-pending" : "bg-income/10 text-income"}`}
        >
          {loan.status === "pendiente" ? "Pendiente" : "Pagado"}
        </span>
      </div>

      {loan.status === "pendiente" && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso de pago</span>
              <span className="font-medium text-foreground">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-info to-info/80 dark:from-info/90 dark:to-info h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Monto Original</p>
              <p className="font-semibold text-foreground mt-1">
                ${loan.totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Saldo Pendiente</p>
              <p className="font-semibold text-expense mt-1">
                ${loan.remainingAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pago Mensual</p>
              <p className="font-semibold text-foreground mt-1">
                ${loan.monthlyPayment}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Próximo Pago</p>
              <p className="font-semibold text-foreground mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {loan.nextPayment}
              </p>
            </div>
          </div>

          {loan.nextPayment &&
            new Date(loan.nextPayment) < SEVEN_DAYS_FROM_NOW && (
              <div className="mt-4 bg-pending/10 dark:bg-pending/20 border border-pending/20 dark:border-pending/30 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-pending dark:text-pending" />
                <p className="text-sm text-pending dark:text-pending">
                  Próximo pago en menos de 7 días
                </p>
              </div>
            )}
        </>
      )}

      {loan.status === "pagado" && (
        <div className="bg-income/10 dark:bg-income/20 border border-income/20 dark:border-income/30 rounded-lg p-4">
          <p className="text-sm text-income dark:text-income font-medium">
            ✓ Préstamo completamente pagado - $
            {loan.totalAmount.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
