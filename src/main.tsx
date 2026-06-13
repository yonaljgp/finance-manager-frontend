import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./global.css";
import { MantineProvider } from "@mantine/core";
import RoutesPages from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="auto"
      withCssVariables
      withGlobalClasses
    >
      <RoutesPages />
    </MantineProvider>
  </StrictMode>,
);
