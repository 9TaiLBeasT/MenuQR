import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { initializeThemeFromSettings } from "./lib/theme";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Initialize theme from settings
initializeThemeFromSettings();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
