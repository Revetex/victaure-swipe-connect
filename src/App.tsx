import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from "@/components/Dashboard";
import { Landing } from "@/components/Landing";
import { AuthCallback } from "@/components/AuthCallback";
import { PrivateRoute } from "@/components/PrivateRoute";
import { Settings } from "@/components/Settings";
import { VCardStyleProvider } from "@/components/vcard/VCardStyleContext";
import { PublicProfile } from "@/components/PublicProfile";
import { Connections } from "@/components/Connections";
import { Chat } from "@/components/Chat";

function App() {
  return (
    <VCardStyleProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="public-profile/:id" element={<PublicProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="connections" element={<Connections />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
      <Toaster />
    </VCardStyleProvider>
  );
}

export default App;