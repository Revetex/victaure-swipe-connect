import { UserProfile } from "@/types/profile";

interface VCardProps {
  profile: UserProfile;
  isPublicView?: boolean;
}

export function VCard({ profile, isPublicView = false }: VCardProps) {
  return (
    <div className={`vcard ${isPublicView ? 'public' : 'private'}`}>
      <h2>{profile.full_name}</h2>
      <img src={profile.avatar_url || '/default-avatar.png'} alt={profile.full_name} />
      <p>{profile.bio}</p>
      <p>{profile.email}</p>
      <p>{profile.phone}</p>
      <p>{profile.city}, {profile.state}, {profile.country}</p>
      <div>
        <h3>Certifications</h3>
        <ul>
          {profile.certifications?.map(cert => (
            <li key={cert.id}>
              {cert.title} - {cert.institution} ({cert.year})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Education</h3>
        <ul>
          {profile.education?.map(edu => (
            <li key={edu.id}>
              {edu.degree} from {edu.school_name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Experience</h3>
        <ul>
          {profile.experiences?.map(exp => (
            <li key={exp.id}>
              {exp.position} at {exp.company} ({exp.start_date} - {exp.end_date || 'Present'})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
