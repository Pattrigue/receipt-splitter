import { Box, Divider, Group, Stack, Title } from "@mantine/core";
import { ColorSchemeToggle } from "./components/ColorSchemeToggle";
import { useReceiptContext } from "./components/ReceiptContext";
import { ReceiptTable } from "./components/ReceiptTable";

export function App() {
  const { itemCount } = useReceiptContext();

  return (
    <Box w="100%" p="xs">
      <Stack>
        <Group justify="space-between">
          <Group gap="sm">
            <Title order={2}>Receipt Splitter</Title>
            <Title order={5}>({itemCount})</Title>
          </Group>
          <ColorSchemeToggle />
        </Group>
        <Divider />
        <ReceiptTable />
      </Stack>
    </Box>
  );
}
