import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { dataStatementType, userType } from "../types/history";

interface statementProps {
  dataStatement: dataStatementType;
  user: userType;
}

const ROWS_PER_PAGE = 15;

const formatDate = (value?: Date | string) => {
  if (!value) return "Sin fecha";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 28,
    backgroundColor: "#ffffff",
    color: "#111827",
    position: "relative",
  },
  letterhead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  brandBlock: {
    flex: 1,
  },
  brand: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4f46e5",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  periodBlock: {
    alignItems: "flex-end",
    minWidth: 170,
  },
  periodLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
  },
  periodValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
  },
  clientBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },
  clientLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  clientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  clientKey: {
    color: "#6b7280",
    width: 90,
  },
  clientValue: {
    flex: 1,
    color: "#111827",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
  },
  summaryIncome: {
    color: "#15803d",
  },
  summaryExpense: {
    color: "#b91c1c",
  },
  summaryTotal: {
    color: "#4f46e5",
  },
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  th: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
  },
  rowAlt: {
    backgroundColor: "#f9fafb",
  },
  colDescription: {
    flex: 2.5,
    paddingRight: 8,
  },
  colCategory: {
    flex: 1.3,
    textAlign: "left",
    paddingRight: 6,
  },
  colDate: {
    flex: 1,
    textAlign: "left",
    paddingRight: 6,
  },
  colType: {
    flex: 0.8,
    textAlign: "left",
    paddingRight: 6,
  },
  colAmount: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
  },
  income: {
    color: "#15803d",
  },
  expense: {
    color: "#b91c1c",
  },
  footer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 9,
    color: "#6b7280",
  },
  copyrightWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 25,
    alignItems: "center",
  },
  Copyright: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
  },
  total: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  emptyRow: {
    paddingVertical: 18,
    color: "#6b7280",
    textAlign: "center",
  },
});

export function Statement({ dataStatement, user }: statementProps) {
  const transactions = dataStatement.transactions ?? [];
  const amount = transactions.reduce(
    (acc, item) => {
      const nextAcc = {
        ingresos: acc.ingresos + (item.type === "ingreso" ? item.amount : 0),
        gastos: acc.gastos + (item.type === "gasto" ? item.amount : 0),
        total:
          item.type === "ingreso"
            ? acc.total + item.amount
            : acc.total - item.amount,
      };

      return nextAcc;
    },
    { ingresos: 0, gastos: 0, total: 0 },
  );

  const pages = [] as Array<typeof transactions>;
  for (let index = 0; index < transactions.length; index += ROWS_PER_PAGE) {
    pages.push(transactions.slice(index, index + ROWS_PER_PAGE));
  }

  if (pages.length === 0) {
    pages.push([]);
  }

  return (
    <Document>
      {pages.map((pageTransactions, pageIndex) => (
        <Page size="A4" style={styles.page} key={`page-${pageIndex}`}>
          <View style={styles.letterhead}>
            <View style={styles.brandBlock}>
              <Text style={styles.brand}>Finance Manager</Text>
              <Text style={styles.subtitle}>Historial de cuenta</Text>
            </View>

            <View style={styles.periodBlock}>
              <Text style={styles.periodLabel}>Periodo</Text>
              <Text style={styles.periodValue}>
                {formatDate(dataStatement.dateInit)} -{" "}
                {formatDate(dataStatement.dateEnd)}
              </Text>
            </View>
          </View>

          <View style={styles.clientBox}>
            <Text style={styles.clientLabel}>Datos del titular</Text>
            <View style={styles.clientRow}>
              <Text style={styles.clientKey}>Nombre:</Text>
              <Text style={styles.clientValue}>{user.name}</Text>
            </View>
            <View style={styles.clientRow}>
              <Text style={styles.clientKey}>Correo:</Text>
              <Text style={styles.clientValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Transacciones</Text>
              <Text style={styles.summaryValue}>{transactions.length}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Ingresos</Text>
              <Text style={[styles.summaryValue, styles.summaryIncome]}>
                {formatMoney(amount.ingresos)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Gastos</Text>
              <Text style={[styles.summaryValue, styles.summaryExpense]}>
                {formatMoney(amount.gastos)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={[styles.summaryValue, styles.summaryTotal]}>
                {formatMoney(amount.total)}
              </Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colDescription]}>
                Descripción
              </Text>
              <Text style={[styles.th, styles.colCategory]}>Categoría</Text>
              <Text style={[styles.th, styles.colDate]}>Fecha</Text>
              <Text style={[styles.th, styles.colType]}>Tipo</Text>
              <Text style={[styles.th, styles.colAmount]}>Monto</Text>
            </View>

            {pageTransactions.length > 0 ? (
              pageTransactions.map((item, index) => {
                const rowStyle =
                  index % 2 === 0
                    ? styles.row
                    : { ...styles.row, ...styles.rowAlt };

                return (
                  <View
                    key={
                      item.id_transactions ??
                      `${item.date}-${item.description}-${index}`
                    }
                    style={rowStyle}
                  >
                    <Text style={styles.colDescription}>
                      {item.description}
                    </Text>
                    <Text style={styles.colCategory}>{item.category}</Text>
                    <Text style={styles.colDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.colType}>{item.type}</Text>
                    <Text
                      style={[
                        styles.colAmount,
                        item.type === "ingreso"
                          ? styles.income
                          : styles.expense,
                      ]}
                    >
                      {item.type === "ingreso" ? "+" : "-"}
                      {formatMoney(item.amount)}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.row}>
                <Text style={[styles.emptyRow, styles.colDescription]}>
                  No hay transacciones registradas en este rango.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Página {pageIndex + 1} de {pages.length}
            </Text>
          </View>

          <View style={styles.copyrightWrap}>
            <Text style={styles.Copyright}>
              © 2026 Finance Manager. Todos los derechos reservados.
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}

Statement.displayName = "Statement";
