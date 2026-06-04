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
    <div className="mb-6 bg-green-500/10 dark:bg-green-500/20 border border-green-500/20 dark:border-green-500/30 rounded-lg p-4 flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
      <p className="text-green-500 dark:text-green-400 font-medium">
        ¡Transacción registrada exitosamente!
      </p>
    </div>
  );
}
