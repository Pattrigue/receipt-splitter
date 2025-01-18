import { Box, Divider, Group, Stack, Title } from "@mantine/core";
import { ColorSchemeToggle } from "./components/ColorSchemeToggle";
import { ReceiptTable } from "./components/ReceiptTable";
import { useState } from "react";
import { Receipt } from "../types";

export function App() {
  const [itemCount, setItemCount] = useState(0);

  const onReceiptChange = (receipt: Receipt) => {
    setItemCount(receipt.items.length);
  };

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
        <ReceiptTable onReceiptChange={onReceiptChange} />
      </Stack>
    </Box>
  );
}
