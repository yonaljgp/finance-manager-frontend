import { Loader, Center } from "@mantine/core";

export const FullPageLoader = () => {
  return (
    <Center mih="100vh" w="100%">
      <Loader size="lg" />
    </Center>
  );
};

export default FullPageLoader;
