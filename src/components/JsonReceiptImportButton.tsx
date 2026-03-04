import type { ReceiptItem } from "@/types";
import { type ImportedReceipt, mapImportedReceiptToItems } from "@/utils/receipt-import";
import { Button, FileButton } from "@mantine/core";
import { useCallback } from "react";

interface JsonReceiptImportButtonProps {
  onImport: (items: ReceiptItem[]) => void;
}

export function JsonReceiptImportButton({ onImport }: JsonReceiptImportButtonProps) {
  const handleImportJson = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as ImportedReceipt;
        onImport(mapImportedReceiptToItems(parsed));
      } catch {
        alert("Failed to import JSON file.");
      }
    },
    [onImport]
  );

  return (
    <FileButton onChange={(file) => file && handleImportJson(file)} accept="application/json">
      {(props) => (
        <Button {...props} size="xs" variant="light">
          Import JSON
        </Button>
      )}
    </FileButton>
  );
}