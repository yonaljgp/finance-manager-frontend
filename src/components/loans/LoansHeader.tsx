import { Plus } from "lucide-react";

export default function LoansHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">Préstamos</h2>
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
  );
}
