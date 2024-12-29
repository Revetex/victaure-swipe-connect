export interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  skills: string[];
  experiences: Experience[];
  certifications: Certification[];
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Certification {
  id?: string;
  title: string;
  institution: string;
  year: string;
}

export const mockProfile: UserProfile = {
  name: "John Doe",
  title: "Développeur Full Stack",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  city: "Montréal",
  state: "Québec",
  country: "Canada",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  experiences: [],
  certifications: [],
};