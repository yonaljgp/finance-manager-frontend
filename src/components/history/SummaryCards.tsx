type Props = {
  totalIncome: number;
  totalExpense: number;
  rangeLabel?: string;
};

export default function SummaryCards({
  totalIncome,
  totalExpense,
  rangeLabel = "",
}: Props) {
  const stylesCard =
    "bg-card border border-border bg-card-hover transition-colors rounded-xl p-6";

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1  md:grid-cols-3 gap-6 mb-8">
      <div className={stylesCard}>
        <p className="text-sm text-muted-foreground">
          Total Ingresos {rangeLabel}
        </p>
        <p className="text-2xl font-semibold text-income mt-2">
          +${totalIncome.toFixed(2)}
        </p>
      </div>
      <div className={stylesCard}>
        <p className="text-sm text-muted-foreground">
          Total Gastos {rangeLabel}
        </p>
        <p className="text-2xl font-semibold text-expense mt-2">
          -${totalExpense.toFixed(2)}
        </p>
      </div>
      <div className={stylesCard}>
        <p className="text-sm text-muted-foreground">
          Balance Neto {rangeLabel}
        </p>
        <p
          className={`text-2xl font-semibold mt-2 ${
            balance >= 0 ? "text-income" : "text-expense"
          }`}
        >
          {balance >= 0 ? "+" : ""}
          {balance.toFixed(2)} USD
        </p>
      </div>
    </div>
  );
}
