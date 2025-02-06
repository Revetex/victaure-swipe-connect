import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface ToolsHeaderProps {
  showFriendsList: boolean;
  onToggleFriendsList: () => void;
}

export function ToolsHeader({ showFriendsList, onToggleFriendsList }: ToolsHeaderProps) {
  return (
    <DashboardHeader 
      title="Outils"
      showFriendsList={showFriendsList}
      onToggleFriendsList={onToggleFriendsList}
      isEditing={false}
    />
  );
}