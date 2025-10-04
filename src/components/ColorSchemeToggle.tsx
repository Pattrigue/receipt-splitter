import { Switch, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const dark = colorScheme === "dark";

  return (
    <Switch
      onChange={toggleColorScheme}
      size="md"
      color={dark ? "dark.4" : "gray.2"}
      onLabel={
        <IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-6)" />
      }
      offLabel={
        <IconMoonStars
          size={16}
          stroke={2.5}
          color="var(--mantine-color-blue-6)"
        />
      }
    />
  );
}
