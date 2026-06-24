import { PinInput } from "@mantine/core";
import { useVerifyCode } from "../../../hooks/useVerifyCode";

function VerifyCode() {
  const {
    value,
    setValue,
    isLoading,
    localError,
    segundos,
    isTimerActive,
    email,
    obfuscateEmail,
    handleValidate,
    handleResendCode,
  } = useVerifyCode();

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex gap-8 flex-col items-center justify-evenly bg-card drop-shadow-lg rounded-2xl p-8 h-110 w-full max-w-sm md:max-w-md relative">
        <div>
          <h2 className="mb-5 font-bold text-3xl text-center">
            Recuperar Acceso
          </h2>
          <p className="text-center text-muted-foreground text-sm">
            Ingresa el PIN de seguridad enviado a tu correo{" "}
            <span className="font-semibold text-primary">
              {obfuscateEmail(email)}
            </span>
          </p>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col items-center gap-5"
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

          {localError && (
            <span className="text-red-500 text-sm text-center font-semibold">
              {localError}
            </span>
          )}

          <div className="w-full">
            <button
              onClick={handleResendCode}
              disabled={isTimerActive}
              className="button flex gap-1 mt-1 ml-3 font-semibold text-left text-sm link disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isTimerActive
                ? `Reenviar código (${segundos}s)`
                : "Reenviar código"}
            </button>
          </div>

          <button
            className="button bg-active flex items-center justify-center text-white font-bold rounded-md mt-8 h-10 p-6 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={value.length < 6 || isLoading}
            onClick={handleValidate}
          >
            {isLoading ? "Validando..." : "Validar Código"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyCode;
