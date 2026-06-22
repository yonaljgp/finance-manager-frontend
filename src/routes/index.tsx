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
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import FullPageLoader from "../components/layout/FullPageLoader";

const ProtectedRoutes = () => {
  const { isAuth, isBootstrapping } = useAuth();
  if (isBootstrapping) {
    return <FullPageLoader />;
  }
  if (!isAuth) {
    return <Navigate to="/auth/login" replace />;
  }
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const AuthRoutes = () => {
  const { isAuth, isBootstrapping } = useAuth();
  if (isBootstrapping) {
    return <FullPageLoader />;
  }
  return isAuth ? <Navigate to="/" replace /> : <Outlet />;
};

function RoutesPages() {
  return (
    <>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 flex flex-col">
            <Routes>
              //Rutas Protegidas
              <Route path="/" element={<ProtectedRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/crear-transaccion" element={<Transactions />} />
                <Route path="/historial" element={<History />} />
                <Route path="/prestamos" element={<Loans />} />
              </Route>
              //Rutas Auth
              <Route element={<AuthRoutes />}>
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route
                  path="/auth/forgot-password"
                  element={<ForgotPassword />}
                />
                <Route path="/auth/verify-email" element={<VerifyEmail />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default RoutesPages;
