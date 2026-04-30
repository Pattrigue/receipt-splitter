import type { Receipt } from "@/types";
import { importReceiptFiles } from "@/utils/receipt-import";
import { Button, FileButton } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { useCallback } from "react";

interface JsonReceiptImportButtonProps {
  onImport: (receipts: Receipt[]) => void;
}

export function JsonReceiptImportButton({ onImport }: JsonReceiptImportButtonProps) {
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
        <Button {...props} size="xs" variant="light" visibleFrom="sm" leftSection={<IconUpload size={16}/>}>
          Importér JSON
        </Button>
      )}
    </FileButton>
  );
}
