
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/profile";
import { useConnectionActions } from "./hooks/useConnectionActions";

interface ConnectionCardProps {
  connection: UserProfile;
  onRemove?: () => void;
}

export function ConnectionCard({ connection, onRemove }: ConnectionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { removeConnection } = useConnectionActions();

  const handleRemove = async () => {
    if (!connection.friendship_id) return;
    
    setIsLoading(true);
    try {
      await removeConnection(connection.friendship_id);
      if (onRemove) onRemove();
    } catch (error) {
      console.error("Error removing connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-3">
        <img
          src={connection.avatar_url || "/user-icon.svg"}
          alt={connection.full_name || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium">{connection.full_name}</h3>
          <p className="text-sm text-gray-500">
            {connection.online_status ? "En ligne" : "Hors ligne"}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        disabled={isLoading}
        className="text-red-500 hover:text-red-700 hover:bg-red-100"
      >
        {isLoading ? "..." : "Supprimer"}
      </Button>
    </div>
  );
}
