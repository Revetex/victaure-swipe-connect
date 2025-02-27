
import { Certification, Education, Experience } from "@/types/profile";

export function mapCertificationToData(cert: Certification) {
  return {
    id: cert.id,
    title: cert.title,
    issuer: cert.issuer,
    issue_date: cert.issue_date,
    expiry_date: cert.expiry_date,
    credential_url: cert.credential_url,
    description: cert.description,
    skills: cert.skills || [],
    year: cert.year,
    profile_id: cert.profile_id
  };
}

export function mapEducationToData(edu: Education) {
  return {
    id: edu.id,
    school_name: edu.school_name,
    degree: edu.degree,
    field_of_study: edu.field_of_study,
    start_date: edu.start_date,
    end_date: edu.end_date,
    description: edu.description,
    profile_id: edu.profile_id
  };
}

export function mapExperienceToData(exp: Experience) {
  return {
    id: exp.id,
    position: exp.position,
    company: exp.company,
    start_date: exp.start_date,
    end_date: exp.end_date,
    description: exp.description,
    profile_id: exp.profile_id
  };
}
