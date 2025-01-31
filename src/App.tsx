import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Tools } from "./components/Tools";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Tools />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}