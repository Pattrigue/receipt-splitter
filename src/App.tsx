import { AppShell } from "@mantine/core";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ReceiptTable } from "./components/ReceiptTable";

export function App() {
  return (
    <AppShell header={{ height: 60 }} footer={{ height: 80 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <ReceiptTable />
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
