export const FullPageLoader = () => {
  return (
    <div
      className="flex h-screen justify-center items-center gap-2"
      role="status"
      aria-label="Loading"
    >
      <span
        className="size-3 animate-bounce rounded-full bg-active"
        aria-hidden="true"
      ></span>
      <span
        className="size-3 animate-bounce rounded-full bg-active [animation-delay:0.2s]"
        aria-hidden="true"
      ></span>
      <span
        className="size-3 animate-bounce rounded-full bg-active [animation-delay:0.4s]"
        aria-hidden="true"
      ></span>
    </div>
  );
};

export default FullPageLoader;
