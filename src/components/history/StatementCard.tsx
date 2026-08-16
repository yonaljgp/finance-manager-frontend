import { Modal } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Summary } from "lucide-react";
import { createPDF } from "../../utils/createPDF";
import { api } from "../../services/httpClient";
import { useAuth } from "../../hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { dataStatementType, userType } from "../../types/history";
import { toast } from "sonner";

const dateInputStyles = {
  root: {
    width: "100%",
  },
  label: {
    color: "var(--foreground)",
    marginBottom: "0.35rem",
  },
  input: {
    backgroundColor: "var(--input-background)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
    borderRadius: "0.75rem",
    padding: "0.7rem 0.85rem",
    "&::placeholder": {
      color: "var(--muted-foreground)",
    },
    "&:focus": {
      borderColor: "var(--primary)",
      boxShadow:
        "0 0 0 2px color-mix(in srgb, var(--primary) 20%, transparent)",
    },
  },
};

function StatementCard({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user } = useAuth();

  const dateSchema = z
    .object({
      dateInit: z.preprocess(
        (arg) => {
          if (!arg) return undefined;
          if (arg instanceof Date) return arg;
          if (typeof arg === "string") return new Date(arg);
          if (arg && typeof (arg as any).toDate === "function")
            return (arg as any).toDate();
          return undefined;
        },
        z.date({ message: "La fecha inicial es obligatoria" }),
      ),
      dateEnd: z.preprocess(
        (arg) => {
          if (!arg) return undefined;
          if (arg instanceof Date) return arg;
          if (typeof arg === "string") return new Date(arg);
          if (arg && typeof (arg as any).toDate === "function")
            return (arg as any).toDate();
          return undefined;
        },
        z.date({ message: "La fecha final es obligatoria" }),
      ),
    })
    .refine((d) => d.dateEnd >= d.dateInit, {
      message: "La fecha final debe ser mayor o igual a la fecha inicial",
      path: ["dateEnd"],
    });

  type FormValues = z.infer<typeof dateSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(dateSchema) as unknown as Resolver<FormValues>,
    defaultValues: { dateInit: undefined as any, dateEnd: undefined as any },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    const { dateInit, dateEnd } = values;
    if (!dateInit || !dateEnd) return;
    const dataUser: userType = { name: user.name, email: user.email };
    const params = {
      dateInit: dateInit.toISOString().split("T")[0],
      dateEnd: dateEnd.toISOString().split("T")[0],
    };
    const dataStatement: dataStatementType = await api.get(
      "/transactions/statement",
      { params },
    );
    if (dataStatement.transactions.length === 0) {
      toast.error(
        "No se encontraron transacciones para el rango de fechas seleccionado",
      );
      reset();
      setOpen(false);
      return;
    }
    console.log("dataStatement", dataStatement);
    await createPDF(dataStatement, dataUser);
    reset();
    setOpen(false);
  };

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      centered
      size="md"
      title={
        <span className="text-foreground font-semibold">
          Resumen financiero
        </span>
      }
      classNames={{
        content: "bg-card border border-border rounded-2xl overflow-hidden",
        header: "border-b border-border bg-card",
        body: "bg-card p-0",
      }}
    >
      <div className="flex flex-col gap-8 bg-card px-4 pb-4 pt-2 md:px-6 md:pb-6 text-foreground">
        <div className="rounded-2xl bg-muted/40 p-2">
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Elige tu rango de fechas
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Genera un estado de cuenta financiero .con un rango de fechas
            específico.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-border bg-input-background p-3">
            <Controller
              control={control}
              name="dateInit"
              render={({ field }) => (
                <DateInput
                  label="Fecha inicial"
                  value={field.value}
                  onChange={field.onChange}
                  maxDate={new Date()}
                  placeholder="Selecciona la fecha inicial"
                  className="w-full"
                  styles={dateInputStyles}
                  classNames={{
                    input: "bg-input-background text-foreground",
                    label: "text-foreground",
                    error: "font-bold",
                  }}
                  error={errors.dateInit?.message as any}
                />
              )}
            />
          </div>

          <div className="rounded-xl border border-border bg-input-background p-3">
            <Controller
              control={control}
              name="dateEnd"
              render={({ field }) => (
                <DateInput
                  label="Fecha final"
                  value={field.value}
                  onChange={field.onChange}
                  maxDate={new Date()}
                  placeholder="Selecciona la fecha final"
                  className="w-full"
                  styles={dateInputStyles}
                  classNames={{
                    input: "bg-input-background text-foreground",
                    label: "text-foreground",
                    error: "font-bold",
                  }}
                  error={errors.dateEnd?.message as any}
                />
              )}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="button flex w-full items-center justify-center rounded-xl bg-active px-4 py-2.5 text-sm font-bold tracking-[0.01em] text-white shadow-sm disabled:opacity-60"
        >
          <Summary className="w-5 h-5 mr-2" />
          {isSubmitting ? "Generando..." : "Crear resumen"}
        </button>
      </div>
    </Modal>
  );
}

export default StatementCard;
