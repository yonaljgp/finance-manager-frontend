import {
  Button,
  Divider,
  Modal,
  NumberInput,
  Select,
  TextInput,
  Radio,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import useToLocalISODate from "../../hooks/useToLocalISODate";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoanSchema, LoanPeriodsType } from "../../types/loans";
import useLoans from "../../hooks/useLoans";

interface ModalFormProps {
  opened: boolean;
  close: () => void;
}

function ModalForm({ opened, close }: ModalFormProps) {
  const { createLoan } = useLoans();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<
    z.input<typeof createLoanSchema>,
    unknown,
    z.output<typeof createLoanSchema>
  >({
    resolver: zodResolver(createLoanSchema),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      name: "",
      amount: 0,
      interestRate: 0,
      description: "",
      interestPeriod: "semanal",
      date: useToLocalISODate(new Date()),
      note: "",
      loanType: "debit",
    },
  });

  const fieldClassNames = {
    label: "!mb-2 !font-medium !text-[var(--muted-foreground)]",
    input:
      "!rounded-lg !border-[var(--border)] !bg-[var(--input-background)] !text-[var(--foreground)] placeholder:!text-[var(--muted-foreground)] focus:!ring-2 focus:!ring-[var(--input-focus)] focus:!border-[var(--input-focus)]",
  };

  const onClose = () => {
    reset();
    close();
  };

  const onSubmit = async (data: z.infer<typeof createLoanSchema>) => {
    console.log("Submitting loan data:", data);
    await createLoan({ loanData: data });
    reset();
    close();
  };

  return (
    <div>
      <Modal
        opened={opened}
        onClose={onClose}
        size="lg"
        centered
        title={
          <span className="text-xl font-semibold text-(card-foreground)">
            Crear Préstamo
          </span>
        }
        classNames={{
          content: "!shadow-2xl",
          header: "!relative",
          title: "!absolute !left-1/2 !-translate-x-1/2 !whitespace-nowrap",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Nombre"
                placeholder="Nombre"
                minLength={3}
                maxLength={100}
                error={errors.name?.message}
                classNames={fieldClassNames}
              />
            )}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Monto"
                placeholder="Monto"
                suffix="$"
                min={0}
                decimalScale={2}
                hideControls
                error={errors.amount?.message}
                classNames={fieldClassNames}
              />
            )}
          />
          <Controller
            name="interestRate"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Tasa de interés"
                placeholder="Tasa de interés"
                suffix="%"
                hideControls
                min={0}
                max={100}
                error={errors.interestRate?.message}
                classNames={fieldClassNames}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Descripción"
                placeholder="Descripción"
                minLength={3}
                maxLength={100}
                error={errors.description?.message}
                classNames={fieldClassNames}
              />
            )}
          />

          <Controller
            name="interestPeriod"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Periodo de Intereses"
                placeholder="Semanal"
                minLength={1}
                error={errors.interestPeriod?.message}
                classNames={{
                  ...fieldClassNames,
                  dropdown:
                    "!border-[var(--border)] !bg-[var(--card)] !text-[var(--card-foreground)]",
                  option:
                    "!text-[var(--card-foreground)] data-[hovered]:!bg-[var(--accent)] data-[hovered]:!text-[var(--accent-foreground)] data-[selected]:!bg-[var(--input-focus)] data-[selected]:!text-[var(--foreground)]",
                }}
                data={LoanPeriodsType}
              />
            )}
          />

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                {...field}
                label="Fecha"
                placeholder="Fecha"
                error={errors.date?.message}
                maxDate={new Date()}
                valueFormat="DD/MM/YYYY"
                classNames={fieldClassNames}
              />
            )}
          />

          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Nota (Opcional)"
                placeholder="Nota"
                minLength={1}
                maxLength={300}
                error={errors.note?.message}
                classNames={fieldClassNames}
              />
            )}
          />
          <Controller
            name="loanType"
            control={control}
            render={({ field }) => (
              <Radio.Group
                {...field}
                label="Tipo de Préstamo"
                error={errors.loanType?.message}
                classNames={{
                  label: "!mb-2 !font-medium !text-[var(--muted-foreground)]",
                  description: "!mb-2 !text-[var(--muted-foreground)]",
                  error: "!text-[var(--error)]",
                }}
              >
                <div className=" flex flex-col md:flex-row gap-4 md-gap-8 text-sm text-foreground">
                  <Radio value="debit" label="Préstamo Otorgado" />
                  <Radio value="credit" label="Préstamo Recibido" />
                </div>
              </Radio.Group>
            )}
          />

          <Divider className="my-4 border-border" />

          <div className="mt-2 flex justify-center gap-10 pt-5">
            <Button type="button" variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="button">
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ModalForm;
