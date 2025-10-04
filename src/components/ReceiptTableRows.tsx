import type { ReceiptItem } from "@/types";
import { Table, NumberInput, NativeSelect, ActionIcon } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import { useReceiptContext } from "./ReceiptContext";
import { useCallback } from "react";

interface ReceiptTableRowsProps {
  items: ReceiptItem[];
  actionColWidth: number;
}

export function ReceiptTableRows({
  items,
  actionColWidth,
}: ReceiptTableRowsProps) {
  const { setReceipt, onReceiptChange } = useReceiptContext();

  const handleUpdateItem = useCallback(
    (index: number, field: keyof ReceiptItem, value: string | number) => {
      setReceipt((prevReceipt) => {
        const updatedItems = [...prevReceipt.items];
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: value,
        };

        const updatedReceipt = {
          ...prevReceipt,
          items: updatedItems,
        };
        onReceiptChange?.(updatedReceipt);

        return updatedReceipt;
      });
    },
    [setReceipt, onReceiptChange]
  );

  const handleRemoveRow = useCallback(
    (index: number) => {
      setReceipt((prevReceipt) => {
        const updatedReceipt = {
          ...prevReceipt,
          items: prevReceipt.items.filter((_, i) => i !== index),
        };
        onReceiptChange?.(updatedReceipt);

        return updatedReceipt;
      });
    },
    [setReceipt, onReceiptChange]
  );

  const rows = items.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td maw={80}>
        <NumberInput
          size="xs"
          value={item.price}
          allowNegative={false}
          allowLeadingZeros={false}
          decimalSeparator=","
          onChange={(value) => handleUpdateItem(index, "price", value || "")}
        />
      </Table.Td>
      <Table.Td maw={80}>
        <NumberInput
          size="xs"
          value={item.discount}
          allowNegative={false}
          allowLeadingZeros={false}
          decimalSeparator=","
          onChange={(value) => handleUpdateItem(index, "discount", value || "")}
        />
      </Table.Td>
      <Table.Td>
        {(item.price - item.discount).toFixed(2).replace(".", ",")}
      </Table.Td>
      <Table.Td>
        <NativeSelect
          size="xs"
          value={item.buyer}
          data={["Begge", "Marie", "Patrick"]}
          onChange={(event) =>
            handleUpdateItem(
              index,
              "buyer",
              event.currentTarget.value || "Begge"
            )
          }
        />
      </Table.Td>
      <Table.Td w={actionColWidth}>
        {items.length > 1 && (
          <ActionIcon
            color="red"
            onClick={() => handleRemoveRow(index)}
            variant="light"
            tabIndex={-1}
          >
            <IconMinus size={14} />
          </ActionIcon>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return <>{rows}</>;
}
