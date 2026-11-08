"use client";

import { Modal, Button, Group, Text } from "@mantine/core";
import useLoans from "../../hooks/useLoans";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface ModalDeleteProps {
  opened: boolean;
  close: () => void;
  id: number | string | null;
}

function ModalDelete({ opened, close, id }: ModalDeleteProps) {
  const { deleteLoan } = useLoans();
  const handleDelete = () => {
    if (id !== null && id !== undefined) {
      deleteLoan(id);
      toast.success("Préstamo eliminado correctamente");
    }
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <span className="font-semibold text-base flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-destructive-foreground" />
          Eliminar Préstamo
        </span>
      }
      centered
      radius="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      classNames={{
        title: "py-4",
      }}
    >
      <Text size="sm">
        ¿Estás seguro de que deseas eliminar este préstamo? Esta acción no se
        puede deshacer.
      </Text>

      <Group justify="center" gap="md" className="mt-6">
        <Button variant="default" onClick={close} radius="md">
          Cancelar
        </Button>
        <Button color="red" onClick={handleDelete} radius="md">
          Eliminar
        </Button>
      </Group>
    </Modal>
  );
}

export default ModalDelete;
