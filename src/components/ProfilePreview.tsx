import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRound, MessageCircle, UserPlus, Briefcase, MapPin, Mail, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfilePreviewProps {
  profile: UserProfile;
  onClose: () => void;
}

export function ProfilePreview({ profile, onClose }: ProfilePreviewProps) {
  const navigate = useNavigate();
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

  useEffect(() => {
    const checkExistingRequest = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check for existing friend request in both directions
      const { data: existingRequests } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (existingRequests && existingRequests.length > 0) {
        const request = existingRequests[0];
        setIsFriendRequestSent(request.sender_id === user.id);
      }
    };

    checkExistingRequest();
  }, [profile.id]);

  const handleSendMessage = () => {
    navigate(`/dashboard/messages/${profile.id}`);
    toast.success("Redirection vers la messagerie");
    onClose();
  };

  const handleFriendRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      // Check for existing friend request in both directions
      const { data: existingRequests } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (existingRequests && existingRequests.length > 0) {
        const request = existingRequests[0];
        
        // If the current user sent the request, they can cancel it
        if (request.sender_id === user.id) {
          const { error: deleteError } = await supabase
            .from('friend_requests')
            .delete()
            .eq('id', request.id);

          if (deleteError) throw deleteError;

          toast.success("Demande d'ami annulée");
          setIsFriendRequestSent(false);
        } else {
          // If they received the request, inform them
          toast.info("Cette personne vous a déjà envoyé une demande d'ami");
        }
        return;
      }

      // Create the friend request
      const { error: requestError } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: profile.id,
          status: 'pending'
        });

      if (requestError) {
        console.error('Error creating friend request:', requestError);
        if (requestError.code === '23505') {
          toast.error("Une demande d'ami existe déjà");
          return;
        }
        throw requestError;
      }

      // Create a notification for the receiver
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          title: "Nouvelle demande d'ami",
          message: `${user.email} souhaite vous ajouter comme ami`,
        });

      if (notifError) {
        console.error('Error creating notification:', notifError);
        // Don't throw here, as the friend request was successful
        toast.error("Impossible d'envoyer la notification");
      } else {
        toast.success("Demande d'ami envoyée");
        setIsFriendRequestSent(true);
      }
    } catch (error) {
      console.error('Error handling friend request:', error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-card dark:bg-card/95 rounded-xl p-6 shadow-xl max-w-sm w-full mx-4 transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center space-y-6">
          <Avatar className="h-24 w-24 ring-2 ring-primary/10">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>
              <UserRound className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">{profile.full_name}</h3>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <p className="text-sm">{profile.role}</p>
            </div>
            
            {(profile.city || profile.country) && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <p className="text-sm">{[profile.city, profile.country].filter(Boolean).join(", ")}</p>
              </div>
            )}
            
            {profile.email && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <p className="text-sm">{profile.email}</p>
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="text-sm text-center text-muted-foreground/90 border-t border-border/50 pt-4">
              {profile.bio}
            </p>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div className="w-full">
              <div className="flex flex-wrap gap-2 justify-center">
                {profile.skills.slice(0, 5).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <Button 
              className={`flex-1 ${isFriendRequestSent ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
              onClick={handleFriendRequest}
            >
              {isFriendRequestSent ? (
                <>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Annuler
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter
                </>
              )}
            </Button>
            <Button 
              className="flex-1"
              variant="outline"
              onClick={handleSendMessage}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}