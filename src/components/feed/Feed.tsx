
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { PostFilters } from "./posts/sections/PostFilters";
import { useState, useEffect, useRef } from "react";
import { PostAttachment, PostPrivacyLevel } from "./posts/types";
import { Button } from "../ui/button";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export function Feed() {
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacyLevel>("public");
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExpanded, setIsExpanded] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Gestion du scroll pour masquer/afficher l'entête
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setHeaderVisible(lastScrollY.current > currentScrollY || currentScrollY < 50);
      } else {
        setHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handlePostChange = (value: string) => setNewPost(value);
  const handlePrivacyChange = (value: PostPrivacyLevel) => setPrivacy(value);
  const handleCreatePost = () => {
    invalidatePosts();
    setIsExpanded(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Header avec effet de transition d'opacité lors du défilement */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
      >
        <div className="bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
          <div className="container mx-auto max-w-4xl px-2 sm:px-4 py-2 space-y-2">
            {!isExpanded ? (
              <Button
                onClick={() => setIsExpanded(true)}
                variant="ghost"
                className="w-full bg-primary/5 hover:bg-primary/10 text-foreground h-10 justify-start px-4 rounded-xl transition-all duration-200 border border-primary/10"
              >
                <PenLine className="h-4 w-4 mr-2 text-primary" />
                Partagez quelque chose...
              </Button>
            ) : (
              <CreatePostForm
                newPost={newPost}
                onPostChange={handlePostChange}
                privacy={privacy}
                onPrivacyChange={handlePrivacyChange}
                attachments={attachments}
                isUploading={isUploading}
                onCreatePost={handleCreatePost}
                onClose={() => setIsExpanded(false)}
                isExpanded={isExpanded}
              />
            )}
            
            <PostFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filter={filter}
              onFilterChange={setFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              onCreatePost={() => setIsExpanded(true)}
            />
          </div>
        </div>
      </div>

      {/* Espace réduit pour compenser la hauteur du header fixe */}
      <div className="h-[80px]" />

      {/* Container principal avec le feed et scrolling amélioré */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4 scroll-smooth">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 pb-16"
        >
          <PostList
            searchTerm={searchTerm}
            filter={filter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPostDeleted={invalidatePosts}
            onPostUpdated={invalidatePosts}
          />
        </motion.div>
      </main>

      {/* Bouton flottant pour créer un post (visible seulement en mode mobile et lors du défilement) */}
      <div className={cn(
        "fixed bottom-6 right-6 md:hidden",
        "transition-all duration-300 ease-in-out",
        isExpanded ? "scale-0 opacity-0" : "scale-100 opacity-100",
        headerVisible && "translate-y-12 opacity-0"
      )}>
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90 text-white"
        >
          <PenLine />
        </Button>
      </div>
    </div>
  );
}
