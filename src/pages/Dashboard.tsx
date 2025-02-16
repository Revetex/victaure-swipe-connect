import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardAuth } from "@/components/dashboard/core/DashboardAuth";
import { ToolsNavigation } from "@/components/tools/navigation/ToolsNavigation";
import { Tool } from "@/components/tools/navigation/types";
import { tools } from "@/components/tools/navigation/toolsConfig";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FriendsList } from "@/components/friends/FriendsList";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("notes");
  const [isEditing, setIsEditing] = useState(false);
  const [toolsOrder, setToolsOrder] = useLocalStorage<Tool[]>(
    "dashboard-tools-order",
    tools.map(t => t.id)
  );

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
    setIsEditing(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsEditing(false);
  };

  const toggleFriendsList = () => {
    setShowFriendsList(!showFriendsList);
  };

  const ActiveTool = tools.find(t => t.id === activeTool)?.component;

  return (
    <PageLayout>
      <DashboardAuth />
      
      <div className="flex flex-col min-h-screen">
        <DashboardHeader
          title="Tableau de bord"
          showFriendsList={showFriendsList}
          onToggleFriendsList={toggleFriendsList}
          isEditing={isEditing}
        />

        <div className="flex-1 flex">
          <main className={cn(
            "flex-1 transition-all duration-300",
            showFriendsList ? "mr-[300px]" : ""
          )}>
            <div className="container mx-auto p-4 space-y-8">
              <ToolsNavigation
                activeTool={activeTool}
                onToolChange={handleToolChange}
                toolsOrder={toolsOrder}
                onReorderTools={setToolsOrder}
              />

              <div className="relative min-h-[300px]">
                {ActiveTool && (
                  <ActiveTool onLoad={() => {}} />
                )}
              </div>
            </div>
          </main>

          <FriendsList
            isOpen={showFriendsList}
            onClose={() => setShowFriendsList(false)}
          />
        </div>

        <DashboardNavigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isEditing={isEditing}
        />
      </div>
    </PageLayout>
  );
}
