import { FriendsContent } from "./friends/FriendsContent";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
export function FriendsList() {
  const isMobile = useIsMobile();
  return <div className="">
      <div className="container mx-auto max-w-3xl">
        <FriendsContent />
      </div>
    </div>;
}