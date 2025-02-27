
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PendingRequest } from "@/types/profile";
import { PendingRequest as PendingRequestComponent } from "./PendingRequest";
import { EmptyRequestsState } from "./EmptyRequestsState";

interface FriendRequestsSectionProps {
  requests: PendingRequest[];
  onAccept: (requestId: string, senderId: string, senderName: string) => Promise<void>;
  onReject: (requestId: string, senderName: string) => Promise<void>;
  onCancel: (requestId: string, receiverName: string) => Promise<void>;
  isLoading?: boolean;
}

export function FriendRequestsSection({
  requests,
  onAccept,
  onReject,
  onCancel,
  isLoading = false
}: FriendRequestsSectionProps) {
  useEffect(() => {
    console.log('Requests updated:', requests);
  }, [requests]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return <EmptyRequestsState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <AnimatePresence>
        {requests.map((request) => (
          <PendingRequestComponent
            key={request.id}
            request={request}
            onAccept={onAccept}
            onReject={onReject}
            onCancel={onCancel}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
