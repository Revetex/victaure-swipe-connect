
import { Outlet } from "react-router-dom";
import { AppHeader } from "../AppHeader";
import { MessagesContainer } from "../messages/MessagesContainer";
import { DashboardFriendsList } from "../dashboard/content/DashboardFriendsList";

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <MessagesContainer />
    </div>
  );
}
