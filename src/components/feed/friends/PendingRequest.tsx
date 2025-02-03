import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Clock, X } from "lucide-react";
import { PendingRequest } from "@/types/profile";

interface PendingRequestProps {
  request: PendingRequest;
  onAccept: (requestId: string, senderId: string, senderName: string) => Promise<void>;
  onReject: (requestId: string, senderName: string) => Promise<void>;
  onCancel: (requestId: string, receiverName: string) => Promise<void>;
}

export function PendingRequest({ request, onAccept, onReject, onCancel }: PendingRequestProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg animate-pulse">
      <Avatar className="h-10 w-10 border-2 border-primary/10">
        <AvatarImage 
          src={request.type === 'incoming' ? request.sender.avatar_url : request.receiver.avatar_url} 
          alt={request.type === 'incoming' ? request.sender.full_name : request.receiver.full_name} 
        />
        <AvatarFallback>
          {(request.type === 'incoming' ? request.sender.full_name : request.receiver.full_name)?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {request.type === 'incoming' ? request.sender.full_name : request.receiver.full_name}
        </p>
        <p className="text-xs text-muted-foreground">
          {request.type === 'incoming' 
            ? "Souhaite vous ajouter comme ami" 
            : "Demande envoyée"}
        </p>
      </div>
      <div className="flex gap-2">
        {request.type === 'incoming' ? (
          <>
            <Button
              size="sm"
              variant="default"
              className="h-8 px-3"
              onClick={() => onAccept(request.id, request.sender.id, request.sender.full_name)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3"
              onClick={() => onReject(request.id, request.sender.full_name)}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3"
            onClick={() => onCancel(request.id, request.receiver.full_name)}
          >
            <Clock className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}