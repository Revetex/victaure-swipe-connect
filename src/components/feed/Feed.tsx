
import { PostList } from "./posts/PostList";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { useQueryClient } from "@tanstack/react-query";

export function Feed() {
  const queryClient = useQueryClient();

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pt-16">
      <CreatePostForm onPostCreated={handlePostCreated} />
      <PostList 
        onPostDeleted={handlePostCreated}
        onPostUpdated={handlePostCreated}
      />
    </div>
  );
}
