
import { PendingRequest } from "@/types/profile";

export const transformFriendRequest = (data: any, userId: string): PendingRequest => {
  return {
    id: data.id,
    sender_id: data.sender_id,
    receiver_id: data.receiver_id,
    status: data.status,
    created_at: data.created_at,
    updated_at: data.updated_at,
    sender: {
      id: data.sender.id,
      full_name: data.sender.full_name,
      avatar_url: data.sender.avatar_url
    },
    receiver: {
      id: data.receiver.id,
      full_name: data.receiver.full_name,
      avatar_url: data.receiver.avatar_url
    },
    type: data.receiver_id === userId ? 'incoming' : 'outgoing'
  };
};
