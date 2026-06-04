import { CreditCard, Calendar, AlertCircle } from "lucide-react";
import type Loans from "../../types/loans";

const SEVEN_DAYS_FROM_NOW = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export default function LoanItem({ loan }: { loan: Loans }) {
  const progress =
    ((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) * 100;

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg ${loan.status === "pendiente" ? "bg-purple-500/10" : "bg-green-500/10"}`}
          >
            <CreditCard
              className={`w-6 h-6 ${loan.status === "pendiente" ? "text-purple-500" : "text-green-500"}`}
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
          className={`px-3 py-1 rounded-full text-xs font-medium ${loan.status === "pendiente" ? "bg-orange-500/10 text-orange-500" : "bg-green-500/10 text-green-500"}`}
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
                className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 h-2 rounded-full transition-all"
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
              <p className="font-semibold text-red-500 mt-1">
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
              <div className="mt-4 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 dark:border-orange-500/30 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <p className="text-sm text-orange-500 dark:text-orange-400">
                  Próximo pago en menos de 7 días
                </p>
              </div>
            )}
        </>
      )}

      {loan.status === "pagado" && (
        <div className="bg-green-500/10 dark:bg-green-500/20 border border-green-500/20 dark:border-green-500/30 rounded-lg p-4">
          <p className="text-sm text-green-500 dark:text-green-400 font-medium">
            ✓ Préstamo completamente pagado - $
            {loan.totalAmount.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
