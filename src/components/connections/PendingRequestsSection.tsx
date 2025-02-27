
import { useState, useEffect } from "react";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { PendingRequest } from "@/types/profile";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface PendingRequestsSectionProps {
  title?: string;
  className?: string;
}

export function PendingRequestsSection({ 
  title = "Demandes en attente", 
  className 
}: PendingRequestsSectionProps) {
  const { user } = useAuth();
  const { 
    incomingRequests, 
    outgoingRequests, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    cancelFriendRequest,
    isLoading 
  } = useFriendRequests();
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  useEffect(() => {
    // Reset expanded state when requests change
    setExpandedRequestId(null);
  }, [incomingRequests, outgoingRequests]);

  if (!user) return null;

  const hasRequests = incomingRequests.length > 0 || outgoingRequests.length > 0;

  if (!hasRequests) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      
      {/* Incoming Requests */}
      {incomingRequests.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Reçues ({incomingRequests.length})</h4>
          <div className="space-y-2">
            {incomingRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onAccept={() => acceptFriendRequest(request.id)}
                onReject={() => rejectFriendRequest(request.id)}
                isExpanded={expandedRequestId === request.id}
                onToggleExpand={() => toggleExpand(request.id)}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Outgoing Requests */}
      {outgoingRequests.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Envoyées ({outgoingRequests.length})</h4>
          <div className="space-y-2">
            {outgoingRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onCancel={() => cancelFriendRequest(request.id)}
                isExpanded={expandedRequestId === request.id}
                onToggleExpand={() => toggleExpand(request.id)}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface RequestCardProps {
  request: PendingRequest;
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isLoading: boolean;
}

function RequestCard({ 
  request, 
  onAccept, 
  onReject, 
  onCancel,
  isExpanded,
  onToggleExpand,
  isLoading
}: RequestCardProps) {
  const isIncoming = request.type === 'incoming';
  const person = isIncoming ? request.sender : request.receiver;
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 ease-in-out",
        isExpanded ? "max-h-80" : "max-h-20"
      )}
    >
      <div 
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors" 
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage 
                src={person.avatar_url || undefined} 
                alt={person.full_name || ""}
              />
              <AvatarFallback>
                {person.full_name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">
                {person.full_name}
              </p>
              <p className="text-xs text-muted-foreground flex items-center">
                {isIncoming ? (
                  <>
                    <UserPlus className="h-3 w-3 mr-1 text-primary" />
                    Demande reçue
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1 text-amber-500" />
                    En attente
                  </>
                )}
                <span className="mx-1">•</span>
                {formatDate(request.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 pt-1">
          <div className="flex gap-2">
            {isIncoming ? (
              <>
                <Button 
                  className="flex-1 gap-1" 
                  size="sm"
                  onClick={onAccept}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4" />
                  Accepter
                </Button>
                <Button 
                  className="flex-1 gap-1" 
                  size="sm" 
                  variant="outline"
                  onClick={onReject}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                  Refuser
                </Button>
              </>
            ) : (
              <Button 
                className="flex-1 gap-1" 
                size="sm" 
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
