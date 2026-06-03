import { useState } from "react";
import {
  DollarSign,
  Calendar,
  Tag,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
} from "lucide-react";

export default function Transaction() {
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense",
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const categories = {
    income: ["Salario", "Freelance", "Inversiones", "Ventas", "Otros"],
    expense: [
      "Alimentación",
      "Transporte",
      "Servicios",
      "Entretenimiento",
      "Salud",
      "Educación",
      "Otros",
    ],
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-foreground">
            Nueva Transacción
          </h2>
          <p className="text-muted-foreground mt-1">
            Registra tus ingresos y gastos
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-500/10 dark:bg-green-500/20 border border-green-500/20 dark:border-green-500/30 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
            <p className="text-green-500 dark:text-green-400 font-medium">
              ¡Transacción registrada exitosamente!
            </p>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-8">
          {/* Transaction Type Toggle */}
          <div className="mb-8">
            <label className="text-sm text-muted-foreground mb-3 block">
              Tipo de Transacción
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTransactionType("income")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  transactionType === "income"
                    ? "border-green-500 bg-green-500/10"
                    : "border-border hover:border-green-500/50"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <ArrowUpRight className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="font-medium">Ingreso</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTransactionType("expense")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  transactionType === "expense"
                    ? "border-red-500 bg-red-500/10"
                    : "border-border hover:border-red-500/50"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-red-500/10 p-3 rounded-full">
                    <ArrowDownRight className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="font-medium">Gasto</span>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Monto
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Descripción
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ej: Compra en supermercado"
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Categoría
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-colors text-foreground"
                  required
                >
                  <option value="" className="bg-card">
                    Selecciona una categoría
                  </option>
                  {categories[transactionType].map((category) => (
                    <option key={category} value={category} className="bg-card">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Fecha
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground"
                  required
                />
              </div>
            </div>

            {/* Notes (Optional) */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Notas (opcional)
              </label>
              <textarea
                placeholder="Agrega notas adicionales..."
                rows={4}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-4 rounded-lg font-medium transition-colors ${
                transactionType === "income"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Registrar {transactionType === "income" ? "Ingreso" : "Gasto"}
            </button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Ingresos este mes</p>
            <p className="text-xl font-semibold text-green-500 mt-1">
              +$6,000.00
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Gastos este mes</p>
            <p className="text-xl font-semibold text-red-500 mt-1">
              -$3,200.00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
