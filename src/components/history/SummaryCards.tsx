type Props = {
  totalIncome: number;
  totalExpense: number;
};

export default function SummaryCards({ totalIncome, totalExpense }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Total Ingresos</p>
        <p className="text-2xl font-semibold text-green-500 mt-2">
          +${totalIncome.toFixed(2)}
        </p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Total Gastos</p>
        <p className="text-2xl font-semibold text-red-500 mt-2">
          -${totalExpense.toFixed(2)}
        </p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Balance Neto</p>
        <p
          className={`text-2xl font-semibold mt-2 ${
            totalIncome - totalExpense >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {totalIncome - totalExpense >= 0 ? "+" : ""}
          {(totalIncome - totalExpense).toFixed(2)} USD
        </p>
      </div>
    </div>
  );
}
