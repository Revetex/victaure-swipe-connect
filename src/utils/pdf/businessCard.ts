import { jsPDF } from "jspdf";
import { UserProfile } from "@/types/profile";
import { ExtendedJsPDF } from "@/types/pdf";
import { extendPdfDocument } from "./pdfExtensions";
import { StyleOption } from "@/components/vcard/types";
import { supabase } from "@/integrations/supabase/client";

const generateSlogan = async (profile: UserProfile): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-slogan', {
      body: { profile }
    });
    
    if (error) throw error;
    return data.slogan || "Professional Excellence";
  } catch (error) {
    console.error('Error generating slogan:', error);
    return "Professional Excellence";
  }
};

export const generateBusinessCard = async (
  profile: UserProfile,
  selectedStyle: StyleOption
): Promise<ExtendedJsPDF> => {
  const doc = extendPdfDocument(new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  }));

  // Front side
  try {
    // Generate AI slogan
    const slogan = await generateSlogan(profile);

    // Apply metallic gradient effect
    doc.setGlobalAlpha(0.8);
    const gradient = doc.createLinearGradient(0, 0, 85.6, 53.98);
    gradient.addColorStop(0, selectedStyle.colors.primary);
    gradient.addColorStop(1, selectedStyle.colors.secondary);
    doc.setFillColor(gradient);
    doc.rect(0, 0, 85.6, 53.98, 'F');
    doc.setGlobalAlpha(1);

    // Add decorative metallic accent
    doc.setDrawColor(selectedStyle.colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(10, 15, 75.6, 15);

    // Add profile photo if available
    if (profile.avatar_url) {
      try {
        const img = await loadImage(profile.avatar_url);
        doc.addImage(img, 'JPEG', 5, 5, 15, 15);
      } catch (error) {
        console.error('Error adding profile photo:', error);
      }
    }

    // Add name and title with enhanced styling
    doc.setTextColor(selectedStyle.colors.text.primary);
    doc.setFont("helvetica", 'bold');
    doc.setFontSize(16);
    doc.text(profile.full_name || '', 25, 12);
    
    doc.setFont("helvetica", 'normal');
    doc.setFontSize(12);
    doc.setTextColor(selectedStyle.colors.text.secondary);
    doc.text(profile.role || '', 25, 18);

    // Add AI-generated slogan
    doc.setFontSize(10);
    doc.setTextColor(selectedStyle.colors.text.muted);
    doc.text(`"${slogan}"`, 25, 25, { maxWidth: 50 });

    // Add contact details
    doc.setFontSize(9);
    let contactY = 35;
    
    if (profile.email) {
      doc.text(profile.email, 25, contactY);
      contactY += 5;
    }
    
    if (profile.phone) {
      doc.text(profile.phone, 25, contactY);
      contactY += 5;
    }
    
    if (profile.city) {
      const location = [profile.city, profile.state, profile.country]
        .filter(Boolean)
        .join(', ');
      doc.text(location, 25, contactY);
    }

    // Add QR code
    try {
      const qrCode = await generateQRCode(window.location.href);
      doc.addImage(qrCode, 'PNG', 65, 30, 15, 15);
    } catch (error) {
      console.error('Error adding QR code:', error);
    }

    // Back side with Victaure logo
    doc.addPage([85.6, 53.98], 'landscape');
    
    // Add metallic background
    doc.setGlobalAlpha(0.1);
    for (let i = 0; i < 85.6; i += 5) {
      for (let j = 0; j < 53.98; j += 5) {
        doc.setFillColor(selectedStyle.colors.primary);
        doc.circle(i, j, 0.3, 'F');
      }
    }
    doc.setGlobalAlpha(1);

    // Add Victaure logo centered
    try {
      const logoUrl = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png";
      doc.addImage(logoUrl, 'PNG', 30, 15, 25, 25);
    } catch (error) {
      console.error('Error adding logo:', error);
    }

    // Add elegant border
    doc.setDrawColor(selectedStyle.colors.primary);
    doc.setLineWidth(0.5);
    doc.roundedRect(5, 5, 75.6, 43.98, 3, 3, 'S');

  } catch (error) {
    console.error('Error generating business card:', error);
    throw error;
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

const generateQRCode = async (url: string): Promise<string> => {
  const QRCode = await import('qrcode');
  return QRCode.toDataURL(url);
};