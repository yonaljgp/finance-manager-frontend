import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Progress, Group } from "@mantine/core";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "debe tener al menos 2 caracteres." })
    .max(40, { message: "debe tener hasta 40 caracteres." }),
  email: z.string().email({ message: "Debe ser un email válido." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." })
    .max(50, { message: "La contraseña puede tener máximo 50 caracteres." })
    .regex(/[A-Z]/, { message: "Debe incluir una mayúscula." })
    .regex(/[a-z]/, { message: "Debe incluir una minúscula." })
    .regex(/[0-9]/, { message: "Debe incluir un número." })
    .regex(/[^a-zA-Z0-9]/, { message: "Debe incluir un carácter especial." }),
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
  if (score < 70) return { label: "Media", color: "yellow" };
  return { label: "Fuerte", color: "green" };
};

function Register() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { password: "" },
  });
  const [viewPassword, setViewPassword] = useState(false);
  const password = useWatch({ control, name: "password", defaultValue: "" });
  const passwordStrength = getPasswordStrength(password);

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    console.log("Register data:", data);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="flex h-150 md:h-160 flex-col items-center justify-center bg-card drop-shadow-lg rounded-2xl py-6 pt-5 w-full max-w-85 md:max-w-md">
        <h1 className="text-3xl font-bold mb-6 mt-2">Registrate</h1>
        <p className="text-sm mb-6">maneja tus finanzas con confianza</p>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Nombre"
              {...register("name")}
              className="border border-gray-300 w-full rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full rounded-md border border-gray-300 py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="absolute inset-y-0 right-3 flex items-center justify-center rounded-full "
              >
                {viewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
            <Group grow gap={5} mt="xs">
              <Progress
                size="xs"
                color={getPasswordLabel(passwordStrength).color}
                value={passwordStrength < 30 ? 0 : 100}
                transitionDuration={0}
              />
              <Progress
                size="xs"
                color={getPasswordLabel(passwordStrength).color}
                transitionDuration={0}
                value={passwordStrength < 30 ? 0 : 100}
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
                value={passwordStrength < 70 ? 0 : 100}
              />
            </Group>
          </div>
          <button
            type="submit"
            className="bg-active text-white py-2 px-4 my-3 rounded-md"
          >
            Registrate
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
