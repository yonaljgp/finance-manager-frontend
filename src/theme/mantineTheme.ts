import { createTheme, type MantineThemeOverride } from "@mantine/core";

/**
 * Theme global de Mantine.
 * --------------------------------------------------------------
 * En lugar de hardcodear colores, mapeamos los componentes
 * nativos de Mantine (Modal, Menu, Popover, Drawer, Tooltip,
 * Notifications, Card, Paper) a las variables CSS de tu
 * sistema de diseño (--card, --foreground, --border, etc.).
 *
 * Beneficios:
 *  - El modo claro/oscuro se respeta automáticamente porque
 *    las variables CSS ya cambian según `[data-mantine-color-scheme]`.
 *  - No hace falta tocar cada <Modal> individualmente.
 *  - Tailwind y Mantine quedan visualmente consistentes.
 */
export const mantineTheme: MantineThemeOverride = createTheme({
  primaryColor: "violet",

  // Defaults para los overlays (modal, menu, popover, drawer).
  // Usamos `var(--card)` para que cambie con el tema.
  other: {
    surface: "var(--card)",
    surfaceForeground: "var(--card-foreground)",
    border: "var(--border)",
    foreground: "var(--foreground)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
  },

  components: {
    Modal: {
      defaultProps: {
        centered: true,
        radius: "lg",
        overlayProps: {
          backgroundOpacity: 0.55,
          blur: 3,
        },
      },
      classNames: () => ({
        content:
          "!bg-[var(--card)] !text-[var(--card-foreground)] !border !border-[var(--border)]",
        header: "!bg-[var(--card)] !text-[var(--card-foreground)]",
        body: "!bg-[var(--card)] !text-[var(--card-foreground)]",
        title: "!text-[var(--card-foreground)]",
        close:
          "!text-[var(--muted-foreground)] hover:!text-[var(--foreground)]",
      }),
    },

    Drawer: {
      classNames: () => ({
        content:
          "!bg-[var(--card)] !text-[var(--card-foreground)] !border-[var(--border)]",
        header: "!bg-[var(--card)] !text-[var(--card-foreground)]",
        body: "!bg-[var(--card)] !text-[var(--card-foreground)]",
        title: "!text-[var(--card-foreground)]",
        close:
          "!text-[var(--muted-foreground)] hover:!text-[var(--foreground)]",
      }),
    },

    Menu: {
      classNames: () => ({
        dropdown:
          "!bg-[var(--card)] !text-[var(--card-foreground)] !border-[var(--border)]",
        item: "!text-[var(--card-foreground)] hover:!bg-[var(--accent)] hover:!text-[var(--accent-foreground)]",
        divider: "!border-[var(--border)]",
        label: "!text-[var(--muted-foreground)]",
      }),
    },

    Popover: {
      classNames: () => ({
        dropdown:
          "!bg-[var(--card)] !text-[var(--card-foreground)] !border-[var(--border)]",
        arrow: "!bg-[var(--card)] !border-[var(--border)]",
      }),
    },

    Tooltip: {
      defaultProps: {
        color: "dark",
        withArrow: true,
      },
    },

    Card: {
      defaultProps: {
        radius: "lg",
        withBorder: true,
      },
      classNames: () => ({
        root: "!bg-[var(--card)] !text-[var(--card-foreground)] !border-[var(--border)]",
      }),
    },

    Paper: {
      classNames: () => ({
        root: "!bg-[var(--card)] !text-[var(--card-foreground)]",
      }),
    },
  },
});
