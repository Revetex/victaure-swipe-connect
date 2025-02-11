
import { ScrollArea } from "@/components/ui/scroll-area";
import { PendingRequest } from "./PendingRequest";
import { EmptyRequestsState } from "./EmptyRequestsState";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { motion, AnimatePresence } from "framer-motion";

export function FriendRequestsSection() {
  const {
    pendingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest
  } = useFriendRequests();

  if (!pendingRequests.length) {
    return <EmptyRequestsState />;
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <AnimatePresence>
        <div className="space-y-3">
          {pendingRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <PendingRequest
                request={request}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                onCancel={handleCancelRequest}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </ScrollArea>
  );
}
