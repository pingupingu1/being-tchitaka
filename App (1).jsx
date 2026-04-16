// src/App.jsx
// This file just re-exports the main app from BeingTchitaka.jsx
// BeingTchitaka.jsx exports a default function called "App" — we import it here.

import BeingTchitakaApp from "./BeingTchitaka";

export default function App() {
  return <BeingTchitakaApp />;
}
