import { Group, Title } from "@mantine/core";
import { useReceiptContext } from "@/context/ReceiptContext";
import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";

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
