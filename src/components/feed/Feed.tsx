
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendRequestsSection } from "@/components/feed/friends/FriendRequestsSection";
import { ProfileSearch } from "@/components/feed/ProfileSearch";

export function Feed() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handlePostDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handlePostUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setShowScrollTop(scrollRef.current.scrollTop > 200);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleProfileSelect = (profile: any) => {
    // Handle profile selection if needed
  };

  return (
    <ScrollArea 
      ref={scrollRef} 
      className="h-[calc(100vh-3rem)] w-full"
      onScroll={handleScroll}
    >
      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="feed">Actualités</TabsTrigger>
            <TabsTrigger value="friends">Amis</TabsTrigger>
            <TabsTrigger value="requests">Demandes</TabsTrigger>
            <TabsTrigger value="search">Rechercher</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <CreatePost onPostCreated={handlePostCreated} />
            <PostList 
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
          </TabsContent>

          <TabsContent value="friends">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Mes amis</h2>
              <ProfileSearch 
                onSelect={handleProfileSelect}
                placeholder="Rechercher un ami..."
                className="w-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <FriendRequestsSection />
          </TabsContent>

          <TabsContent value="search">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Rechercher des profils</h2>
              <ProfileSearch 
                onSelect={handleProfileSelect}
                placeholder="Rechercher un utilisateur..."
                className="w-full"
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToTop}
            className={cn(
              "fixed bg-primary/90 hover:bg-primary text-primary-foreground",
              "rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "min-h-[44px] min-w-[44px] z-20",
              isMobile ? "bottom-24 right-4" : "bottom-8 right-4"
            )}
            aria-label="Retourner en haut"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}
