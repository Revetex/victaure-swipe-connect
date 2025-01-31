import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<div>Hello World</div>} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}