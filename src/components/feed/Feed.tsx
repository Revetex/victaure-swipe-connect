
import { PostList } from "./posts/PostList";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Feed() {
  const queryClient = useQueryClient();

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pt-4 pb-20">
      <CreatePostForm onPostCreated={handlePostCreated} />
      <PostList 
        onPostDeleted={handlePostCreated}
        onPostUpdated={handlePostCreated}
      />
    </div>
  );
}
