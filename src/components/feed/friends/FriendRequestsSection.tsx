
import { useEffect } from "react";
import { motion } from "framer-motion";
import { PendingRequest } from "@/types/profile";
import { PendingRequest as PendingRequestComponent } from "./PendingRequest";
import { EmptyRequestsState } from "./EmptyRequestsState";

interface FriendRequestsSectionProps {
  requests: PendingRequest[];
  onAccept: (requestId: string, senderId: string, senderName: string) => Promise<void>;
  onReject: (requestId: string, senderName: string) => Promise<void>;
  onCancel: (requestId: string, receiverName: string) => Promise<void>;
}

export function FriendRequestsSection({
  requests,
  onAccept,
  onReject,
  onCancel
}: FriendRequestsSectionProps) {
  useEffect(() => {
    console.log('Requests updated:', requests);
  }, [requests]);

  if (!requests || requests.length === 0) {
    return <EmptyRequestsState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {requests.map((request) => (
        <PendingRequestComponent
          key={request.id}
          request={request}
          onAccept={onAccept}
          onReject={onReject}
          onCancel={onCancel}
        />
      ))}
    </motion.div>
  );
}
