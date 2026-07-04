import { Loader, Center } from "@mantine/core";

export const FullPageLoader = () => {
  return (
    <Center mih="100vh" w="100%">
      <Loader size="lg" color="oklch(0.627 0.265 303.9)" />
    </Center>
  );
};

export default FullPageLoader;
