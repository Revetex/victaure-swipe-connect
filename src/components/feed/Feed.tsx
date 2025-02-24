
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { User2, Globe2, Clock, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recent");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "connections">("public");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files?.length) return;
    setIsUploading(true);
    // TODO: Implement file upload logic
    setIsUploading(false);
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 px-4 sm:px-6 mt-4">
      {/* Barre de partage */}
      <div className="sticky top-4 z-10">
        {showNewPost ? (
          <Card className="p-4 backdrop-blur-sm bg-card/95">
            <CreatePostForm 
              newPost={newPost}
              onPostChange={setNewPost}
              privacy={privacy}
              onPrivacyChange={setPrivacy}
              attachments={attachments}
              isUploading={isUploading}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              onCreatePost={() => {
                invalidatePosts();
                setShowNewPost(false);
                setNewPost("");
                setAttachments([]);
              }}
              onClose={() => {
                setShowNewPost(false);
                setNewPost("");
                setAttachments([]);
              }}
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
      </div>

      {/* Filtres et tri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      {/* Feed */}
      <div className="rounded-lg overflow-hidden">
        <PostList 
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
        />
      </div>
    </div>
  );
}
