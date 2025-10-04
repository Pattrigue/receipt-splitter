import { Group, Title } from "@mantine/core";
import { ColorSchemeToggle } from "./ColorSchemeToggle";
import { useReceiptContext } from "./ReceiptContext";

export function Header() {
  const { itemCount } = useReceiptContext();

  return (
    <Group justify="space-between" h="100%" px="md">
      <Group gap="sm">
        <Title order={2}>Receipt Splitter</Title>
        <Title order={5}>({itemCount})</Title>
      </Group>
      <ColorSchemeToggle />
    </Group>
  );
}
