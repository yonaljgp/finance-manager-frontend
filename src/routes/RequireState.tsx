import { Navigate, useLocation } from "react-router-dom";

interface RequireStateProps {
  /** Claves que deben estar presentes en location.state */
  keys: string[];
  /** Ruta a la que redirigir si falta alguna clave */
  redirectTo: string;
  children: React.ReactNode;
}

/**
 * Guard declarativo que protege rutas que sólo deben ser accesibles
 * cuando se llegó a ellas mediante `navigate(..., { state: { ... } })`.
 *
 * Si alguna de las `keys` requeridas falta en location.state, redirige
 * inmediatamente a `redirectTo` sin renderizar los children.
 */
function RequireState({ keys, redirectTo, children }: RequireStateProps) {
  const location = useLocation();
  const state = location.state as Record<string, unknown> | null;

  const hasAllKeys = keys.every(
    (key) => state !== null && state[key] !== undefined && state[key] !== "",
  );

  if (!hasAllKeys) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default RequireState;
