
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { PendingRequest as PendingRequestType } from "@/types/profile";
import { useState } from "react";
import { motion } from "framer-motion";

interface PendingRequestProps {
  request: PendingRequestType;
  onAccept: (requestId: string, senderId: string, senderName: string) => Promise<void>;
  onReject: (requestId: string, senderName: string) => Promise<void>;
  onCancel: (requestId: string, receiverName: string) => Promise<void>;
}

export function PendingRequest({
  request,
  onAccept,
  onReject,
  onCancel
}: PendingRequestProps) {
  const isIncoming = request.type === 'incoming';
  const otherUser = isIncoming ? request.sender : request.receiver;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept(request.id, request.sender_id, request.sender.full_name || 'Utilisateur');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(request.id, request.sender.full_name || 'Utilisateur');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await onCancel(request.id, request.receiver.full_name || 'Utilisateur');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherUser.avatar_url || ''} />
              <AvatarFallback>
                {otherUser.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{otherUser.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {isIncoming ? 'Souhaite vous ajouter' : 'Demande envoyée'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isProcessing ? (
              <Button size="sm" variant="outline" disabled className="w-20">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              </Button>
            ) : isIncoming ? (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleAccept}
                  className="w-20"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accepter
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleReject}
                  className="w-20"
                >
                  <X className="h-4 w-4 mr-1" />
                  Refuser
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleCancel}
                className="w-20"
              >
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
