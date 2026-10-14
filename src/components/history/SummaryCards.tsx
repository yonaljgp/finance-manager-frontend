type Props = {
  summary: Summary;
};

type Summary = {
  totalIncome: number;
  totalExpense: number;
  rangeLabel?: string;
};

export default function SummaryCards({ summary }: Props) {
  const stylesCard =
    "bg-card border border-border bg-card-hover transition-colors rounded-xl p-4 md:p-6";

  const labelClass = "text-xs md:text-sm text-muted-foreground";
  const valueClass =
    "text-xl md:text-2xl font-semibold mt-1 md:mt-2 text-income";
  const valueExpenseClass =
    "text-xl md:text-2xl font-semibold mt-1 md:mt-2 text-expense";
  const valueBalanceClass = `text-xl md:text-2xl font-semibold mt-1 md:mt-2 ${
    summary.totalIncome - summary.totalExpense >= 0
      ? "text-income"
      : "text-expense"
  }`;

  const balance = summary.totalIncome - summary.totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
      <div className={stylesCard}>
        <p className={labelClass}>Total Ingresos {summary.rangeLabel}</p>
        <p className={valueClass}>+${summary.totalIncome.toFixed(2)}</p>
      </div>
      <div className={stylesCard}>
        <p className={labelClass}>Total Gastos {summary.rangeLabel}</p>
        <p className={valueExpenseClass}>-${summary.totalExpense.toFixed(2)}</p>
      </div>
      <div className={stylesCard}>
        <p className={labelClass}>Balance Neto {summary.rangeLabel}</p>
        <p className={valueBalanceClass}>
          {balance >= 0 ? "+" : ""}${balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
