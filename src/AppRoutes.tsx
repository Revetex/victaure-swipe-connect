
import { Routes, Route } from "react-router-dom";
import { Feed } from "./components/feed/Feed";
import { Messages } from "./components/Messages";
import { Marketplace } from "./components/marketplace/Marketplace";
import { Settings } from "./components/Settings";
import { Dashboard } from "./components/Dashboard";
import { JobsPage } from "./components/jobs/JobsPage";
import { NotesPage } from "./components/tools/NotesPage";
import { ChessPage } from "./components/tools/ChessPage";
import { CalculatorPage } from "./components/tools/CalculatorPage";
import { TranslatorPage } from "./components/tools/TranslatorPage";
import { FriendsPage } from "./components/friends/FriendsPage";
import { ProfileSearchPage } from "./components/friends/ProfileSearchPage";
import { FriendRequestsPage } from "./components/friends/FriendRequestsPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthCallback } from "./components/AuthCallback";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Routes protégées */}
      <Route element={<PrivateRoute />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/chess" element={<ChessPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/translator" element={<TranslatorPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/search" element={<ProfileSearchPage />} />
        <Route path="/requests" element={<FriendRequestsPage />} />
      </Route>
    </Routes>
  );
}
