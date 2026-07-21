import type { HistoryType } from "../types/history";
// `?raw` le dice a Vite que importe el archivo como string plano.
// Vite lo embebe en el bundle, sin fetch ni dependencia de filesystem.
import receiptTemplate from "./CaptureTransactions.html?raw";

/**
 * Paleta de colores (hex/rgb, nada de oklch) adaptable al tema activo.
 * Se inyecta en la plantilla antes de renderizar para evitar que
 * html2canvas explote al parsear `oklch(...)`.
 */
interface Palette {
  isDark: boolean;
  accentColor: string;
  accentBg: string;
  cardBg: string;
  cardBorder: string;
  mutedBg: string;
  titleColor: string;
  bodyColor: string;
  mutedText: string;
  footerText: string;
}

const lightPalette: Omit<Palette, "isDark"> = {
  accentColor: "", // se setea por tipo
  accentBg: "",
  cardBg: "#ffffff",
  cardBorder: "#e5e7eb",
  mutedBg: "#f9fafb",
  titleColor: "#111827",
  bodyColor: "#1f2937",
  mutedText: "#6b7280",
  footerText: "#9ca3af",
};

const darkPalette: Omit<Palette, "isDark"> = {
  accentColor: "",
  accentBg: "",
  cardBg: "#16161f",
  cardBorder: "#1f2937",
  mutedBg: "#111827",
  titleColor: "#f9fafb",
  bodyColor: "#e5e7eb",
  mutedText: "#9ca3af",
  footerText: "#6b7280",
};

// Paths de los iconos ArrowUp / ArrowDown (Lucide-style)
const ARROW_UP_PATH =
  '<line x1="17" y1="7" x2="7" y2="17"/><polyline points="7 7 17 7 17 17"/>';
const ARROW_DOWN_PATH =
  '<line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/>';

/**
 * Reemplaza todos los placeholders `{{clave}}` en un string.
 * Si un valor no se encuentra en `values`, el placeholder queda vacío.
 */
const fillTemplate = (
  template: string,
  values: Record<string, string>,
): string =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? "");

/**
 * Escapa caracteres HTML para que un valor de texto no rompa la
 * estructura del template ni abra un vector de XSS.
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Genera un HTMLElement con el recibo de la transacción, listo para que
 * `createCapture` lo serialice a PNG.
 *
 * @param data Transacción con la estructura HistoryType
 * @param isDark Si el tema activo es oscuro, ajusta colores del recibo
 * @returns HTMLElement con el recibo renderizado, sin montar en el DOM
 */
export const captureTransactions = (
  data: HistoryType,
  isDark: boolean = false,
): HTMLElement => {
  const isIncome = data.type === "ingreso";
  const base: Omit<Palette, "isDark"> = isDark ? darkPalette : lightPalette;

  const palette: Palette = {
    ...base,
    isDark,
    accentColor: isIncome ? "#16a34a" : "#dc2626",
    accentBg: isIncome ? "rgba(22, 163, 74, 0.12)" : "rgba(220, 38, 38, 0.12)",
  };

  const tipoCapitalizado =
    data.type.charAt(0).toUpperCase() + data.type.slice(1);

  const fechaFormateada = new Date(data.date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

  const montoConSigno = `${isIncome ? "+" : "-"}${data.amount.toFixed(2)} USD`;
  const numeroTransaccion = String(data.id).padStart(8, "0");

  const bloqueNota = data.note
    ? `
        <div style="margin-bottom: 4px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${palette.mutedText}; font-weight: 500; margin-bottom: 2px;">
            Nota
          </div>
          <p style="font-size: 14px; color: ${palette.bodyColor}; margin: 0; word-break: break-word;">${escapeHtml(data.note)}</p>
        </div>`
    : "";

  const values: Record<string, string> = {
    accentColor: palette.accentColor,
    accentBg: palette.accentBg,
    cardBg: palette.cardBg,
    cardBorder: palette.cardBorder,
    mutedBg: palette.mutedBg,
    titleColor: palette.titleColor,
    bodyColor: palette.bodyColor,
    mutedText: palette.mutedText,
    footerText: palette.footerText,
    arrowPath: isIncome ? ARROW_UP_PATH : ARROW_DOWN_PATH,
    tipoCapitalizado,
    montoConSigno,
    numeroTransaccion,
    fechaFormateada,
    descripcion: data.description,
    categoria: data.category,
    bloqueNota,
  };

  const html = fillTemplate(receiptTemplate, values);

  // Convertimos el string HTML a un HTMLElement sin tocar el DOM real.
  // Lo metemos en un wrapper neutro que createCapture sí puede aislar.
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();
  const element = wrapper.firstElementChild as HTMLElement | null;
  if (!element) {
    throw new Error("La plantilla del recibo está vacía o es inválida.");
  }
  return element;
};
