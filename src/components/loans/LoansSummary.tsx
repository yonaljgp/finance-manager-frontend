type Props = {
  total: number;
  monthlyPayment: number;
  count: number;
  avgRate: number;
};

export default function LoansSummary({
  total,
  monthlyPayment,
  count,
  avgRate,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-active text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/20 dark:bg-white/10 p-3 rounded-lg"> </div>
          <span className="text-xs bg-white/20 dark:bg-white/10 px-3 py-1 rounded-full">
            {count} activos
          </span>
        </div>
        <p className="text-sm opacity-90">Deuda Total</p>
        <p className="text-3xl font-semibold mt-1">${total.toLocaleString()}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-500/10 p-3 rounded-lg"></div>
        </div>
        <p className="text-sm text-muted-foreground">Pago Mensual Total</p>
        <p className="text-3xl font-semibold text-foreground mt-1">
          ${monthlyPayment}
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-orange-500/10 p-3 rounded-lg"></div>
        </div>
        <p className="text-sm text-muted-foreground">Tasa Promedio</p>
        <p className="text-3xl font-semibold text-foreground mt-1">
          {avgRate.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
