
import { AppRoutes } from "./AppRoutes";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="victaure-theme">
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
