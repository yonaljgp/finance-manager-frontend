import { Search, Download } from "lucide-react";

type Props = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterType: "all" | "ingreso" | "gasto";
  setFilterType: (v: "all" | "ingreso" | "gasto") => void;
};

export default function Filters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filterType === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType("ingreso")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filterType === "ingreso"
                ? "bg-green-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setFilterType("gasto")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filterType === "gasto"
                ? "bg-red-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Gastos
          </button>
        </div>

        <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2">
          <Download className="w-5 h-5" />
          Exportar
        </button>
      </div>
    </div>
  );
}
