import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <KindeProvider
      clientId="40365692ac2e43109a311ebffac93e75"
      domain="https://creatorhubvance.kinde.com"
      redirectUri="http://localhost:5173"
      logoutUri="http://localhost:5173"
    >
      <App />
    </KindeProvider>
  </React.StrictMode>
);
