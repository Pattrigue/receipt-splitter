import { createSafeContext } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Receipt } from "@/types";
import {
  addEmptyReceipt as addEmptyReceiptToState,
  appendReceipts,
  removeParticipantFromReceipts,
  removeReceipt as removeReceiptFromState,
  renameParticipantInReceipts,
} from "@/utils/receipt-state";
import type { ReceiptState } from "@/utils/receipt-state";

type UpdateActiveReceipt = (value: Receipt | ((prev: Receipt) => Receipt)) => void;
const PARTICIPANTS_STORAGE_KEY = "receipt-splitter:participants";

type ReceiptContextValue = {
  receipts: Receipt[];
  activeReceiptId: string | null;
  activeReceipt: Receipt | null;
  itemCount: number;
  participants: string[];
  setActiveReceiptId: (id: string | null) => void;
  addReceipts: (receipts: Receipt[]) => void;
  addEmptyReceipt: () => void;
  removeReceipt: (id: string) => void;
  addParticipant: () => void;
  renameParticipant: (index: number, name: string) => void;
  removeParticipant: (index: number) => void;
  updateActiveReceipt: UpdateActiveReceipt;
};

const [ReceiptContextProvider, useReceiptContext] =
  createSafeContext<ReceiptContextValue>(
    "ReceiptContext was not found. Wrap your tree with <ReceiptProvider>."
  );

export function ReceiptProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ReceiptState>({
    receipts: [],
    activeReceiptId: null,
  });
  const [participants, setParticipants] = useState<string[]>(() => loadParticipants());

  useEffect(() => {
    localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(participants));
  }, [participants]);

  const activeReceipt = useMemo(
    () => state.receipts.find((receipt) => receipt.id === state.activeReceiptId) ?? null,
    [state.activeReceiptId, state.receipts]
  );

  const setActiveReceiptId = useCallback((id: string | null) => {
    setState((prevState) => ({
      ...prevState,
      activeReceiptId: id,
    }));
  }, []);

  const addReceipts = useCallback((receiptsToAdd: Receipt[]) => {
    setState((prevState) => appendReceipts(prevState, receiptsToAdd));
  }, []);

  const addEmptyReceipt = useCallback(() => {
    setState((prevState) => addEmptyReceiptToState(prevState));
  }, []);

  const removeReceipt = useCallback((id: string) => {
    setState((prevState) => removeReceiptFromState(prevState, id));
  }, []);

  const addParticipant = useCallback(() => {
    setParticipants((prevParticipants) => [
      ...prevParticipants,
      nextParticipantName(prevParticipants),
    ]);
  }, []);

  const renameParticipant = useCallback((index: number, name: string) => {
    const nextName = name.trim();
    if (!nextName) return;

    setParticipants((prevParticipants) => {
      const previousName = prevParticipants[index];
      if (!previousName || prevParticipants.some((participant, i) => i !== index && participant === nextName)) {
        return prevParticipants;
      }

      const nextParticipants = [...prevParticipants];
      nextParticipants[index] = nextName;
      setState((prevState) => ({
        ...prevState,
        receipts: renameParticipantInReceipts(prevState.receipts, previousName, nextName),
      }));
      return nextParticipants;
    });
  }, []);

  const removeParticipant = useCallback((index: number) => {
    setParticipants((prevParticipants) => {
      const participant = prevParticipants[index];
      if (!participant) return prevParticipants;

      setState((prevState) => ({
        ...prevState,
        receipts: removeParticipantFromReceipts(prevState.receipts, participant),
      }));
      return prevParticipants.filter((_, i) => i !== index);
    });
  }, []);

  const updateActiveReceipt = useCallback<UpdateActiveReceipt>((value) => {
    setState((prevState) => ({
      ...prevState,
      receipts: prevState.receipts.map((receipt) => {
        if (receipt.id !== prevState.activeReceiptId) return receipt;
        return typeof value === "function" ? value(receipt) : value;
      }),
    }));
  }, []);

  const itemCount = activeReceipt?.items.length ?? 0;

  const value = useMemo(() => ({
    receipts: state.receipts,
    activeReceiptId: state.activeReceiptId,
    activeReceipt,
    itemCount,
    participants,
    setActiveReceiptId,
    addReceipts,
    addEmptyReceipt,
    removeReceipt,
    addParticipant,
    renameParticipant,
    removeParticipant,
    updateActiveReceipt,
  }), [
    state.receipts,
    state.activeReceiptId,
    activeReceipt,
    itemCount,
    participants,
    addReceipts,
    addEmptyReceipt,
    removeReceipt,
    addParticipant,
    renameParticipant,
    removeParticipant,
    updateActiveReceipt,
  ]);

  return (
    <ReceiptContextProvider value={value}>
      {children}
    </ReceiptContextProvider>
  );
}

export { useReceiptContext };

function loadParticipants() {
  try {
    const raw = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const participants = parsed
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    return Array.from(new Set(participants));
  } catch {
    return [];
  }
}

function nextParticipantName(participants: string[]) {
  let index = participants.length + 1;
  let name = `Person ${index}`;

  while (participants.includes(name)) {
    index += 1;
    name = `Person ${index}`;
  }

  return name;
}
