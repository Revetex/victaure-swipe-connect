
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface CreatePostProps {
  onPostCreated: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    try {
      // TODO: Implement post creation with Supabase
      onPostCreated();
      setContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-4 w-full bg-card rounded-lg p-4 shadow-sm border"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Quoi de neuf ?"
        className="w-full resize-none"
        rows={3}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim()}>
          Publier
        </Button>
      </div>
    </motion.form>
  );
}
