import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { StyleOption } from "@/components/vcard/types";
import { renderHeader } from "./cv/sections/header";
import { renderBio } from "./cv/sections/bio";
import { renderContact } from "./cv/sections/contact";
import { renderSkills } from "./cv/sections/skills";
import { renderExperiences } from "./cv/sections/experiences";
import { renderEducation } from "./cv/sections/education";
import { renderCertifications } from "./cv/sections/certifications";
import { renderFooter } from "./cv/sections/footer";
import { extendPdfDocument } from "./pdfExtensions";
import QRCode from 'qrcode';

export const generateCV = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }));

  try {
    // Set initial styles based on selected theme
    doc.setFont(selectedStyle.font || "helvetica");
    doc.setTextColor(selectedStyle.colors.text.primary);

    let currentY = 20;

    // Add metallic effect background
    doc.setGlobalAlpha(0.05);
    const gradient = doc.createLinearGradient(0, 0, 210, 297);
    gradient.addColorStop(0, selectedStyle.colors.primary);
    gradient.addColorStop(1, selectedStyle.colors.secondary);
    doc.setFillColor(gradient);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setGlobalAlpha(1);

    // Add profile photo and QR code in header
    if (profile.avatar_url) {
      try {
        const img = await loadImage(profile.avatar_url);
        doc.addImage(img, 'JPEG', 20, currentY, 30, 30);
        
        // Generate and add QR code
        const qrCodeUrl = await QRCode.toDataURL(window.location.href);
        doc.addImage(qrCodeUrl, 'PNG', 160, currentY, 30, 30);
        
        currentY += 35;
      } catch (error) {
        console.error('Error adding profile photo or QR code:', error);
        currentY += 5;
      }
    }

    // Add header with profile info
    currentY = await renderHeader(doc, profile, currentY);
    currentY += 15;

    // Add decorative separator
    doc.setDrawColor(selectedStyle.colors.primary);
    doc.setLineWidth(0.5);
    doc.line(20, currentY - 5, doc.internal.pageSize.width - 20, currentY - 5);

    // Contact information
    currentY = renderContact(doc, profile, currentY);
    currentY += 15;

    // Bio section if available
    if (profile.bio) {
      currentY = renderBio(doc, profile, currentY);
      currentY += 15;
    }

    // Skills section with improved layout
    if (profile.skills && profile.skills.length > 0) {
      currentY = renderSkills(doc, profile, currentY);
      currentY += 15;
    }

    // Check if we need a new page
    if (currentY > doc.internal.pageSize.height - 50) {
      doc.addPage();
      currentY = 20;
    }

    // Education section
    if (profile.education && profile.education.length > 0) {
      currentY = renderEducation(doc, profile, currentY);
      currentY += 15;
    }

    // Check if we need a new page
    if (currentY > doc.internal.pageSize.height - 50) {
      doc.addPage();
      currentY = 20;
    }

    // Experience section
    if (profile.experiences && profile.experiences.length > 0) {
      currentY = renderExperiences(doc, profile, currentY);
      currentY += 15;
    }

    // Certifications section
    if (profile.certifications && profile.certifications.length > 0) {
      if (currentY > doc.internal.pageSize.height - 50) {
        doc.addPage();
        currentY = 20;
      }
      currentY = renderCertifications(doc, profile.certifications, currentY);
    }

    // Footer with page numbers and style
    renderFooter(doc, selectedStyle);

    return doc;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};