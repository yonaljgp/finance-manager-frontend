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
import Register from "./auth/pages/register";
import LoginPage from "./auth/pages/login";
import NotFound from "./pages/notFound";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="auto"
      withCssVariables
      withGlobalClasses
    >
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/crear-transaccion" element={<Transactions />} />
              <Route path="/historial" element={<History />} />
              <Route path="/prestamos" element={<Loans />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
