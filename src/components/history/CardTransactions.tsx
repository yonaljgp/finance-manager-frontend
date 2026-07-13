import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
  FileText,
  StickyNote,
  Download,
  X,
} from "lucide-react";
import { type HistoryType } from "../../types/history";
import { formatDate } from "./TransactionsTable";
import { Modal } from "@mantine/core";

interface CardTransactionsProps {
  history: HistoryType;
  opened: boolean;
  close: () => void;
}

const Capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

function CardTransactions({ history, opened, close }: CardTransactionsProps) {
  const isIncome = history.type === "ingreso";
  const accentColor = isIncome ? "text-income" : "text-expense";
  const accentBg = isIncome ? "bg-income/10" : "bg-expense/10";

  return (
    <Modal
      opened={opened}
      onClose={close}
      transitionProps={{
        transition: "fade",
        duration: 200,
        timingFunction: "linear",
      }}
    >
      <div className="flex flex-col gap-6 p-2">
        <header className="flex items-center ml-[25%] gap-4">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${accentBg}`}
            aria-hidden="true"
          >
            {isIncome ? (
              <ArrowUpRight className={`w-7 h-7 ${accentColor}`} />
            ) : (
              <ArrowDownRight className={`w-7 h-7 ${accentColor}`} />
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-foreground leading-tight">
              {Capitalize(history.type)}
            </h2>
          </div>
        </header>

        {/* ── Monto destacado ─────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center py-4 rounded-xl bg-muted/30 border border-border">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Monto
          </span>
          <span
            className={`text-3xl font-bold flex items-center gap-1 ${accentColor}`}
          >
            {isIncome ? "+" : "-"}
            {history.amount.toFixed(2)} USD
          </span>
        </div>

        {/* ── Detalles en lista con íconos ────────────────────────── */}
        <ul className="flex flex-col gap-5 text-sm">
          <DetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Fecha"
            value={formatDate(history.date)}
          />
          <DetailRow
            icon={<FileText className="w-4 h-4" />}
            label="Descripción"
            value={history.description}
          />
          <DetailRow
            icon={<Tag className="w-4 h-4" />}
            label="Categoría"
            value={history.category}
          />
        </ul>

        {/* ── Nota (opcional) en callout ───────────────────────────── */}
        {history.note && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border">
            <StickyNote className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Nota
              </span>
              <p className="text-sm text-foreground wrap-break-words">
                {history.note}
              </p>
            </div>
          </div>
        )}

        {/* ── Acciones ────────────────────────────────────────────── */}
        <footer className="flex justify-center gap-8 pt-8 pb-3 border-t border-border">
          <button
            type="button"
            className="button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       text-foreground bg-card border border-border
                       shadow-sm hover:shadow-md bg-card-hover
"
          >
            <Download className="w-4 h-4" />
            Descargar
          </button>
          <button
            type="button"
            onClick={close}
            className="button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       text-foreground bg-card border border-border
                       shadow-sm hover:shadow-md bg-card-hover
"
          >
            <X className="w-4 h-4" />
            Cerrar
          </button>
        </footer>
      </div>
    </Modal>
  );
}

/* ---------- Subcomponente: fila de detalle con ícono ---------- */
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        <span className="text-sm text-foreground wrap-break-words">
          {value}
        </span>
      </div>
    </li>
  );
}

export default CardTransactions;
