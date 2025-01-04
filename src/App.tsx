import { SpeedInsights } from "@vercel/speed-insights/react";
import { AppWrapper } from "./AppWrapper";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  return (
    <>
      <AppWrapper />
      <Toaster position="top-right" />
      <SpeedInsights />
    </>
  );
}

export default App;