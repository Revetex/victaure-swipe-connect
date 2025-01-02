export interface Activity {
  id: string;
  type: 'message' | 'match' | 'notification';
  title: string;
  description: string;
  created_at: string;
}

export interface Sender {
  id: string;
  full_name: string | null;
}

export interface Professional {
  id: string;
  full_name: string | null;
}

export interface Job {
  id: string;
  title: string | null;
}

export interface Match {
  id: string;
  professional: Professional;
  job: Job;
}

export interface MessageResponse {
  id: string;
  content: string;
  created_at: string;
  sender: Sender;
}

export interface MatchResponse {
  id: string;
  created_at: string;
  job: Job;
  professional: Professional;
}