import { AreaChart, RadarChart, BarChart } from "@mantine/charts";
import type { TransactionType, DateFilterType } from "../../types/history";
import { MONTHS } from "../../utils/buildDateSelect";

interface Props {
  Transactions: TransactionType[];
  filterDate: DateFilterType;
}

interface Bucket {
  label: string;
  Ingresos: number;
  Gastos: number;
}
const pad = (n: number) => String(n).padStart(2, "0");

/** Configuración de agrupación: cantidad de buckets y extractor de bucketKey desde la fecha. */
type AxisConfig = {
  count: number;
  title: string;
  hint: string;
  getKey: (d: Date) => string;
};

function buildAxis(filterDate: DateFilterType): AxisConfig {
  const year = filterDate.year ?? new Date().getFullYear();
  const month = filterDate.month; // 1..12 o null

  if (month == null) {
    return {
      count: 12,
      title: `Resumen ${year}`,
      hint: "Agrupado por mes",
      getKey: (d) => String(d.getMonth() + 1),
    };
  }

  const lastDay = new Date(year, month, 0).getDate();
  const monthName = MONTHS.find((m) => m.value === String(month))?.label;
  return {
    count: lastDay,
    title: `Resumen ${monthName} ${year}`,
    hint: "Agrupado por día",
    getKey: (d) => pad(d.getDate()),
  };
}

function DashboardStatement({ Transactions, filterDate }: Props) {
  const { count, title, hint, getKey } = buildAxis(filterDate);

  // Construye N buckets vacíos (meses o días según granularidad)
  const buckets: Bucket[] = Array.from({ length: count }, (_, i) => ({
    label: pad(i + 1),
    Ingresos: 0,
    Gastos: 0,
  }));

  // Suma cada transacción en su bucket correspondiente
  for (const t of Transactions) {
    if (!t.date) continue;
    const d = new Date(t.date);
    if (Number.isNaN(d.getTime())) continue;
    const idx = Number(getKey(d)) - 1;
    if (idx < 0 || idx >= count) continue;
    const target = buckets[idx];
    if (t.type === "ingreso") target.Ingresos += Math.abs(t.amount);
    else target.Gastos += Math.abs(t.amount);
  }

  // Redondea
  for (const b of buckets) {
    b.Ingresos = Number(b.Ingresos.toFixed(2));
    b.Gastos = Number(b.Gastos.toFixed(2));
  }

  return (
    <div className="flex flex-col gap-10 ">
      <div className="bg-card border border-border bg-card-hover transition-colors rounded-xl p-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground mb-2">{hint}</p>
        <div className="hidden md:block">
          <AreaChart
            h={450}
            data={buckets}
            dataKey="label"
            gridAxis="none"
            curveType="natural"
            fillOpacity={0.43}
            series={[
              { name: "Ingresos", color: "green.6" },
              { name: "Gastos", color: "red.6" },
            ]}
          />
        </div>
        <div className="block md:hidden">
          <BarChart
            h={300}
            data={buckets}
            dataKey="label"
            series={[
              { name: "Ingresos", color: "green.6" },
              { name: "Gastos", color: "red.6" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardStatement;
