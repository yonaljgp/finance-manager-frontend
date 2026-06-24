import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

// 1. Definir el esquema de validación con Zod
const schema = z.object({
  email: z
    .string()
    .email({ message: "Introduce un formato de correo electrónico válido" }),
});

// Inferir el tipo de TypeScript a partir del esquema
type FormData = z.infer<typeof schema>;

function InputEmail() {
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // 3. Manejar el envío del formulario
  const onSubmit = async (data: FormData) => {
    setLocalError(null);
    try {
      await forgotPassword(data.email);
      navigate("/auth/verify-code", { state: { email: data.email } });
    } catch (err: unknown) {
      setLocalError(
        (err as Error).message || "Ocurrió un error al enviar el correo",
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex gap-2 flex-col items-center justify-evenly bg-card drop-shadow-lg rounded-2xl p-8 h-110 w-full max-w-sm md:max-w-md relative">
        <div className="absolute top-15 right-10 left-10">
          <h2 className="text-primary text-center font-bold text-2xl mb-3">
            Restablece Tu Contraseña
          </h2>
          <p className="text-muted-foreground text-sm text-center">
            Introduce tu correo electrónico asociado a tu cuenta y te enviaremos
            un código de verificación para restablecer tu contraseña
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="absolute w-[70%] top-50 flex flex-col gap-3"
        >
          <input
            {...register("email")}
            type="email"
            placeholder="correo@ejemplo.com"
            className="w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-active"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
          {localError && (
            <span className="text-red-500 text-sm text-center font-semibold mt-1">
              {localError}
            </span>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`button bg-active flex items-center py-2 justify-center rounded-lg text-white mt-4 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Enviando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputEmail;
