
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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

const headerVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: -20 }
};

export function Feed() {
  const queryClient = useQueryClient();
  const { isDark, themeStyle } = useThemeContext();
  
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
    queryClient.invalidateQueries({
      queryKey: ["posts"]
    });
  }, [filter, sortBy, sortOrder, searchTerm, queryClient]);

  const invalidatePosts = () => {
    queryClient.invalidateQueries({
      queryKey: ["posts"]
    });
  };

  const handlePostChange = (value: string) => setNewPost(value);
  const handlePrivacyChange = (value: PostPrivacyLevel) => setPrivacy(value);
  
  const handleCreatePost = () => {
    invalidatePosts();
    setIsExpanded(false);
  };

  return (
    <div className={`bg-transparent theme-${themeStyle}`}>
      {/* Header avec effet de transition d'opacité lors du défilement */}
      <AnimatePresence>
        {headerVisible && (
          <motion.div 
            className={cn("fixed top-0 left-0 right-0 z-50")}
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="backdrop-blur-md border-b border-white/5 shadow-sm bg-inherit rounded-b-lg">
              <div className="container mx-auto max-w-4xl px-2 sm:px-4 py-3 space-y-3">
                {!isExpanded ? (
                  <Button 
                    onClick={() => setIsExpanded(true)} 
                    variant="ghost" 
                    className={cn(
                      "w-full h-10 justify-start px-4 rounded-lg transition-all duration-300",
                      isDark ? "bg-muted/20 hover:bg-muted/30" : "bg-muted/30 hover:bg-muted/40",
                      isDark ? "text-foreground" : "text-foreground",
                      "border",
                      isDark ? "border-border/30" : "border-border/40",
                      "hover:shadow-md"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Espace réduit pour compenser la hauteur du header fixe */}
      <div className="mt-[120px] sm:mt-[130px]"></div>

      {/* Container principal avec le feed et scrolling amélioré */}
      <main className="bg-transparent rounded-none">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="space-y-3 pb-16 max-w-4xl mx-auto px-2 sm:px-4"
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
      <AnimatePresence>
        {!isExpanded && !headerVisible && (
          <motion.div 
            className="fixed bottom-6 right-6 md:hidden"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              size="icon" 
              className={cn(
                "rounded-full h-14 w-14 shadow-lg",
                isDark ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90",
                "transition-all duration-300 hover:shadow-xl"
              )} 
              onClick={() => setIsExpanded(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
