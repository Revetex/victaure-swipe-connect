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
    <div 
      className="glass-card relative overflow-hidden w-full max-w-[500px] mx-auto cursor-pointer"
      onClick={onExpand}
      style={{ aspectRatio: '1.586/1' }} // Format carte bancaire standard
    >
      <div className="flex h-full">
        {/* Left side - Contact info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground truncate">
                  {profile.full_name || "Nom non défini"}
                </h3>
                {profile.title && (
                  <p className="text-sm text-muted-foreground truncate">
                    {profile.title}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {profile.email && (
                <div className="flex items-center gap-2 group">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {profile.email}
                  </span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-2 group">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {profile.phone}
                  </span>
                </div>
              )}
              {profile.city && (
                <div className="flex items-center gap-2 group">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {profile.city}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - QR Code section */}
        <div className="w-[180px] border-l border-border bg-background/50 flex flex-col items-center justify-center p-4">
          <div className="w-full aspect-square bg-white rounded-lg p-2">
            {isGenerating ? (
              <div className="w-full h-full animate-pulse bg-muted rounded-lg" />
            ) : (
              <QRCodeSVG
                value={pdfUrl}
                size={140}
                level="H"
                includeMargin={false}
                className="w-full h-full"
              />
            )}
          </div>
          <span className="text-xs text-muted-foreground mt-2 text-center">
            Scanner pour plus
          </span>
        </div>
      </div>
    </div>
  );
}