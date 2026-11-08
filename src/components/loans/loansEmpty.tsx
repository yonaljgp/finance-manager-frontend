"use client";

import { Button, Text, Title } from "@mantine/core";
import { HandCoins, Plus } from "lucide-react";

interface LoansEmptyProps {
  openModal: () => void;
}

function LoansEmpty({ openModal }: LoansEmptyProps) {
  return (
    <div className="w-full h-[70vh] max-w-xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
      <div className="card w-full p-8 md:p-12 flex flex-col items-center gap-6 rounded-3xl">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-active/10 text-active border border-active/20 shadow-inner">
          <HandCoins className="w-10 h-10" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-active opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-active"></span>
          </span>
        </div>

        <div className="flex flex-col gap-2 max-w-md">
          <Title order={2} className="text-2xl font-bold tracking-tight">
            Aún no tienes préstamos
          </Title>
          <Text className="text-sm text-muted-foreground">
            Comienza a administrar tus créditos y clientes creando tu primer
            registro de préstamo.
          </Text>
        </div>

        <Button
          size="md"
          radius="xl"
          leftSection={<Plus className="w-4 h-4" />}
          onClick={openModal}
          className="button font-medium bg-active text-white shadow-md "
        >
          Crea tu primer préstamo
        </Button>
      </div>
    </div>
  );
}

export default LoansEmpty;
