import type { ReceiptItem } from "@/types";
import { type ImportedReceipt, mapImportedReceiptToItems } from "@/utils/receipt-import";
import { Text, Stack } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useCallback } from "react";

interface GlobalJsonDropzoneProps {
  onImportItems: (items: ReceiptItem[]) => void;
}

export function GlobalJsonDropzone({ onImportItems }: GlobalJsonDropzoneProps) {
  const handleDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      const text = await file.text();
      const parsed = JSON.parse(text) as ImportedReceipt;

      onImportItems(mapImportedReceiptToItems(parsed));
    },
    [onImportItems]
  );

  return (
    <Dropzone.FullScreen
      active
      activateOnClick={false}
      multiple={false}
      maxFiles={1}
      accept={{ "application/json": [".json"] }}
      onDrop={(files) => {
        handleDrop(files).catch(() => alert("Failed to import JSON file."));
      }}
    >
      <Stack align="center" justify="center" mih={220} style={{ pointerEvents: "none" }}>
        <Dropzone.Accept>
          <Text fw={600} size="xl">
            Drop JSON to import
          </Text>
        </Dropzone.Accept>
        <Dropzone.Reject>
          <Text fw={600} size="xl">
            Only .json files
          </Text>
        </Dropzone.Reject>
        <Dropzone.Idle>
          <Text fw={600} size="xl">
            Drop JSON to import
          </Text>
        </Dropzone.Idle>
      </Stack>
    </Dropzone.FullScreen>
  );
}