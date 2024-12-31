import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

interface VCardExpandedHeaderProps {
  profile: any;
  setIsExpanded: (isExpanded: boolean) => void;
}

export function VCardExpandedHeader({ profile, setIsExpanded }: VCardExpandedHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-start mb-8 px-6 py-4 bg-white/5 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center gap-6">
        <Avatar className="h-32 w-32 ring-4 ring-white/10 shadow-xl">
          <AvatarImage 
            src={profile.avatar_url} 
            alt={profile.full_name}
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-800">
            <UserRound className="h-16 w-16 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {profile.full_name || "Nom non défini"}
          </h1>
          <p className="text-xl text-gray-300">
            {profile.role || "Rôle non défini"}
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
          <QRCodeSVG
            value={window.location.href}
            size={120}
            level="H"
            includeMargin={true}
            className="rounded-lg"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </motion.div>
  );
}