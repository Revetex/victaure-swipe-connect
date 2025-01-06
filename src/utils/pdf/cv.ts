import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

export const generateCV = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }) as ExtendedJsPDF;

  let currentY = 20;

  // Add profile photo if available
  if (profile.avatar_url) {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profile.avatar_url;
      });
      doc.addImage(img, 'JPEG', 20, currentY, 30, 30);
      currentY += 35;
    } catch (error) {
      console.error('Error loading profile photo:', error);
    }
  }

  // Header with name and role using selected style
  doc.setTextColor(selectedStyle.color);
  doc.setFontSize(24);
  doc.setFont(selectedStyle.font || 'helvetica', 'bold');
  doc.text(profile.full_name || '', 20, currentY);
  currentY += 10;

  doc.setFontSize(16);
  doc.setFont(selectedStyle.font || 'helvetica', 'normal');
  doc.text(profile.role || '', 20, currentY);
  currentY += 15;

  // Contact information
  doc.setTextColor(51, 51, 51);
  doc.setFontSize(12);
  if (profile.email) {
    doc.text(`Email: ${profile.email}`, 20, currentY);
    currentY += 6;
  }
  if (profile.phone) {
    doc.text(`Téléphone: ${profile.phone}`, 20, currentY);
    currentY += 6;
  }
  if (profile.city || profile.state || profile.country) {
    doc.text(`Localisation: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}`, 20, currentY);
    currentY += 10;
  }

  // Bio section
  if (profile.bio) {
    doc.setTextColor(selectedStyle.color);
    doc.setFontSize(14);
    doc.setFont(selectedStyle.font || 'helvetica', 'bold');
    doc.text('À propos', 20, currentY);
    currentY += 8;
    
    doc.setTextColor(51, 51, 51);
    doc.setFont(selectedStyle.font || 'helvetica', 'normal');
    doc.setFontSize(12);
    const bioLines = doc.splitTextToSize(profile.bio, 170);
    doc.text(bioLines, 20, currentY);
    currentY += bioLines.length * 5 + 10;
  }

  // Skills section
  if (profile.skills && profile.skills.length > 0) {
    doc.setTextColor(selectedStyle.color);
    doc.setFontSize(14);
    doc.setFont(selectedStyle.font || 'helvetica', 'bold');
    doc.text('Compétences', 20, currentY);
    currentY += 8;
    
    doc.setTextColor(51, 51, 51);
    doc.setFont(selectedStyle.font || 'helvetica', 'normal');
    doc.setFontSize(12);
    const skillsText = profile.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, currentY);
    currentY += skillsLines.length * 5 + 10;
  }

  // Experience section
  if (profile.experiences && profile.experiences.length > 0) {
    doc.setTextColor(selectedStyle.color);
    doc.setFontSize(14);
    doc.setFont(selectedStyle.font || 'helvetica', 'bold');
    doc.text('Expérience professionnelle', 20, currentY);
    currentY += 8;

    profile.experiences.forEach(exp => {
      doc.setTextColor(51, 51, 51);
      doc.setFont(selectedStyle.font || 'helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(exp.position, 20, currentY);
      currentY += 5;
      
      doc.setFont(selectedStyle.font || 'helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(exp.company, 20, currentY);
      currentY += 5;
      
      if (exp.start_date) {
        const dateText = exp.end_date 
          ? `${new Date(exp.start_date).toLocaleDateString()} - ${new Date(exp.end_date).toLocaleDateString()}`
          : `Depuis ${new Date(exp.start_date).toLocaleDateString()}`;
        doc.text(dateText, 20, currentY);
        currentY += 5;
      }

      if (exp.description) {
        const descLines = doc.splitTextToSize(exp.description, 170);
        doc.text(descLines, 20, currentY);
        currentY += descLines.length * 5 + 5;
      }
      
      currentY += 5;
    });
  }

  // Education section
  if (profile.education && profile.education.length > 0) {
    doc.setTextColor(selectedStyle.color);
    doc.setFontSize(14);
    doc.setFont(selectedStyle.font || 'helvetica', 'bold');
    doc.text('Formation', 20, currentY);
    currentY += 8;

    profile.education.forEach(edu => {
      doc.setTextColor(51, 51, 51);
      doc.setFont(selectedStyle.font || 'helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(edu.degree, 20, currentY);
      currentY += 5;
      
      doc.setFont(selectedStyle.font || 'helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(edu.school_name, 20, currentY);
      currentY += 5;
      
      if (edu.start_date) {
        const dateText = edu.end_date 
          ? `${new Date(edu.start_date).toLocaleDateString()} - ${new Date(edu.end_date).toLocaleDateString()}`
          : `Depuis ${new Date(edu.start_date).toLocaleDateString()}`;
        doc.text(dateText, 20, currentY);
        currentY += 5;
      }

      if (edu.description) {
        const descLines = doc.splitTextToSize(edu.description, 170);
        doc.text(descLines, 20, currentY);
        currentY += descLines.length * 5 + 5;
      }
      
      currentY += 5;
    });
  }

  // Add QR code at the bottom
  try {
    const qrCodeUrl = await QRCode.toDataURL(window.location.href);
    doc.addImage(qrCodeUrl, 'PNG', 170, 250, 25, 25);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  return doc;
};