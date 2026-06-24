import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Progress, Group } from "@mantine/core";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres." })
      .max(50, { message: "La contraseña puede tener máximo 50 caracteres." })
      .regex(/[A-Z]/, { message: "Debe incluir una mayúscula." })
      .regex(/[a-z]/, { message: "Debe incluir una minúscula." })
      .regex(/[0-9]/, { message: "Debe incluir un número." })
      .regex(/[^a-zA-Z0-9]/, { message: "Debe incluir un carácter especial." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Debes confirmar tu contraseña." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score += 20;
  if (password.length >= 10) score += 10;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  return Math.min(100, score);
};

const getPasswordLabel = (score: number) => {
  if (score < 40) return { label: "Débil", color: "red" };
  if (score < 70) return { label: "Media", color: "#FFAD00" };
  return { label: "Fuerte", color: "green" };
};

function NewPassword() {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();

  const { email, code } = (location.state as { email: string; code: string }) ?? {};

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setLocalError(null);
    setIsLoading(true);
    try {
      await resetPassword(email, code, data.password);
      navigate("/auth/login");
    } catch (err: unknown) {
      setLocalError((err as Error).message || "Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex gap-6 flex-col items-center justify-center bg-card drop-shadow-lg rounded-2xl p-15 h-130 w-full max-w-sm md:max-w-md">
        <div className="mb-4">
          <h2 className="text-primary text-center font-bold text-2xl mb-1">
            Restablecer Contraseña
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Introduce tu nueva contraseña de seguridad.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          {/* Campo Contraseña */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={viewPassword ? "text" : "password"}
                placeholder="Nueva Contraseña"
                {...register("password")}
                className="w-full rounded-md border border-gray-300 py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-active"
              />
              <button
                type="button"
                onClick={() => setViewPassword(!viewPassword)}
                className="absolute inset-y-0 right-3 flex items-center justify-center rounded-full text-gray-500"
              >
                {viewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={viewPassword ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                {...register("confirmPassword")}
                className="w-full rounded-md border border-gray-300 py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-active"
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-sm text-red-500 font-semibold">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <span
              className="text-xs font-semibold text"
              style={{ color: getPasswordLabel(passwordStrength).color }}
            >
              {getPasswordLabel(passwordStrength).label}
            </span>
            <Group grow gap={5}>
              <Progress
                size="xs"
                color={getPasswordLabel(passwordStrength).color}
                value={passwordStrength < 40 ? 0 : 100}
                transitionDuration={0}
              />
              <Progress
                size="xs"
                color={getPasswordLabel(passwordStrength).color}
                transitionDuration={0}
                value={passwordStrength < 50 ? 0 : 100}
              />
              <Progress
                size="xs"
                color={getPasswordLabel(passwordStrength).color}
                transitionDuration={0}
                value={passwordStrength < 60 ? 0 : 100}
              />
              <Progress
                size="xs"
                color={getPasswordLabel(passwordStrength).color}
                transitionDuration={0}
                value={passwordStrength < 90 ? 0 : 100}
              />
            </Group>
          </div>

          {localError && (
            <span className="text-red-500 text-sm text-center font-medium mt-2">
              {localError}
            </span>
          )}

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`button bg-active text-white py-2 px-4 rounded-md mt-6 w-full ${
              isLoading || !isValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Cargando..." : "Restablecer Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
