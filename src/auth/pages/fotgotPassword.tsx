import { PinInput } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  // 1. Usamos el estado para guardar el valor del PIN
  const [value, setValue] = useState("");
  const [isLoading, setIsLoaading] = useState(false);
  const navigate = useNavigate();

  const handleValidate = async () => {
    const numberPin = Number(value);
    setIsLoaading(true);
    try {
      const sendPin = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pin: numberPin }),
        },
      );
      setIsLoaading(false);
      if (sendPin.ok) {
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("Error sending pin:", err);
      navigate(0);
    }

    // Aquí tu lógica de envío o validación
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex gap-8 flex-col items-center  justify-evenly bg-card drop-shadow-lg rounded-2xl p-8 h-110 w-full max-w-sm md:max-w-md">
        <div>
          <h2 className="mb-5 font-bold text-3xl text-center">
            Recuperar Acceso
          </h2>
          <p className=" text-center">
            Ingresa el PIN de seguridad enviado a tu correo{" "}
            {"yo********@gmail.com"}
          </p>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col items-center gap-6"
        >
          <PinInput
            type="number"
            value={value}
            autoFocus
            onChange={setValue}
            classNames={{
              input:
                "!text-center !font-bold focus:!border-active focus:!ring-1 focus:!ring-active",
            }}
            length={6}
            size="lg"
          />

          <button
            className={`button bg-active flex items-center justify-center text-white font-bold! rounded-md mt-10 h-10 p-6 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={value.length < 6}
            onClick={handleValidate}
          >
            {isLoading ? "Validando..." : "Validar Código"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ForgotPassword;
