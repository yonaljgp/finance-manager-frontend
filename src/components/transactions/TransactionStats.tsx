export default function TransactionStats() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">Ingresos este mes</p>
        <p className="text-xl font-semibold text-green-500 mt-1">+$6,000.00</p>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">Gastos este mes</p>
        <p className="text-xl font-semibold text-red-500 mt-1">-$3,200.00</p>
      </div>
    </div>
  );
}
