import "./index.css";
import "@mantine/core/styles.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { MantineProvider } from "@mantine/core";
import { ReceiptProvider } from "./components/ReceiptContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider>
      <ReceiptProvider>
        <App />
      </ReceiptProvider>
    </MantineProvider>
  </React.StrictMode>
);
