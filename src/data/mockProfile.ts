export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string;
  skills: string[] | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date?: string | null;
  description?: string | null;
}

export interface Certification {
  id?: string;
  title: string;
  institution: string;
  year: string;
}

export const mockProfile: UserProfile = {
  id: "mock-id",
  email: "john.doe@example.com",
  full_name: "John Doe",
  avatar_url: null,
  role: "Développeur Full Stack",
  bio: null,
  phone: "+1 (555) 123-4567",
  city: "Montréal",
  state: "Québec",
  country: "Canada",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  latitude: null,
  longitude: null
};