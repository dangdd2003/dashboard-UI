import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./providers/AuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import TestIdProvider from "./providers/TestIdProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TestIdProvider>
          <App />
        </TestIdProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
