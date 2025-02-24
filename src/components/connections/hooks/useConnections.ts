
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Friend, Certification } from "@/types/profile";
import { toast } from "sonner";

export function useConnections() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: connections, isLoading, error } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: friendRequests, error: friendRequestsError } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            email,
            full_name,
            avatar_url,
            role,
            bio,
            phone,
            city,
            state,
            country,
            online_status,
            last_seen,
            website,
            company_name,
            privacy_enabled,
            created_at,
            sections_order,
            certifications(
              id,
              profile_id,
              title,
              issuer,
              issue_date,
              expiry_date,
              credential_id,
              credential_url,
              description
            ),
            education(
              id,
              profile_id,
              school_name,
              degree,
              field_of_study,
              start_date,
              end_date,
              description
            ),
            experiences(
              id,
              profile_id,
              position,
              company,
              start_date,
              end_date,
              description
            ),
            friend_connections:friend_requests!friend_requests_sender_id_fkey(
              receiver:profiles!friend_requests_receiver_id_fkey(
                id,
                full_name,
                avatar_url,
                online_status,
                last_seen
              )
            )
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id,
            email,
            full_name,
            avatar_url,
            role,
            bio,
            phone,
            city,
            state,
            country,
            online_status,
            last_seen,
            website,
            company_name,
            privacy_enabled,
            created_at,
            sections_order,
            certifications(
              id,
              profile_id,
              title,
              issuer,
              issue_date,
              expiry_date,
              credential_id,
              credential_url,
              description
            ),
            education(
              id,
              profile_id,
              school_name,
              degree,
              field_of_study,
              start_date,
              end_date,
              description
            ),
            experiences(
              id,
              profile_id,
              position,
              company,
              start_date,
              end_date,
              description
            ),
            friend_connections:friend_requests!friend_requests_receiver_id_fkey(
              sender:profiles!friend_requests_sender_id_fkey(
                id,
                full_name,
                avatar_url,
                online_status,
                last_seen
              )
            )
          )
        `)
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (friendRequestsError) {
        toast.error("Erreur lors du chargement des connexions");
        throw friendRequestsError;
      }

      // Transform the data to get a flat list of connections
      const connections = friendRequests?.map(request => {
        const rawConnection = request.sender.id === user.id ? request.receiver : request.sender;
        
        // Transform friends data
        const friends: Friend[] = rawConnection.friend_connections?.map(fc => {
          const friend = fc.sender || fc.receiver;
          return {
            id: friend.id,
            full_name: friend.full_name,
            avatar_url: friend.avatar_url,
            online_status: friend.online_status || false,
            last_seen: friend.last_seen
          };
        }) || [];

        // Transform certifications data with required credential_id
        const certifications: Certification[] = (rawConnection.certifications || []).map(cert => ({
          id: cert.id,
          profile_id: cert.profile_id,
          title: cert.title,
          issuer: cert.issuer,
          year: undefined, // Optional field
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
          credential_id: cert.credential_id || null, // Ensure credential_id is included
          credential_url: cert.credential_url,
          description: cert.description
        }));

        const connection: UserProfile = {
          id: rawConnection.id,
          email: rawConnection.email,
          full_name: rawConnection.full_name || "",
          avatar_url: rawConnection.avatar_url,
          role: rawConnection.role,
          bio: rawConnection.bio,
          phone: rawConnection.phone,
          city: rawConnection.city,
          state: rawConnection.state,
          country: rawConnection.country,
          online_status: rawConnection.online_status,
          last_seen: rawConnection.last_seen,
          website: rawConnection.website,
          company_name: rawConnection.company_name,
          privacy_enabled: rawConnection.privacy_enabled,
          created_at: rawConnection.created_at,
          sections_order: rawConnection.sections_order,
          certifications: certifications,
          education: rawConnection.education || [],
          experiences: rawConnection.experiences || [],
          friends: friends
        };

        return connection;
      });

      return connections || [];
    }
  });

  const totalPages = Math.ceil((connections?.length || 0) / itemsPerPage);

  return {
    connections,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage
  };
}
