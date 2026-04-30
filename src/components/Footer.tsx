import { useReceiptContext } from "@/context/ReceiptContext";
import { calculateReceiptSetTotals, calculateTotals } from "@/utils/receipt-import";
import { Group, Stack, Text } from "@mantine/core";
import { useMemo } from "react";

export function Footer() {
  const { activeReceipt, receipts } = useReceiptContext();

  const currentTotals = useMemo(
    () => calculateTotals(activeReceipt.items),
    [activeReceipt.items]
  );
  const allTotals = useMemo(
    () => calculateReceiptSetTotals(receipts),
    [receipts]
  );

  return (
    <Group gap={36} justify="flex-end" h="100%">
      <TotalGroup label="Aktuel kvittering" totals={currentTotals} />
      <TotalGroup label="Alle kvitteringer" totals={allTotals} />
    </Group>
  );
}

type Totals = ReturnType<typeof calculateTotals>;

function formatCurrency(value: number) {
  return `${value.toFixed(2).replace(".", ",")} kr.`;
}

function TotalGroup({ label, totals }: { label: string; totals: Totals }) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed" fw={600}>
        {label}
      </Text>
      <Group gap={18}>
        <div>
          <Text size="xs">Marie</Text>
          <Text size="sm">{formatCurrency(totals.split.Marie)}</Text>
        </div>
        <div>
          <Text size="xs">Patrick</Text>
          <Text size="sm">{formatCurrency(totals.split.Patrick)}</Text>
        </div>
        <div>
          <Text size="xs">Total</Text>
          <Text size="sm">{formatCurrency(totals.totalPrice)}</Text>
        </div>
      </Group>
    </Stack>
  );
}
