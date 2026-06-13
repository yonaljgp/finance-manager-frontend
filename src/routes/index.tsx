import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "../pages/home";
import Transactions from "../pages/transactions";
import History from "../pages/history";
import Loans from "../pages/loans";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import Register from "../auth/pages/register";
import LoginPage from "../auth/pages/login";
import NotFound from "../pages/notFound";
import ForgotPassword from "../auth/pages/fotgotPassword";
import VerifyEmail from "../auth/pages/verifyEmail";

const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);
function RoutesPages() {
  return (
    <>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 flex flex-col">
            <Routes>
              //Rutas con Navbar
              <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/crear-transaccion" element={<Transactions />} />
                <Route path="/historial" element={<History />} />
                <Route path="/prestamos" element={<Loans />} />
              </Route>
              //Rutas sin Navbar
              <Route>
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="*" element={<NotFound />} />
                <Route
                  path="/auth/forgot-password"
                  element={<ForgotPassword />}
                />
                <Route path="/auth/verify-email" element={<VerifyEmail />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default RoutesPages;
