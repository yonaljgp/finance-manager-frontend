import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./global.css";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/es";
import RoutesPages from "./routes";
import { mantineTheme } from "./theme/mantineTheme";

dayjs.locale("es");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="auto"
      withCssVariables
      withGlobalClasses
      theme={mantineTheme}
    >
      <DatesProvider settings={{ locale: "es", firstDayOfWeek: 1 }}>
        <RoutesPages />
      </DatesProvider>
    </MantineProvider>
  </StrictMode>,
);
