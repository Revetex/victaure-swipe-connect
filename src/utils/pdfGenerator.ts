import jsPDF from 'jspdf';
import type { UserProfile } from '@/types/profile';
import QRCode from 'qrcode';

export const generateVCardPDF = async (profile: UserProfile): Promise<void> => {
  try {
    const doc = new jsPDF();
    
    // Set background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Add header
    doc.setFillColor(31, 41, 55);
    doc.rect(0, 0, 210, 60, 'F');
    
    // Generate QR Code
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeUrl, 'PNG', 150, 10, 40, 40);
    
    // Add profile information
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(profile.full_name || 'Professional Profile', 20, 30);
    
    doc.setFontSize(16);
    doc.text(profile.role || '', 20, 45);
    
    // Contact Information Section
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(14);
    doc.text('Contact Information', 20, 80);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let currentY = 95;
    
    const contactInfo = [
      `Email: ${profile.email || ''}`,
      `Phone: ${profile.phone || ''}`,
      `Location: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}`,
      profile.website ? `Website: ${profile.website}` : '',
    ].filter(Boolean);
    
    contactInfo.forEach((info) => {
      doc.text(info, 20, currentY);
      currentY += 15;
    });
    
    // Skills Section
    if (profile.skills && profile.skills.length > 0) {
      currentY += 10;
      doc.setFont("helvetica", "bold");
      doc.text('Skills', 20, currentY);
      currentY += 15;
      
      doc.setFont("helvetica", "normal");
      const skillsText = profile.skills.join(', ');
      const splitSkills = doc.splitTextToSize(skillsText, 170);
      doc.text(splitSkills, 20, currentY);
      currentY += (splitSkills.length * 7) + 15;
    }
    
    // Bio Section
    if (profile.bio) {
      doc.setFont("helvetica", "bold");
      doc.text('About', 20, currentY);
      currentY += 15;
      
      doc.setFont("helvetica", "normal");
      const bioLines = doc.splitTextToSize(profile.bio, 170);
      doc.text(bioLines, 20, currentY);
      currentY += (bioLines.length * 7) + 15;
    }

    // Download the PDF directly
    doc.save(`${profile.full_name?.replace(/\s+/g, '_')}_profile.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};