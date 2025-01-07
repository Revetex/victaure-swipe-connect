import { Json } from './auth';

export interface MatchTypes {
  Tables: {
    matches: {
      Row: {
        id: string;
        job_id: string;
        professional_id: string;
        employer_id: string | null;
        status: string;
        created_at: string | null;
        updated_at: string | null;
        match_score: number | null;
      };
      Insert: {
        job_id: string;
        professional_id: string;
        employer_id?: string | null;
        status: string;
        created_at?: string | null;
        updated_at?: string | null;
        match_score?: number | null;
      };
      Update: {
        id: string;
        job_id?: string;
        professional_id?: string;
        employer_id?: string | null;
        status?: string;
        created_at?: string | null;
        updated_at?: string | null;
        match_score?: number | null;
      };
    };
  };
}
