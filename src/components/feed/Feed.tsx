
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { Filter, User2, Globe2, Clock, TrendingUp, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recent");
  const [showNewPost, setShowNewPost] = useState(false);

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto space-y-6 px-4 sm:px-6 mt-4"
    >
      {/* Barre de partage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="sticky top-4 z-10"
      >
        {showNewPost ? (
          <Card className="p-4 backdrop-blur-sm bg-card/95">
            <CreatePostForm 
              newPost=""
              onPostChange={() => {}}
              privacy="public"
              onPrivacyChange={() => {}}
              attachments={[]}
              isUploading={false}
              onFileChange={() => {}}
              onRemoveFile={() => {}}
              onCreatePost={() => {
                invalidatePosts();
                setShowNewPost(false);
              }}
              onClose={() => setShowNewPost(false)}
            />
          </Card>
        ) : (
          <Card 
            className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer backdrop-blur-sm bg-card/95"
            onClick={() => setShowNewPost(true)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-muted-foreground">
                Partagez quelque chose...
              </div>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Filtres et tri */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Card className="p-2">
          <Tabs defaultValue="all" value={selectedFilter} onValueChange={setSelectedFilter}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                <Globe2 className="w-4 h-4 mr-2" />
                Tous
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1">
                <User2 className="w-4 h-4 mr-2" />
                Abonnements
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        <Card className="p-2">
          <Tabs defaultValue="recent" value={selectedSort} onValueChange={setSelectedSort}>
            <TabsList className="w-full">
              <TabsTrigger value="recent" className="flex-1">
                <Clock className="w-4 h-4 mr-2" />
                Récents
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex-1">
                <TrendingUp className="w-4 h-4 mr-2" />
                Populaires
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>
      </motion.div>

      {/* Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-lg overflow-hidden"
      >
        <PostList 
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
        />
      </motion.div>
    </motion.div>
  );
}
