import { Mail, Phone, MapPin, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateVCardPDF } from "@/utils/pdfGenerator";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface VCardMinimizedProps {
  profile: any;
  onExpand: () => void;
  onEdit: () => void;
}

export function VCardMinimized({ profile, onExpand, onEdit }: VCardMinimizedProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generatePDF = async () => {
      try {
        setIsGenerating(true);
        const url = await generateVCardPDF(profile);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    generatePDF();
  }, [profile]);

  return (
    <div className="glass-card p-6 relative overflow-hidden w-full aspect-[1.8/1] max-w-[600px] mx-auto">
      {/* Background gradients */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-radial from-primary/20 to-transparent opacity-50" />
      <div className="absolute left-0 bottom-0 h-1/2 w-1/3 bg-gradient-radial from-secondary/20 to-transparent opacity-50" />
      
      {/* Main content container */}
      <div className="relative z-10 flex justify-between h-full gap-8">
        {/* Left side - Contact info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-foreground">
                  {profile.full_name || "Nom non défini"}
                </h3>
                {profile.title && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.title}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {profile.email && (
                <div className="flex items-center gap-3 group">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {profile.email}
                  </span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3 group">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {profile.phone}
                  </span>
                </div>
              )}
              {profile.city && (
                <div className="flex items-center gap-3 group">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {profile.city}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - QR Code section with border */}
        <div 
          onClick={onExpand}
          className="flex flex-col items-center justify-center border-l border-border pl-8 cursor-pointer group"
        >
          <div className="p-3 rounded-xl bg-background/50 border border-border group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
            {isGenerating ? (
              <div className="w-[140px] h-[140px] animate-pulse bg-muted rounded-lg" />
            ) : (
              <QRCodeSVG
                value={pdfUrl}
                size={140}
                level="H"
                includeMargin={true}
                className="bg-white p-2 rounded-lg"
              />
            )}
          </div>
          <span className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">
            Scanner pour plus
          </span>
        </div>
      </div>
    </div>
  );
}