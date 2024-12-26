export const mockProfile = {
  name: "John Smith",
  title: "Senior Full Stack Developer",
  email: "john.smith@example.com",
  phone: "+1 (514) 555-0123",
  skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
  experiences: [
    {
      company: "Tech Solutions",
      position: "Lead Developer",
      duration: "2020 - Present",
    },
    {
      company: "Digital Agency",
      position: "Full Stack Developer",
      duration: "2018 - 2020",
    },
  ],
  certifications: [
    {
      title: "AWS Certified Solutions Architect",
      institution: "Amazon Web Services",
      year: "2023",
    },
    {
      title: "Master in Computer Science",
      institution: "University of Montreal",
      year: "2018",
    },
  ],
};

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  skills: string[];
  experiences: {
    company: string;
    position: string;
    duration: string;
  }[];
  certifications: {
    title: string;
    institution: string;
    year: string;
  }[];
}