import {
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
  Plus,
  AlertCircle,
} from "lucide-react";

const SEVEN_DAYS_FROM_NOW = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export default function Loans() {
  const loans = [
    {
      id: 1,
      name: "Préstamo Personal",
      totalAmount: 10000,
      remainingAmount: 6500,
      monthlyPayment: 350,
      interestRate: 8.5,
      nextPayment: "2026-06-01",
      status: "active",
    },
    {
      id: 2,
      name: "Tarjeta de Crédito",
      totalAmount: 5000,
      remainingAmount: 2000,
      monthlyPayment: 150,
      interestRate: 18.9,
      nextPayment: "2026-06-05",
      status: "active",
    },
    {
      id: 3,
      name: "Préstamo Estudiantil",
      totalAmount: 15000,
      remainingAmount: 0,
      monthlyPayment: 0,
      interestRate: 5.5,
      nextPayment: null,
      status: "paid",
    },
  ];

  const activeLoansSummary = {
    total: loans
      .filter((l) => l.status === "active")
      .reduce((sum, l) => sum + l.remainingAmount, 0),
    monthlyPayment: loans
      .filter((l) => l.status === "active")
      .reduce((sum, l) => sum + l.monthlyPayment, 0),
    count: loans.filter((l) => l.status === "active").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-foreground">
              Préstamos
            </h2>
            <p className="text-muted-foreground mt-1">
              Gestiona tus préstamos y deudas
            </p>
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nuevo Préstamo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 dark:bg-white/10 p-3 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs bg-white/20 dark:bg-white/10 px-3 py-1 rounded-full">
              {activeLoansSummary.count} activos
            </span>
          </div>
          <p className="text-sm opacity-90">Deuda Total</p>
          <p className="text-3xl font-semibold mt-1">
            ${activeLoansSummary.total.toLocaleString()}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Pago Mensual Total</p>
          <p className="text-3xl font-semibold text-foreground mt-1">
            ${activeLoansSummary.monthlyPayment}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Tasa Promedio</p>
          <p className="text-3xl font-semibold text-foreground mt-1">
            {(
              loans
                .filter((l) => l.status === "active")
                .reduce((sum, l) => sum + l.interestRate, 0) /
              activeLoansSummary.count
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-4">
        {loans.map((loan) => {
          const progress =
            ((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) *
            100;

          return (
            <div
              key={loan.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      loan.status === "active"
                        ? "bg-purple-500/10"
                        : "bg-green-500/10"
                    }`}
                  >
                    <CreditCard
                      className={`w-6 h-6 ${
                        loan.status === "active"
                          ? "text-purple-500"
                          : "text-green-500"
                      }`}
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
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    loan.status === "active"
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {loan.status === "active" ? "Activo" : "Pagado"}
                </span>
              </div>

              {loan.status === "active" && (
                <>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Progreso de pago
                      </span>
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

                  {/* Loan Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Monto Original
                      </p>
                      <p className="font-semibold text-foreground mt-1">
                        ${loan.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Saldo Pendiente
                      </p>
                      <p className="font-semibold text-red-500 mt-1">
                        ${loan.remainingAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Pago Mensual
                      </p>
                      <p className="font-semibold text-foreground mt-1">
                        ${loan.monthlyPayment}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Próximo Pago
                      </p>
                      <p className="font-semibold text-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {loan.nextPayment}
                      </p>
                    </div>
                  </div>

                  {/* Next Payment Alert */}
                  {new Date(loan.nextPayment!) < SEVEN_DAYS_FROM_NOW && (
                    <div className="mt-4 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 dark:border-orange-500/30 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                      <p className="text-sm text-orange-500 dark:text-orange-400">
                        Próximo pago en menos de 7 días
                      </p>
                    </div>
                  )}
                </>
              )}

              {loan.status === "paid" && (
                <div className="bg-green-500/10 dark:bg-green-500/20 border border-green-500/20 dark:border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-green-500 dark:text-green-400 font-medium">
                    ✓ Préstamo completamente pagado - $
                    {loan.totalAmount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
