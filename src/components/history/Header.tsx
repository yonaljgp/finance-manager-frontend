import { Download } from "lucide-react";

function Header() {
  return (
    <div className="flex  items-start md:items-center justify-between gap-4 mb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-foreground">
          Historial de Transacciones
        </h2>
        <p className="text-muted-foreground mt-1">
          Visualiza y analiza todas tus transacciones
        </p>
      </div>
      <div>
        <button
          type="button"
          className="flex-1 px-6 py-3 bg-card text-accent-foreground rounded-lg bg-card-hover transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <p className="hidden md:block">Exportar</p>
        </button>
      </div>
    </div>
  );
}

export default Header;
