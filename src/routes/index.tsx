import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const Dashboard = lazy(() => import("../pages/dashboard"));
const RequireState = lazy(() => import("../utils/RequireState"));
const Transactions = lazy(() => import("../pages/transactions"));
const History = lazy(() => import("../pages/history"));
const Loans = lazy(() => import("../pages/loans"));
const Navbar = lazy(() => import("../components/layout/navbar"));
const Footer = lazy(() => import("../components/layout/footer"));
const Register = lazy(() => import("../auth/pages/register"));
const LoginPage = lazy(() => import("../auth/pages/login"));
const NotFound = lazy(() => import("../pages/notFound"));
const InputEmail = lazy(
  () => import("../auth/pages/forgotPassword/inputEmail"),
);
const VerifyCode = lazy(
  () => import("../auth/pages/forgotPassword/verifyCode"),
);
const NewPassword = lazy(
  () => import("../auth/pages/forgotPassword/newPassword"),
);
import FullPageLoader from "../components/layout/FullPageLoader";
import { Toaster } from "sonner";

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
            <Suspense fallback={<FullPageLoader />}>
              <Toaster
                richColors
                position="top-right"
                toastOptions={{
                  style: {
                    background: "var(--card)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
                  },
                }}
              />
              <Routes>
                {/* Rutas Protegidas */}
                <Route path="/" element={<ProtectedRoutes />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/crear-transaccion" element={<Transactions />} />
                  <Route path="/historial" element={<History />} />
                  <Route path="/prestamos" element={<Loans />} />
                </Route>
                {/* Rutas Auth */}
                <Route element={<AuthRoutes />}>
                  <Route path="/auth/register" element={<Register />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route
                    path="/auth/forgot-password"
                    element={<InputEmail />}
                  />
                  <Route
                    path="/auth/verify-code"
                    element={
                      <RequireState
                        keys={["email"]}
                        redirectTo="/auth/forgot-password"
                      >
                        <VerifyCode
                          title="Recuperar Acceso"
                          kind="password"
                          navigateTo="/auth/reset-password"
                          fetchTo="/auth/password/forgot"
                        />
                      </RequireState>
                    }
                  />
                  <Route
                    path="/auth/reset-password"
                    element={
                      <RequireState
                        keys={["email", "code"]}
                        redirectTo="/auth/forgot-password"
                      >
                        <NewPassword />
                      </RequireState>
                    }
                  />
                  <Route
                    path="/auth/validate-email"
                    element={
                      <RequireState
                        keys={["email"]}
                        redirectTo="/auth/register"
                      >
                        <VerifyCode
                          title="Valida tu Cuenta"
                          kind="email"
                          navigateTo="/auth/login"
                          fetchTo="/auth/email/send-code"
                        />
                      </RequireState>
                    }
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default RoutesPages;
