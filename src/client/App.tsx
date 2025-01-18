import { useState } from "react";
import { Receipt } from "../types";
import { ReceiptTable } from "./components/ReceiptTable";
import { Box, Center, Divider, Stack, Title } from "@mantine/core";

export function App() {
  const [response, setResponse] = useState<Receipt | null>(null);

  return (
    <Box w="100%" p="xs">
      <Stack>
        <Center>
          <Title order={2}>Receipt Splitter</Title>
        </Center>
        <Divider />
        {/* {response ? (
        <div>
          <p>Image uploaded successfully!</p>
          <p>{JSON.stringify(response)}</p>
        </div>
      ) : (
        <AddImageButton onUploadSuccess={setResponse} />
      )} */}
        <ReceiptTable />
      </Stack>
    </Box>
  );
}
