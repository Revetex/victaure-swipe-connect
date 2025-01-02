import { Json } from './auth';

export interface ProfileTypes {
  Tables: {
    profiles: {
      Row: {
        id: string;
        email: string;
        full_name: string | null;
        avatar_url: string | null;
        role: string;
        bio: string | null;
        skills: string[] | null;
        created_at: string | null;
        updated_at: string | null;
        phone: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        latitude: number | null;
        longitude: number | null;
        online_status: boolean | null;
        last_seen: string | null;
        company_name: string | null;
        company_size: string | null;
        industry: string | null;
        website: string | null;
      };
      Insert: {
        id: string;
        email: string;
        full_name?: string | null;
        avatar_url?: string | null;
        role: string;
        bio?: string | null;
        skills?: string[] | null;
        created_at?: string | null;
        updated_at?: string | null;
        phone?: string | null;
        city?: string | null;
        state?: string | null;
        country?: string | null;
        latitude?: number | null;
        longitude?: number | null;
        online_status?: boolean | null;
        last_seen?: string | null;
        company_name?: string | null;
        company_size?: string | null;
        industry?: string | null;
        website?: string | null;
      };
      Update: {
        id?: string;
        email?: string;
        full_name?: string | null;
        avatar_url?: string | null;
        role?: string;
        bio?: string | null;
        skills?: string[] | null;
        created_at?: string | null;
        updated_at?: string | null;
        phone?: string | null;
        city?: string | null;
        state?: string | null;
        country?: string | null;
        latitude?: number | null;
        longitude?: number | null;
        online_status?: boolean | null;
        last_seen?: string | null;
        company_name?: string | null;
        company_size?: string | null;
        industry?: string | null;
        website?: string | null;
      };
    };
  };
}