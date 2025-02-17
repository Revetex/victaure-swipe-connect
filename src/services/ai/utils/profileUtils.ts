
import { UserProfile } from "@/types/profile";
import { transformToFullProfile } from "@/utils/profileTransformers";

export function transformFromDatabase(data: any): UserProfile {
  return transformToFullProfile(data);
}

export function transformToDatabase(profile: UserProfile) {
  const { certifications, education, experiences, friends, ...rest } = profile;
  return rest;
}
