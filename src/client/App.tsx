import { useState } from "react";
import { Receipt } from "../types";
import { ReceiptTable } from "./components/ReceiptTable";
import { Box, Center, Divider, Group, Stack, Title } from "@mantine/core";
import { ColorSchemeToggle } from "./components/ColorSchemeToggle";

export function App() {
  const [response, setResponse] = useState<Receipt | null>(null);

  return (
    <Box w="100%" p="xs">
      <Stack>
        <Group justify="space-between">
          <Title order={2}>Receipt Splitter</Title>
          <ColorSchemeToggle />
        </Group>
        <Divider />
        <ReceiptTable />
      </Stack>
    </Box>
  );
}
