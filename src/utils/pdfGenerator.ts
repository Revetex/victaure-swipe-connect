import type { UserProfile } from '@/types/profile';
import { supabase } from "@/integrations/supabase/client";

export const generateVCardPDF = async (profile: UserProfile): Promise<string> => {
  // Generate code representation of the profile with Victaure branding
  const codeOutput = generateProfileCode(profile);
  
  try {
    const blob = new Blob([codeOutput], { type: 'text/plain' });
    const filename = `${profile.id}_${Date.now()}.txt`;
    
    const { data, error } = await supabase
      .storage
      .from('vcards')
      .upload(filename, blob, {
        contentType: 'text/plain',
        upsert: true
      });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase
      .storage
      .from('vcards')
      .getPublicUrl(filename);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading code file:', error);
    throw error;
  }
};

const generateProfileCode = (profile: UserProfile): string => {
  return `
/**
 * Victaure Professional Profile
 * Generated on ${new Date().toLocaleString()}
 * 
 * ⚡️ Powered by Victaure
 * 🎨 Design System: Modern Glassmorphism
 * 
 * Background: linear-gradient(135deg, #1A1F2C 0%, #403E43 100%)
 * Primary: #9b87f5
 * Secondary: #7E69AB
 * Accent: #D946EF
 */

interface ProfessionalProfile {
  personalInfo: {
    fullName: string;
    role: string;
    email: string;
    phone?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  skills: string[];
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
  }>;
  certifications: Array<{
    title: string;
    issuer: string;
    issueDate?: string;
    expiryDate?: string;
  }>;
}

const ${profile.full_name?.replace(/\s+/g, '')}Profile: ProfessionalProfile = {
  personalInfo: {
    fullName: "${profile.full_name || ''}",
    role: "${profile.role || ''}",
    email: "${profile.email || ''}",
    phone: "${profile.phone || ''}",
    location: {
      city: "${profile.city || ''}",
      state: "${profile.state || ''}",
      country: "${profile.country || ''}"
    }
  },
  skills: ${JSON.stringify(profile.skills || [], null, 2)},
  education: ${JSON.stringify(profile.education || [], null, 2)},
  certifications: ${JSON.stringify(profile.certifications || [], null, 2)}
};

// Export profile for use in applications
export default ${profile.full_name?.replace(/\s+/g, '')}Profile;
`;
};