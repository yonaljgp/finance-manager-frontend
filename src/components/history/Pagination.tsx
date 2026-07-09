import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

/** Genera lista de páginas con elipsis, p.ej. [1, "…", 4, 5, 6, "…", 12]. */
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const list: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) list.push("…");
  for (let i = start; i <= end; i++) list.push(i);
  if (end < total - 1) list.push("…");
  list.push(total);
  return list;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: Props) {
  const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);
  const pages = buildPageList(safePage, totalPages);

  return (
    <div className="border-t border-border px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {totalItems === 0
          ? "Sin resultados"
          : `Mostrando ${start}–${end} de ${totalItems} transacciones`}
      </p>

      <nav className="flex items-center gap-1" aria-label="Paginación">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-muted-foreground select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === safePage ? "page" : undefined}
              className={`min-w-9 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                p === safePage
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}
