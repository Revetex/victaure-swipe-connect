import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, UserCircle, Search, MessageSquare, UserPlus } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Post {
  id: string;
  content: string;
  images: string[];
  likes: number;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
}

export function Feed() {
  const [newPost, setNewPost] = useState("");
  const [open, setOpen] = useState(false);
  const { profile } = useProfile();
  const navigate = useNavigate();

  const { data: posts, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    }
  });

  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role")
        .neq("id", profile?.id);

      if (error) throw error;
      return data as Profile[];
    }
  });

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const { error } = await supabase
        .from("posts")
        .insert([
          {
            content: newPost,
            user_id: profile?.id
          }
        ]);

      if (error) throw error;

      setNewPost("");
      refetch();
      toast.success("Publication créée avec succès");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la création de la publication");
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      // Check if a connection request already exists
      const { data: existingRequest } = await supabase
        .from("messages")
        .select()
        .eq("sender_id", profile?.id)
        .eq("receiver_id", userId)
        .single();

      if (existingRequest) {
        toast.info("Une demande de connexion existe déjà");
        return;
      }

      // Send connection request message
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: profile?.id,
            receiver_id: userId,
            content: "Demande de connexion",
          }
        ]);

      if (error) throw error;
      toast.success("Demande de connexion envoyée");
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Erreur lors de l'envoi de la demande de connexion");
    }
  };

  const handleViewProfile = (userId: string) => {
    // Navigate to profile view (implement this route)
    navigate(`/dashboard/profile/${userId}`);
  };

  const handleMessage = (userId: string) => {
    // Navigate to messages with this user selected
    navigate(`/dashboard/messages?user=${userId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Rechercher un profil...
          </Button>
        </div>
        <div className="space-y-4">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Partagez quelque chose..."
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <Button variant="outline" size="icon">
              <Image className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreatePost}>
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </div>
        </div>
      </Card>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher un profil..." />
        <CommandList>
          <CommandEmpty>Aucun profil trouvé.</CommandEmpty>
          <CommandGroup heading="Profils">
            {profiles?.map((profile) => (
              <CommandItem
                key={profile.id}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center gap-2">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-muted-foreground" />
                  )}
                  <span>{profile.full_name}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewProfile(profile.id)}
                  >
                    <UserCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMessage(profile.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleConnect(profile.id)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id} className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {post.profiles.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt={post.profiles.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{post.profiles.full_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-foreground">{post.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}