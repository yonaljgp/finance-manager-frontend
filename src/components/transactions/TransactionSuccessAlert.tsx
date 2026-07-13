import { CheckCircle } from "lucide-react";

interface TransactionSuccessAlertProps {
  visible: boolean;
}

export default function TransactionSuccessAlert({
  visible,
}: TransactionSuccessAlertProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="mb-6 bg-income/10 dark:bg-income/20 border border-income/20 dark:border-income/30 rounded-lg p-4 flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-income dark:text-income" />
      <p className="text-income dark:text-income font-medium">
        ¡Transacción registrada exitosamente!
      </p>
    </div>
  );
}
