interface TransactionHeaderProps {
  transactionType: "ingreso" | "gasto";
}

export default function TransactionHeader({
  transactionType,
}: TransactionHeaderProps) {
  const isIncome = transactionType === "ingreso";

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-semibold text-foreground">
        {isIncome ? "Registrar ingreso" : "Registrar gasto"}
      </h2>
      <p className="text-muted-foreground mt-1">
        Registra tus ingresos y gastos
      </p>
    </div>
  );
}
