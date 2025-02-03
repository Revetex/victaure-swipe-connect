import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { FriendsContent } from "./FriendsContent";

export function FriendListContainer() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="relative bg-card/50 backdrop-blur-sm">
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpand}
            className="lg:hidden"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}
      
      <div className={`${isMobile ? (isExpanded ? 'block' : 'hidden') : 'block'} p-4`}>
        <FriendsContent />
      </div>
    </Card>
  );
}