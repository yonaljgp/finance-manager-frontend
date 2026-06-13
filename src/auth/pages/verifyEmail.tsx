import { PinInput } from "@mantine/core";
import { useState } from "react";

function VerifyEmail() {
  const [value, setValue] = useState("");

  // Función que se dispara únicamente al hacer clic en el botón
  const handleValidate = () => {
    const numberPin = Number(value); // Conversión a número aquí
    console.log("Enviando código para validación (como número):", numberPin);
    // Aquí colocas tu lógica de envío al servidor o API
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex gap-8 flex-col items-center  justify-evenly bg-card drop-shadow-lg rounded-2xl p-8 h-110 w-full max-w-md">
        <div>
          <h2 className="mb-5 font-bold text-3xl text-center">
            Verifica tu correo
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
            onChange={setValue} // Aquí solo establecemos el valor
            classNames={{
              input:
                "!text-center !font-bold focus:!border-active focus:!ring-1 focus:!ring-active",
            }}
            length={6}
            size="lg"
          />

          <button
            className="bg-active flex items-center justify-center text-white cursor-pointer font-bold! rounded-md mt-10 h-10 p-6 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={value.length < 6}
            onClick={handleValidate} // Aquí llamamos a la función declarada
          >
            Validar Código
          </button>
        </form>
      </div>
    </div>
  );
}
export default VerifyEmail;
