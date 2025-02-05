import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { VCardSection } from "@/components/VCardSection";
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;
  const shouldShowPrivateInfo = !profile.privacy_enabled || isOwnProfile;

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <VCardSection
      title="Contact"
      icon={<Mail className="h-3 w-3 text-muted-foreground" />}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative p-6 backdrop-blur-sm rounded-xl overflow-hidden"
      >
        {/* Circuit Pattern Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute inset-0"
          >
            {/* Horizontal Lines */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`h-line-${i}`}
                className="absolute h-px bg-gradient-to-r from-purple-500/20 via-purple-500/40 to-purple-500/20"
                style={{ top: `${i * 10}%`, left: 0, right: 0 }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: 1, 
                  opacity: 1,
                  transition: { 
                    delay: i * 0.1,
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              />
            ))}
            
            {/* Vertical Lines */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`v-line-${i}`}
                className="absolute w-px bg-gradient-to-b from-purple-500/20 via-purple-500/40 to-purple-500/20"
                style={{ left: `${i * 10}%`, top: 0, bottom: 0 }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ 
                  scaleY: 1, 
                  opacity: 1,
                  transition: { 
                    delay: i * 0.1,
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              />
            ))}

            {/* Circuit Nodes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`node-${i}`}
                className="absolute w-2 h-2 rounded-full bg-purple-500/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.2
                  }
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Contact Information */}
        <div className="relative z-10 space-y-4">
          {shouldShowPrivateInfo && (
            <>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-purple-500" />
                {isEditing ? (
                  <Input
                    value={profile.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Votre email"
                    className="h-8 bg-white/5 border-purple-500/20"
                  />
                ) : (
                  <span className="text-sm">{profile.email}</span>
                )}
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-purple-500" />
                {isEditing ? (
                  <Input
                    value={profile.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Votre téléphone"
                    className="h-8 bg-white/5 border-purple-500/20"
                  />
                ) : (
                  <span className="text-sm">{profile.phone}</span>
                )}
              </motion.div>
            </>
          )}

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4 text-purple-500" />
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                <Input
                  value={profile.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ville"
                  className="h-8 bg-white/5 border-purple-500/20"
                />
                <Input
                  value={profile.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Province"
                  className="h-8 bg-white/5 border-purple-500/20"
                />
                <Input
                  value={profile.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Pays"
                  className="h-8 bg-white/5 border-purple-500/20"
                />
              </div>
            ) : (
              <span className="text-sm">
                {[profile.city, profile.state, profile.country]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            )}
          </motion.div>

          {shouldShowPrivateInfo && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4 text-purple-500" />
              {isEditing ? (
                <Input
                  value={profile.website || ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="Votre site web"
                  className="h-8 bg-white/5 border-purple-500/20"
                />
              ) : profile.website ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-500 hover:text-purple-400 transition-colors"
                >
                  {profile.website}
                </a>
              ) : null}
            </motion.div>
          )}
        </div>
      </motion.div>
    </VCardSection>
  );
}