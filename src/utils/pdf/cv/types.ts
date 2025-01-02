import type { UserProfile } from '@/types/profile';
import type { ExtendedJsPDF } from '../types';

export interface CVGeneratorOptions {
  profile: UserProfile;
  accentColor?: string;
}

export interface CVSection {
  render: (doc: ExtendedJsPDF, yPos: number) => number;
}