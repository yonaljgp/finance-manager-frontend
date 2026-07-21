import { toPng } from "html-to-image";

/**
 * Captura un HTMLElement como PNG y dispara la descarga.
 *
 * Estrategia anti-parpadeo y anti-oklch:
 *  - Montamos el recibo dentro de un <iframe> con `srcdoc` aislado.
 *    El iframe tiene su propio documento sin variables CSS en oklch
 *    ni estilos de Tailwind/Mantine, así que `html-to-image` no
 *    toca el documento principal y la pantalla no parpadea.
 *  - Capturamos el nodo desde el iframe con `toPng`.
 *  - Limpiamos el iframe pase lo que pase.
 *
 * @param element HTMLElement con el recibo ya renderizado
 * @param nombreArchivo Nombre del archivo a descargar
 */
export const createCapture = async (
  element: HTMLElement,
  nombreArchivo = "comprobante.png",
): Promise<void> => {
  const theme = localStorage.getItem("mantine-color-scheme-value");
  const isDark = theme === "dark";
  const bgColor = isDark ? "#16161f" : "#ffffff";

  // 1. Construimos un HTML mínimo y neutro para el iframe. Sin <link>,
  //    sin @import, sin variables CSS heredadas: solo el recibo y un
  //    fondo controlado. Esto garantiza que la serialización de
  //    html-to-image nunca vea `oklch(...)`.
  const receiptHtml = element.outerHTML.trim();
  const srcdoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: ${bgColor};
        color-scheme: light;
      }
      body { display: inline-block; }
    </style>
  </head>
  <body>${receiptHtml}</body>
</html>`;

  // 2. Creamos un iframe invisible y lo montamos.
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute("tabindex", "-1");
  iframe.style.cssText = [
    "position: fixed",
    "top: 0",
    "left: 0",
    "width: 0",
    "height: 0",
    "border: 0",
    "visibility: hidden",
    "pointer-events: none",
    "z-index: -1",
  ].join(";");

  document.body.appendChild(iframe);

  // 3. Asignamos `srcdoc` y esperamos de forma robusta a que el
  //    documento interno termine de parsearse y el <body> tenga
  //    contenido. El listener debe suscribirse DESPUÉS de la
  //    asignación para no perder el evento en condiciones de carrera.
  const targetDoc = await new Promise<Document>((resolve, reject) => {
    let resolved = false;

    const onLoad = () => {
      if (resolved) return;
      resolved = true;
      const doc = iframe.contentDocument;
      if (!doc || !doc.body || !doc.body.firstElementChild) {
        // El load disparó antes de que el <body> tuviera hijos
        // (raro, pero posible en algunos motores). Esperamos un frame.
        requestAnimationFrame(() => {
          const d = iframe.contentDocument;
          if (d && d.body && d.body.firstElementChild) {
            resolve(d);
          } else {
            reject(new Error("El iframe cargó pero el <body> está vacío."));
          }
        });
      } else {
        resolve(doc);
      }
    };

    iframe.addEventListener("load", onLoad, { once: true });

    // Asignamos srcdoc tras suscribir el listener para evitar la
    // condición de carrera en la que el `load` dispara síncronamente.
    iframe.srcdoc = srcdoc;

    // Fallback: si tras 2 segundos nada ha pasado, abortamos.
    setTimeout(() => {
      if (resolved) return;
      resolved = true;
      reject(new Error("Timeout esperando a que el iframe cargara."));
    }, 2000);
  });

  const target = targetDoc.body.firstElementChild as HTMLElement | null;
  if (!target) {
    document.body.removeChild(iframe);
    throw new Error("El iframe de captura no contiene el recibo.");
  }

  try {
    // 4. toPng: serializa el nodo a SVG <foreignObject> y rasteriza
    //    a PNG. Como el iframe no tiene oklch, el SVG sale limpio.
    const dataUrl = await toPng(target, {
      pixelRatio: 2,
      backgroundColor: bgColor,
    });

    // 5. Descarga.
    const enlace = document.createElement("a");
    enlace.href = dataUrl;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  } catch (error) {
    console.error("Error al generar la imagen:", error);
  } finally {
    // 6. Limpiamos el iframe temporal.
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
};
