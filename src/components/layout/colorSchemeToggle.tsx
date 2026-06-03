import { useMantineColorScheme, Switch } from "@mantine/core";
import { Moon, Sun } from "lucide-react";

function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  return (
    <div>
      <Switch
        checked={colorScheme === "dark"}
        onChange={(event) =>
          setColorScheme(event.currentTarget.checked ? "dark" : "light")
        }
        size="xl"
        color="primary"
        onLabel={<Sun size={16} color="yellow" />}
        offLabel={<Moon size={16} color="blue" />}
      />
    </div>
  );
}

export default ColorSchemeToggle;
