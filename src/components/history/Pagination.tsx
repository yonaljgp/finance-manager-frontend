type Props = {
  count: number;
};

export default function Pagination({ count }: Props) {
  return (
    <div className="border-t border-border px-6 py-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Mostrando {count} transacciones
      </p>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
          Anterior
        </button>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Siguiente
        </button>
      </div>
    </div>
  );
}
