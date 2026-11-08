import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
  FileText,
  StickyNote,
  Download,
  X,
  ArrowLeftRight,
} from "lucide-react";
import type { TransactionDataType } from "../../types/transactions";
import { formatDate } from "./TransactionsTable";
import { Modal } from "@mantine/core";
import { captureTransactions } from "../../templates/captureTransactions";
import { createCapture } from "../../utils/createCapture";

interface CardTransactionsProps {
  history: TransactionDataType;
  opened: boolean;
  close: () => void;
}

const Capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

function CardTransactions({ history, opened, close }: CardTransactionsProps) {
  const isIncome = history.type === "ingreso";
  const accentColor = isIncome ? "text-income" : "text-expense";
  const accentBg = isIncome ? "bg-income/10" : "bg-expense/10";
  const transaccionActual = history;
  const transactionId = history.id ?? history.id_transactions;

  const handleDownload = async (id: number) => {
    // Detectamos el tema actual
    const isDark =
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-mantine-color-scheme") ===
        "dark" ||
      localStorage.getItem("mantine-color-scheme-value") === "dark";

    // 1. Generamos el HTMLElement del recibo a partir de la plantilla HTML
    const receiptElement = captureTransactions(transaccionActual, isDark);

    // 2. createCapture se encarga de montar, capturar y limpiar
    await createCapture(receiptElement, `recibo_${id}.png`);
  };

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
      <div className="flex flex-col gap-10 p-2">
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
            <h2 className="text-3xl font-semibold text-foreground leading-tight">
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
            icon={<ArrowLeftRight className="w-4 h-4" />}
            label="Número de transacción"
            value={String(transactionId ?? 0).padStart(8, "0")}
          />
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

          {/* ── Nota (opcional) en callout ───────────────────────────── */}
          {history.note && (
            <DetailRow
              icon={<StickyNote className="w-4 h-4" />}
              label="Note"
              value={history.note}
            />
          )}
        </ul>

        {/* ── Acciones ────────────────────────────────────────────── */}
        <footer className="flex justify-center gap-8 pt-8 pb-3 border-t border-border">
          <button
            type="button"
            onClick={() => {
              if (transactionId == null) return;
              void handleDownload(transactionId);
            }}
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
