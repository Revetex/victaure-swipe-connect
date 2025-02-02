import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRound, MessageCircle, UserPlus, Briefcase, MapPin, Mail, UserMinus, Globe, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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

  const handleSendMessage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      // Check if conversation already exists
      const { data: existingMessages, error: checkError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (checkError) throw checkError;

      // If no conversation exists, create initial message
      if (!existingMessages || existingMessages.length === 0) {
        const { error: insertError } = await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: profile.id,
            content: "👋 Bonjour!",
            read: false
          });

        if (insertError) throw insertError;
      }

      // Navigate to messages route with the profile ID
      navigate(`/dashboard/messages/${profile.id}`);
      onClose(); // Close the profile preview
      toast.success("Conversation créée avec succès");
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Erreur lors de la création de la conversation");
    }
  };

  const handleFriendRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      const { data: existingRequests } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (existingRequests && existingRequests.length > 0) {
        const request = existingRequests[0];
        if (request.sender_id === user.id) {
          const { error: deleteError } = await supabase
            .from('friend_requests')
            .delete()
            .eq('id', request.id);

          if (deleteError) throw deleteError;
          toast.success("Demande d'ami annulée");
          setIsFriendRequestSent(false);
        } else {
          toast.info("Cette personne vous a déjà envoyé une demande d'ami");
        }
        return;
      }

      const { error: requestError } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: profile.id,
          status: 'pending'
        });

      if (requestError) throw requestError;

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          title: "Nouvelle demande d'ami",
          message: `${user.email} souhaite vous ajouter comme ami`,
        });

      if (notifError) {
        console.error('Error creating notification:', notifError);
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

  const renderInfoItem = (icon: JSX.Element, value?: string | null, label?: string) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">
          {label ? `${label}: ${value}` : value}
        </span>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card dark:bg-card/95 rounded-xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 ring-2 ring-primary/10">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>
              <UserRound className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              {profile.full_name || "Utilisateur"}
            </h3>
            {renderInfoItem(<Briefcase className="h-4 w-4" />, profile.role)}
          </div>

          <div className="w-full space-y-2">
            {renderInfoItem(
              <MapPin className="h-4 w-4" />,
              [profile.city, profile.state, profile.country].filter(Boolean).join(", ")
            )}
            {renderInfoItem(<Mail className="h-4 w-4" />, profile.email)}
            {renderInfoItem(<Globe className="h-4 w-4" />, profile.website)}
            {renderInfoItem(<Building2 className="h-4 w-4" />, profile.company_name)}
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
      </motion.div>
    </div>
  );
}
