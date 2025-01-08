import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "@/components/vcard/types";
import QRCode from "qrcode";

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
  doc.setFillColor(hexToRgb(style.color).r, hexToRgb(style.color).g, hexToRgb(style.color).b);
  doc.rect(0, 0, 85, 55, "F");

  // Add metallic effect lines
  doc.setDrawColor(hexToRgb(style.secondaryColor).r, hexToRgb(style.secondaryColor).g, hexToRgb(style.secondaryColor).b);
  doc.setLineWidth(0.1);
  for (let i = 0; i < 85; i += 2) {
    doc.line(i, 0, i, 55);
  }

  // Add name and details in white
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(profile.full_name || "", 10, 15);
  
  doc.setFontSize(12);
  doc.text(profile.role || "", 10, 22);
  
  doc.setFontSize(8);
  if (profile.email) doc.text(profile.email, 10, 30);
  if (profile.phone) doc.text(profile.phone, 10, 35);
  if (profile.city) doc.text(`${profile.city}, ${profile.country}`, 10, 40);

  // Generate QR Code
  const qrCodeDataUrl = await QRCode.toDataURL(window.location.href, {
    color: {
      dark: '#FFFFFF',
      light: '#00000000'
    },
    width: 500,
    margin: 1
  });
  
  doc.addImage(qrCodeDataUrl, "PNG", 55, 10, 25, 25);

  // Back side
  doc.addPage([85, 55], "landscape");
  
  // Add background color
  doc.setFillColor(hexToRgb(style.color).r, hexToRgb(style.color).g, hexToRgb(style.color).b);
  doc.rect(0, 0, 85, 55, "F");
  
  // Add Victaure logo text
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  const text = "Victaure";
  const textWidth = doc.getTextWidth(text);
  doc.text(text, (85 - textWidth) / 2, 30);

  return doc;
};

export const generateCV = async (profile: UserProfile, style: StyleOption) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Header with style color
  doc.setFillColor(hexToRgb(style.color).r, hexToRgb(style.color).g, hexToRgb(style.color).b);
  doc.rect(0, 0, PAGE_WIDTH, 50, "F");

  let yPos = MARGIN;

  // Add profile photo if available
  if (profile.avatar_url) {
    try {
      const img = await loadImage(profile.avatar_url);
      // Add circular mask for the image
      doc.setFillColor(255, 255, 255);
      doc.circle(MARGIN + 15, yPos + 15, 15, 'F');
      doc.addImage(img, 'JPEG', MARGIN, yPos, 30, 30);
    } catch (error) {
      console.error('Error loading profile photo:', error);
    }
  }

  // Add QR code
  const qrCodeDataUrl = await QRCode.toDataURL(window.location.href, {
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 500,
    margin: 1
  });
  doc.addImage(qrCodeDataUrl, "PNG", PAGE_WIDTH - MARGIN - 20, yPos, 20, 20);

  // Header text in white
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(profile.full_name || "", MARGIN + 35, yPos + 15);
  
  doc.setFontSize(14);
  doc.text(profile.role || "", MARGIN + 35, yPos + 25);

  yPos = 60;

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
    doc.setTextColor(hexToRgb(style.color).r, hexToRgb(style.color).g, hexToRgb(style.color).b);
    doc.text("Présentation", MARGIN, yPos);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const bioLines = doc.splitTextToSize(profile.bio, PAGE_WIDTH - (2 * MARGIN));
    doc.text(bioLines, MARGIN, yPos + 10);
    yPos += 20 + (bioLines.length * 5);
  }

  // Rest of the sections with style colors for headers
  if (profile.experiences?.length) {
    yPos = addSection(doc, "Expérience Professionnelle", profile.experiences, yPos, style.color);
  }

  if (profile.education?.length) {
    yPos = addSection(doc, "Formation", profile.education, yPos, style.color);
  }

  if (profile.skills?.length) {
    yPos = addSkillsSection(doc, profile.skills, yPos, style.color);
  }

  // Add Victaure logo at the bottom
  doc.setFontSize(12);
  doc.setTextColor(hexToRgb(style.color).r, hexToRgb(style.color).g, hexToRgb(style.color).b);
  const text = "Victaure";
  const textWidth = doc.getTextWidth(text);
  doc.text(text, (PAGE_WIDTH - textWidth) / 2, PAGE_HEIGHT - 10);

  return doc;
};

const addSection = (doc: jsPDF, title: string, items: any[], yPos: number, color: string) => {
  if (yPos > PAGE_HEIGHT - 50) {
    doc.addPage();
    yPos = MARGIN;
  }

  doc.setFontSize(16);
  doc.setTextColor(hexToRgb(color).r, hexToRgb(color).g, hexToRgb(color).b);
  doc.text(title, MARGIN, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  items.forEach(item => {
    if (yPos > PAGE_HEIGHT - 50) {
      doc.addPage();
      yPos = MARGIN;
    }

    if ('position' in item) {
      // Experience item
      doc.setFontSize(12);
      doc.text(item.position, MARGIN, yPos);
      doc.setFontSize(10);
      doc.text(item.company, MARGIN, yPos + 5);
      if (item.start_date && item.end_date) {
        doc.text(`${item.start_date} - ${item.end_date}`, MARGIN, yPos + 10);
      }
      if (item.description) {
        const descLines = doc.splitTextToSize(item.description, PAGE_WIDTH - (2 * MARGIN));
        doc.text(descLines, MARGIN, yPos + 15);
        yPos += 20 + (descLines.length * 5);
      } else {
        yPos += 20;
      }
    } else if ('school_name' in item) {
      // Education item
      doc.setFontSize(12);
      doc.text(item.school_name, MARGIN, yPos);
      doc.setFontSize(10);
      doc.text(item.degree, MARGIN, yPos + 5);
      if (item.start_date && item.end_date) {
        doc.text(`${item.start_date} - ${item.end_date}`, MARGIN, yPos + 10);
      }
      yPos += 20;
    }
  });

  return yPos;
};

const addSkillsSection = (doc: jsPDF, skills: string[], yPos: number, color: string) => {
  if (yPos > PAGE_HEIGHT - 50) {
    doc.addPage();
    yPos = MARGIN;
  }

  doc.setFontSize(16);
  doc.setTextColor(hexToRgb(color).r, hexToRgb(color).g, hexToRgb(color).b);
  doc.text("Compétences", MARGIN, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const skillsText = skills.join(", ");
  const skillsLines = doc.splitTextToSize(skillsText, PAGE_WIDTH - (2 * MARGIN));
  doc.text(skillsLines, MARGIN, yPos);
  yPos += 10 + (skillsLines.length * 5);

  return yPos;
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

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};
