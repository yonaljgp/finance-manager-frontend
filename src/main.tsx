import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import Home from "./pages/home";
import Transactions from "./pages/transactions";
import History from "./pages/history";
import Loans from "./pages/loans";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="auto"
      withCssVariables
      withGlobalClasses
    >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crear-transaccion" element={<Transactions />} />
          <Route path="/historial" element={<History />} />
          <Route path="/prestamos" element={<Loans />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
