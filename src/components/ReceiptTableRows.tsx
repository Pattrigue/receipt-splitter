import type { ReceiptItem } from "@/types";
import { Table, NumberInput, NativeSelect, ActionIcon, TextInput } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import { useReceiptContext } from "../context/ReceiptContext";
import { useCallback } from "react";
import { SHARED_BUYER, SHARED_BUYER_LABEL } from "@/utils/receipt-import";

interface ReceiptTableRowsProps {
  items: ReceiptItem[];
  actionColWidth: number;
  showName?: boolean;
}

export function ReceiptTableRows({
  items,
  actionColWidth,
  showName
}: ReceiptTableRowsProps) {
  const { participants, updateActiveReceipt } = useReceiptContext();

  const handleUpdateItem = useCallback(
    (index: number, field: keyof ReceiptItem, value: string | number) => {
      updateActiveReceipt((prevReceipt) => {
        const updatedItems = [...prevReceipt.items];
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: value,
        };

        return {
          ...prevReceipt,
          items: updatedItems,
        };
      });
    },
    [updateActiveReceipt]
  );

  const handleRemoveRow = useCallback(
    (index: number) => {
      updateActiveReceipt((prevReceipt) => {
        return {
          ...prevReceipt,
          items: prevReceipt.items.filter((_, i) => i !== index),
        };
      });
    },
    [updateActiveReceipt]
  );

  const rows = items.map((item, index) => (
    <Table.Tr key={index}>
      {showName && (
        <Table.Td visibleFrom="sm" maw={80}>
          <TextInput
            size="xs"
            value={item.name}
            onChange={(e) => handleUpdateItem(index, "name", e.currentTarget.value)}
          />
        </Table.Td>
      )}

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
          data={[
            { value: SHARED_BUYER, label: SHARED_BUYER_LABEL },
            ...participants.map((participant) => ({
              value: participant,
              label: participant,
            })),
          ]}
          onChange={(event) =>
            handleUpdateItem(
              index,
              "buyer",
              event.currentTarget.value || SHARED_BUYER
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
