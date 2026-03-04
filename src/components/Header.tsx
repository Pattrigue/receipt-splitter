import { Group, Switch, Title } from "@mantine/core";
import { useReceiptContext } from "@/context/ReceiptContext";
import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import { JsonReceiptImportButton } from "./JsonReceiptImportButton";
import type { ReceiptItem } from "@/types";
import { useCallback } from "react";

interface HeaderProps {
  showName: boolean;
  onShowNameChange: (value: boolean) => void;
}

export function Header({ showName, onShowNameChange }: HeaderProps) {
  const { setReceipt, itemCount } = useReceiptContext();

  const handleImport = useCallback(
    (items: ReceiptItem[]) => setReceipt({ items }),
    [setReceipt]
  );

  return (
    <Group justify="space-between" h="100%" px="md">
      <Group gap="sm">
        <Title order={2}>Receipt Splitter</Title>
        <Title order={5}>({itemCount})</Title>
      </Group>

      <Group gap="xl" wrap="nowrap">
        <JsonReceiptImportButton onImport={handleImport} />
        <Switch
          visibleFrom="sm"
          checked={showName}
          onChange={(e) => onShowNameChange(e.currentTarget.checked)}
          label="Vis varenavne"
        />
        <ColorSchemeToggle />
      </Group>
    </Group>
  );
}