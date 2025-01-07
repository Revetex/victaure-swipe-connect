import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "@/components/vcard/types";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;

export const generateBusinessCard = async (profile: UserProfile, style: StyleOption) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [85, 55]
  });

  // Front side
  doc.setFillColor(style.colors.primary);
  doc.rect(0, 0, 85, 55, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(profile.full_name || "", 5, 15);
  
  doc.setFontSize(10);
  doc.text(profile.role || "", 5, 22);
  
  doc.setFontSize(8);
  if (profile.email) doc.text(profile.email, 5, 30);
  if (profile.phone) doc.text(profile.phone, 5, 35);
  if (profile.city) doc.text(`${profile.city}, ${profile.country}`, 5, 40);

  // Back side (new page)
  doc.addPage([85, 55], "landscape");
  
  // Add logo on the back if it exists
  if (profile.avatar_url) {
    try {
      const img = await loadImage(profile.avatar_url);
      doc.addImage(img, 'JPEG', 30, 10, 25, 25);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }

  return doc;
};

export const generateCV = async (profile: UserProfile, style: StyleOption) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Set initial position
  let yPos = MARGIN;

  // Header
  doc.setFillColor(style.colors.primary);
  doc.rect(0, 0, PAGE_WIDTH, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(profile.full_name || "", MARGIN, yPos + 15);
  
  doc.setFontSize(14);
  doc.text(profile.role || "", MARGIN, yPos + 25);

  yPos = 50;

  // Contact Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  if (profile.email) doc.text(profile.email, MARGIN, yPos);
  if (profile.phone) doc.text(profile.phone, MARGIN, yPos + 5);
  if (profile.city) doc.text(`${profile.city}, ${profile.country}`, MARGIN, yPos + 10);

  yPos += 20;

  // Bio
  if (profile.bio) {
    doc.setFontSize(16);
    doc.setTextColor(style.colors.primary);
    doc.text("Présentation", MARGIN, yPos);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const bioLines = doc.splitTextToSize(profile.bio, PAGE_WIDTH - (2 * MARGIN));
    doc.text(bioLines, MARGIN, yPos + 10);
    yPos += 20 + (bioLines.length * 5);
  }

  // Education
  if (profile.education && profile.education.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(style.colors.primary);
    doc.text("Formation", MARGIN, yPos);
    yPos += 10;

    profile.education.forEach(edu => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(edu.school_name, MARGIN, yPos);
      
      doc.setFontSize(10);
      doc.text(edu.degree, MARGIN, yPos + 5);
      
      if (edu.start_date && edu.end_date) {
        doc.text(`${edu.start_date} - ${edu.end_date}`, MARGIN, yPos + 10);
      }
      
      yPos += 20;
    });
  }

  // Check if we need a new page
  if (yPos > PAGE_HEIGHT - 50) {
    doc.addPage();
    yPos = MARGIN;
  }

  // Experience
  if (profile.experiences && profile.experiences.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(style.colors.primary);
    doc.text("Expérience Professionnelle", MARGIN, yPos);
    yPos += 10;

    profile.experiences.forEach(exp => {
      // Check if we need a new page
      if (yPos > PAGE_HEIGHT - 50) {
        doc.addPage();
        yPos = MARGIN;
      }

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(exp.position, MARGIN, yPos);
      
      doc.setFontSize(10);
      doc.text(exp.company, MARGIN, yPos + 5);
      
      if (exp.start_date && exp.end_date) {
        doc.text(`${exp.start_date} - ${exp.end_date}`, MARGIN, yPos + 10);
      }
      
      if (exp.description) {
        const descLines = doc.splitTextToSize(exp.description, PAGE_WIDTH - (2 * MARGIN));
        doc.text(descLines, MARGIN, yPos + 15);
        yPos += 20 + (descLines.length * 5);
      } else {
        yPos += 20;
      }
    });
  }

  // Skills
  if (profile.skills && profile.skills.length > 0) {
    // Check if we need a new page
    if (yPos > PAGE_HEIGHT - 50) {
      doc.addPage();
      yPos = MARGIN;
    }

    doc.setFontSize(16);
    doc.setTextColor(style.colors.primary);
    doc.text("Compétences", MARGIN, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const skillsText = profile.skills.join(", ");
    const skillsLines = doc.splitTextToSize(skillsText, PAGE_WIDTH - (2 * MARGIN));
    doc.text(skillsLines, MARGIN, yPos);
  }

  return doc;
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