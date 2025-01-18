import {
  ActionIcon,
  Divider,
  Group,
  NativeSelect,
  NumberInput,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Receipt, ReceiptItem } from "../../types";

interface ReceiptTableProps {
  onReceiptChange?: (receipt: Receipt) => void;
}

export function ReceiptTable({ onReceiptChange }: ReceiptTableProps) {
  const [receipt, setReceipt] = useState<Receipt>({
    items: [
      {
        name: "",
        price: 0,
        discount: 0,
        buyer: "Begge",
      },
    ],
  });

  // Handle adding a new row
  const handleAddRow = () => {
    setReceipt((prevReceipt) => {
      const updatedReceipt = {
        ...prevReceipt,
        items: [
          ...prevReceipt.items,
          {
            name: "",
            price: 0,
            discount: 0,
            buyer: "Begge",
          },
        ],
      };
      onReceiptChange?.(updatedReceipt);

      return updatedReceipt;
    });
  };

  const handleRemoveRow = (index: number) => {
    setReceipt((prevReceipt) => {
      const updatedReceipt = {
        ...prevReceipt,
        items: prevReceipt.items.filter((_, i) => i !== index),
      };
      onReceiptChange?.(updatedReceipt);

      return updatedReceipt;
    });
  };

  const handleUpdateItem = (
    index: number,
    field: keyof ReceiptItem,
    value: string | number
  ) => {
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
  };

  const totalPrice = receipt.items.reduce(
    (acc, item) => acc + item.price - item.discount,
    0
  );

  // Calculate how much each person owes
  const calculateSplit = () => {
    const split = { Marie: 0, Patrick: 0 };

    receipt.items.forEach((item) => {
      const finalPrice = item.price - item.discount;

      switch (item.buyer) {
        case "Marie":
          split.Marie += finalPrice;
          break;
        case "Patrick":
          split.Patrick += finalPrice;
          break;
        case "Begge":
          split.Marie += finalPrice / 2;
          split.Patrick += finalPrice / 2;
          break;
        default:
          break;
      }
    });

    return split;
  };

  const { Marie, Patrick } = calculateSplit();

  const rows = receipt.items.map((item, index) => (
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
      <Table.Td>
        <ActionIcon
          color="red"
          onClick={() => handleRemoveRow(index)}
          variant="light"
          size="xs"
        >
          <IconMinus size={14} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap={0}>
      <Table horizontalSpacing={6}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Pris</Table.Th>
            <Table.Th>Rabat</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Køber</Table.Th>
            <Table.Th>
              <ActionIcon onClick={handleAddRow} variant="light" size="xs">
                <IconPlus size={14} />
              </ActionIcon>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Divider />

      <Group gap={32} justify="flex-end" pr="sm" mt="md">
        <div>
          <Text>Marie</Text>
          <Text>{`${Marie.toFixed(2).replace(".", ",")} kr.`}</Text>
        </div>
        <div>
          <Text>Patrick</Text>
          <Text>{`${Patrick.toFixed(2).replace(".", ",")} kr.`}</Text>
        </div>
        <div>
          <Text>Total</Text>
          <Text>{`${totalPrice.toFixed(2).replace(".", ",")} kr.`}</Text>
        </div>
      </Group>
    </Stack>
  );
}
