import { AppShell } from "@mantine/core";
import { useCallback, useState } from "react";
import { Footer } from "@/components/Footer";
import { GlobalJsonDropzone } from "@/components/GlobalJsonDropzone";
import { Header } from "@/components/Header";
import { useReceiptContext } from "@/context/ReceiptContext";
import { ReceiptTable } from "@/components/ReceiptTable";
import type { Receipt } from "@/types";

export function App() {
  const { replaceReceipts } = useReceiptContext();
  const [showName, setShowName] = useState(true);

  const handleImportReceipts = useCallback(
    (receipts: Receipt[]) => replaceReceipts(receipts),
    [replaceReceipts]
  );

  return (
    <>
      <GlobalJsonDropzone onImportReceipts={handleImportReceipts} />

      <AppShell header={{ height: 60 }} footer={{ height: 80 }} padding="md">
        <AppShell.Header>
          <Header showName={showName} onShowNameChange={setShowName} />
        </AppShell.Header>

        <AppShell.Main>
          <ReceiptTable showName={showName} />
        </AppShell.Main>

        <AppShell.Footer p="md">
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}
