import { Burger, Drawer, Group, Stack, Switch, Title } from "@mantine/core";
import { useReceiptContext } from "@/context/ReceiptContext";
import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import { JsonReceiptImportButton } from "./JsonReceiptImportButton";
import { ParticipantSettings } from "@/components/ParticipantSettings";
import type { Receipt } from "@/types";
import { useCallback, useState } from "react";

interface HeaderProps {
  showName: boolean;
  onShowNameChange: (value: boolean) => void;
}

export function Header({ showName, onShowNameChange }: HeaderProps) {
  const { addReceipts } = useReceiptContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleImport = useCallback(
    (nextReceipts: Receipt[]) => {
      addReceipts(nextReceipts);
      setMenuOpen(false);
    },
    [addReceipts]
  );

  return (
    <Group justify="space-between" h="100%" px="md">
      <Group gap="sm">
        <Title order={2}>Kvitteringsdeler 🧾</Title>
      </Group>

      <Group gap="xl" wrap="nowrap" visibleFrom="sm">
        <JsonReceiptImportButton onImport={handleImport} />
        <ParticipantSettings />
        <Switch
          checked={showName}
          onChange={(e) => onShowNameChange(e.currentTarget.checked)}
          label="Vis varenavne"
        />
        <ColorSchemeToggle />
      </Group>

      <Burger
        aria-label="Åbn menu"
        hiddenFrom="sm"
        onClick={() => setMenuOpen(true)}
        opened={menuOpen}
      />

      <Drawer
        hiddenFrom="sm"
        onClose={() => setMenuOpen(false)}
        opened={menuOpen}
        position="right"
        title="Menu"
      >
        <Stack gap="md">
          <JsonReceiptImportButton fullWidth onImport={handleImport} />
          <ParticipantSettings fullWidth />
          <Group justify="space-between">
            <Switch
              checked={showName}
              onChange={(e) => onShowNameChange(e.currentTarget.checked)}
              label="Vis varenavne"
            />
            <ColorSchemeToggle />
          </Group>
        </Stack>
      </Drawer>
    </Group>
  );
}
