import { pdf } from "@react-pdf/renderer";
import { Statement } from "../templates/statementPDF";
import type { DataStatementType, UserType } from "../types/history";

export const createPDF = async (
  data: DataStatementType,
  user: UserType,
): Promise<void> => {
  const filename = `estado_de_cuenta_${user.name}.pdf`;
  const documentNode = <Statement dataStatement={data} user={user} />;
  const blob = await pdf(documentNode).toBlob();

  if (!blob) {
    throw new Error("No se pudo generar el PDF.");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
