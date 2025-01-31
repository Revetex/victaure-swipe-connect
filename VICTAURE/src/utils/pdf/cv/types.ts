import type { ExtendedJsPDF } from '../types';
import type { UserProfile } from '@/types/profile';

export type { ExtendedJsPDF };

export interface CVGeneratorOptions {
  profile: UserProfile;
  accentColor?: string;
}

export interface CVSection {
  render: (doc: ExtendedJsPDF, yPos: number) => number;
}