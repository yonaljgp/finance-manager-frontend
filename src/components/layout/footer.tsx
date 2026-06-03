import ColorSchemeToggle from "./colorSchemeToggle";

function Footer() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl p-4 border-t border-border mt-8">
        <div className="flex items-center justify-end gap-4">
          <ColorSchemeToggle />
        </div>
      </div>
      <div className="text-center pt-6 pb-2">
        <h6 className="text-xs text-muted-foreground ">
          ©2026 Yonalfred Guzmán. Todos los derechos reservados.
        </h6>
      </div>
    </>
  );
}

export default Footer;
