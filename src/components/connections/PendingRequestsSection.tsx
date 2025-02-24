
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFriendRequests } from "@/hooks/useFriendRequests";

export function PendingRequestsSection() {
  const {
    pendingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest
  } = useFriendRequests();

  return (
    <motion.div 
      className="bg-muted/20 rounded-xl shadow-sm backdrop-blur-sm overflow-hidden border border-border/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-3 pt-0">
        <div className="space-y-2">
          {pendingRequests?.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "flex items-center justify-between p-3",
                "bg-background/50 rounded-lg border border-border/50"
              )}
            >
              <div className="flex items-center gap-3">
                <img
                  src={request.sender.avatar_url || "/user-icon.svg"}
                  alt={request.sender.full_name || ""}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{request.sender.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.type === 'incoming' ? 'Souhaite vous ajouter' : 'Demande envoyée'}
                  </p>
                </div>
              </div>
              
              {request.type === 'incoming' ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptRequest(request.id, request.sender_id, request.sender.full_name || '')}
                  >
                    Accepter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectRequest(request.id, request.sender.full_name || '')}
                  >
                    Refuser
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancelRequest(request.id, request.receiver.full_name || '')}
                >
                  Annuler
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
