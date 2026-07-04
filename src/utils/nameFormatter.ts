/**
 * Normaliza un nombre para mostrarlo de forma corta y legible.
 *
 * Reglas:
 *  - Colapsa espacios múltiples y recorta extremos.
 *  - Devuelve `null` si el valor está vacío o no es un string.
 *  - Si hay 1 palabra → la devuelve capitalizada.
 *  - Si hay 2 palabras → devuelve "Primera Segunda" capitalizadas.
 *  - Si hay 3 o más palabras → devuelve la primera + la tercera
 *    (típico formato hispano: "Nombre SegundoNombre Apellido1 Apellido2"
 *     → "Nombre Apellido1"). Si solo vienen dos palabras más allá de la
 *    primera, se toman las dos primeras.
 *
 * Esto es independiente del backend: el `name` que llega puede ser un
 * nombre completo y nosotros decidimos qué porción mostrar.
 */
export const formatDisplayName = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;

  const cleaned = raw.trim().replace(/\s+/g, " ");
  if (!cleaned) return null;

  const parts = cleaned.split(" ");
  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  if (parts.length === 1) return capitalize(parts[0]);
  if (parts.length === 2)
    return `${capitalize(parts[0])} ${capitalize(parts[1])}`;
  if (parts.length === 3)
    return `${capitalize(parts[0])} ${capitalize(parts[1])}`;

  // 4+ palabras: primer nombre + primer apellido (tercer token, asumiendo
  // "Nombre SegundoNombre Apellido1 Apellido2"). Si la forma del nombre
  // fuera distinta, siempre caemos al "primer nombre + segunda palabra".
  return `${capitalize(parts[0])} ${capitalize(parts[2])}`;
};
