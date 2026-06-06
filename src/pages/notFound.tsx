import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold ">404</h1>
      <h2 className="text-xl font-semibold">¡Página no encontrada!</h2>
      <p className="text-muted-foreground">
        La ruta a la que intentas acceder no existe.
      </p>
      <Link to="/" className="link text-lg">
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFound;
