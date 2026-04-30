import {
  ActionIcon,
  Button,
  Group,
  Popover,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconTrash, IconUsers } from "@tabler/icons-react";
import { useReceiptContext } from "@/context/ReceiptContext";

interface ParticipantSettingsProps {
  fullWidth?: boolean;
}

export function ParticipantSettings({ fullWidth }: ParticipantSettingsProps) {
  const {
    addParticipant,
    participants,
    removeParticipant,
    renameParticipant,
  } = useReceiptContext();

  return (
    <Popover position="bottom-end" shadow="md" width={300}>
      <Popover.Target>
        <Button
          fullWidth={fullWidth}
          leftSection={<IconUsers size={16} />}
          size="xs"
          variant="light"
        >
          Personer
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="sm">
          <Text fw={600} size="sm">
            Personer
          </Text>

          {participants.length === 0 ? (
            <Text c="dimmed" size="sm">
              Tilføj mindst én person for at fordele kvitteringer.
            </Text>
          ) : (
            <Stack gap="xs">
              {participants.map((participant, index) => (
                <Group key={`${participant}-${index}`} gap="xs" wrap="nowrap">
                  <TextInput
                    aria-label={`Person ${index + 1}`}
                    defaultValue={participant}
                    onBlur={(event) =>
                      renameParticipant(index, event.currentTarget.value)
                    }
                    size="xs"
                  />
                  <ActionIcon
                    aria-label={`Fjern ${participant}`}
                    color="red"
                    onClick={() => removeParticipant(index)}
                    size="sm"
                    variant="light"
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          )}

          <Button
            leftSection={<IconPlus size={16} />}
            onClick={addParticipant}
            size="xs"
            variant="subtle"
          >
            Tilføj person
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
