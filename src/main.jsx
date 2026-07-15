import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App";

import "./Styles/theme.css";
import "./Styles/global.css";
import "./Styles/UI.css";

createRoot(document.getElementById("root")).render(
  <App />
);