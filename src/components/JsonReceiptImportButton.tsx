import type { Receipt } from "@/types";
import { importReceiptFiles } from "@/utils/receipt-import";
import { Button, FileButton } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { useCallback } from "react";

interface JsonReceiptImportButtonProps {
  onImport: (receipts: Receipt[]) => void;
  fullWidth?: boolean;
}

export function JsonReceiptImportButton({
  fullWidth,
  onImport,
}: JsonReceiptImportButtonProps) {
  const handleImportJson = useCallback(
    async (files: File[]) => {
      try {
        onImport(await importReceiptFiles(files));
      } catch {
        alert("Failed to import JSON file.");
      }
    },
    [onImport]
  );

  return (
    <FileButton
      onChange={(files) => files.length > 0 && handleImportJson(files)}
      accept="application/json"
      multiple
    >
      {(props) => (
        <Button
          {...props}
          fullWidth={fullWidth}
          leftSection={<IconUpload size={16}/>}
          size="xs"
          variant="light"
        >
          Importér JSON
        </Button>
      )}
    </FileButton>
  );
}
