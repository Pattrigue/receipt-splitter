import { useReceiptContext } from "@/context/ReceiptContext";
import { calculateReceiptSetTotals, calculateTotals } from "@/utils/receipt-import";
import { Badge, Group, Stack, Text } from "@mantine/core";
import { useMemo } from "react";

export function Footer() {
  const { activeReceipt, participants, receipts } = useReceiptContext();

  const currentTotals = useMemo(
    () => calculateTotals(activeReceipt?.items ?? [], participants),
    [activeReceipt?.items, participants]
  );
  const allTotals = useMemo(
    () => calculateReceiptSetTotals(receipts, participants),
    [participants, receipts]
  );

  return (
    <>
      <Group gap={36} justify="flex-end" h="100%" visibleFrom="sm">
        <DesktopTotalGroup label="Aktuel kvittering" totals={currentTotals} />
        <DesktopTotalGroup label="Alle kvitteringer" totals={allTotals} />
      </Group>
      <Stack gap={8} hiddenFrom="sm" justify="center" mah="100%" style={{ overflowY: "auto" }}>
        <MobileTotalGroup label="Aktuel" totals={currentTotals} />
        <MobileTotalGroup label="Alle" totals={allTotals} />
      </Stack>
    </>
  );
}

type Totals = ReturnType<typeof calculateTotals>;

function formatCurrency(value: number) {
  return `${value.toFixed(2).replace(".", ",")} kr.`;
}

function DesktopTotalGroup({ label, totals }: { label: string; totals: Totals }) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed" fw={600}>
        {label}
      </Text>
      <Group gap={18}>
        {Object.entries(totals.split).length === 0 ? (
          <Text c="dimmed" size="sm">
            Ingen personer
          </Text>
        ) : (
          Object.entries(totals.split).map(([name, value]) => (
            <div key={name}>
              <Text size="xs">{name}</Text>
              <Text size="sm">{formatCurrency(value)}</Text>
            </div>
          ))
        )}
        <div>
          <Text size="xs">Total</Text>
          <Text size="sm">{formatCurrency(totals.totalPrice)}</Text>
        </div>
      </Group>
    </Stack>
  );
}

function MobileTotalGroup({ label, totals }: { label: string; totals: Totals }) {
  const splitEntries = Object.entries(totals.split);

  return (
    <Stack gap={4}>
      <Group justify="space-between" wrap="nowrap">
        <Text size="xs" c="dimmed" fw={600}>
          {label}
        </Text>
        <Text size="sm" fw={600}>
          {formatCurrency(totals.totalPrice)}
        </Text>
      </Group>
      <Group gap={6}>
        {splitEntries.length === 0 ? (
          <Text c="dimmed" size="xs">
            Ingen personer
          </Text>
        ) : (
          splitEntries.map(([name, value]) => (
            <Badge key={name} size="sm" variant="light">
              {name}: {formatCurrency(value)}
            </Badge>
          ))
        )}
      </Group>
    </Stack>
  );
}
