import type { Receipt } from "@/types";
import { importReceiptFiles } from "@/utils/receipt-import";
import { Text, Stack } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useCallback } from "react";

interface GlobalJsonDropzoneProps {
  onImportReceipts: (receipts: Receipt[]) => void;
}

export function GlobalJsonDropzone({ onImportReceipts }: GlobalJsonDropzoneProps) {
  const handleDrop = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      onImportReceipts(await importReceiptFiles(files));
    },
    [onImportReceipts]
  );

  return (
    <Dropzone.FullScreen
      active
      activateOnClick={false}
      multiple
      accept={{ "application/json": [".json"] }}
      onDrop={(files) => {
        handleDrop(files).catch(() => alert("Failed to import JSON file."));
      }}
    >
      <Stack align="center" justify="center" mih={220} style={{ pointerEvents: "none" }}>
        <Dropzone.Accept>
          <Text fw={600} size="xl">
            Drop JSON files to import
          </Text>
        </Dropzone.Accept>
        <Dropzone.Reject>
          <Text fw={600} size="xl">
            Only .json files
          </Text>
        </Dropzone.Reject>
        <Dropzone.Idle>
          <Text fw={600} size="xl">
            Drop JSON files to import
          </Text>
        </Dropzone.Idle>
      </Stack>
    </Dropzone.FullScreen>
  );
}
