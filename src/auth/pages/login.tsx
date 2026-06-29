import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Debe ser un email válido." }),
  password: z.string().min(6, { message: "Almenos 6 caracteres" }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [viewPassword, setViewPassword] = useState(false);
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const { email, password } = data;
    try {
      await login(email, password);
      navigate("/"); // Redirigir tras éxito
    } catch (err) {
      // El error ya se captura en el estado 'authError' del hook
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex h-60vhp md:h-130 flex-col items-center justify-center bg-card drop-shadow-lg rounded-2xl p-6 pt-5 w-full max-w-85 md:max-w-sm">
        <h1 className="text-3xl font-bold mb-10 mt-6">Inicia Sesión</h1>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-active"
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={viewPassword ? "text" : "password"}
                placeholder="Contraseña"
                {...register("password")}
                className="w-full rounded-md border border-gray-300 py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-active"
              />
              <button
                type="button"
                onClick={() => setViewPassword(!viewPassword)}
                aria-label={
                  viewPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                title={
                  viewPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="button absolute inset-y-0 right-3 flex items-center justify-center rounded-full text-gray-500"
              >
                {viewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
            <p className="flex gap-1 mt-1 font-semibold text-sm">
              <Link to="/auth/forgot-password" className="link font-bold">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>

          {authError && (
            <p className="text-sm text-red-500 text-center font-semibold">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`button bg-active text-white py-2 px-4 rounded-md ${isLoading || !isValid ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Iniciando sesión..." : "Login"}
          </button>
        </form>
        <div className="flex items-center gap-2 my-6">
          <p className="flex gap-1 text-sm">
            ¿No tienes una cuenta?
            <Link to="/auth/register" className="link font-bold">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
