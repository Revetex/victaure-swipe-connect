
import { FriendCard, FriendCardSkeleton } from "./components/FriendCard";
import { EmptyConnectionsState } from "./EmptyConnectionsState";
import { motion } from "framer-motion";
import { Friend } from "@/types/profile";

interface FriendListProps {
  connections: Friend[];
  showOnlineOnly: boolean;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}

export function FriendList({
  connections,
  showOnlineOnly,
  searchQuery,
  currentPage,
  itemsPerPage
}: FriendListProps) {
  if (!connections || connections.length === 0) {
    if (showOnlineOnly) {
      return (
        <div className="text-center text-white/60 py-8 bg-zinc-900/30 rounded-lg">
          Aucune connexion en ligne
        </div>
      );
    }
    
    if (searchQuery) {
      return (
        <div className="text-center text-white/60 py-8 bg-zinc-900/30 rounded-lg">
          Aucune connexion trouvée pour "{searchQuery}"
        </div>
      );
    }
    
    return <EmptyConnectionsState />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {connections.map((friend, index) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          onRemove={() => {}}
        />
      ))}
    </motion.div>
  );
}

export function FriendListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <FriendCardSkeleton key={index} />
      ))}
    </div>
  );
}
