import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "./components/ui/toaster";
import { VCardStyleProvider } from "./components/vcard/VCardStyleContext";

function App() {
  return (
    <BrowserRouter>
      <VCardStyleProvider>
        <AppRoutes />
        <Toaster />
      </VCardStyleProvider>
    </BrowserRouter>
  );
}

export default App;