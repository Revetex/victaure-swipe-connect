
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { PostFilters } from "./posts/sections/PostFilters";
import { useState, useEffect, useRef } from "react";
import { PostAttachment, PostPrivacyLevel } from "./posts/types";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/components/ThemeProvider";

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Feed() {
  const queryClient = useQueryClient();
  const { isDark } = useThemeContext();
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

  // Réinitialiser les résultats de la requête lorsque les filtres changent
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [filter, sortBy, sortOrder, searchTerm, queryClient]);
  
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
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-300",
        headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        <div className={cn(
          isDark ? "bg-background/95" : "bg-background/95",
          "backdrop-blur-md border-b shadow-sm",
          isDark ? "border-border/30" : "border-border/40"
        )}>
          <div className="container mx-auto max-w-4xl px-2 sm:px-4 py-2 space-y-2">
            {!isExpanded ? (
              <Button 
                onClick={() => setIsExpanded(true)} 
                variant="ghost" 
                className={cn(
                  "w-full h-10 justify-start px-4 rounded-lg transition-all duration-200",
                  isDark ? "bg-muted/20 hover:bg-muted/30" : "bg-muted/30 hover:bg-muted/40",
                  isDark ? "text-foreground" : "text-foreground",
                  "border",
                  isDark ? "border-border/30" : "border-border/40"
                )}
              >
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
      <div className="mt-[100px] sm:mt-[112px]"></div>

      {/* Container principal avec le feed et scrolling amélioré */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4 scroll-smooth">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3 pb-16">
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
          size="icon"
          className={cn(
            "rounded-full h-12 w-12 shadow-md",
            isDark ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90"
          )}
          onClick={() => setIsExpanded(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
