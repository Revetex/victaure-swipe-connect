
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    id?: string;
    name?: string;
    image?: string | null;
    full_name?: string | null; // Pour compatibilité avec le type UserProfile
    avatar_url?: string | null; // Pour compatibilité avec le type UserProfile
  };
  className?: string;
  fallbackClassName?: string; // Ajout de cette propriété
}

export function UserAvatar({ user, className, fallbackClassName }: UserAvatarProps) {
  // Obtenir les initiales à partir du nom
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // Utiliser le nom complet ou le nom d'affichage
  const displayName = user.full_name || user.name;
  
  // Utiliser l'URL de l'avatar ou l'image
  const avatarUrl = user.avatar_url || user.image;

  // Générer une couleur d'arrière-plan basée sur l'ID
  const getColor = (id?: string) => {
    if (!id) return "hsl(210, 20%, 80%)";
    
    // Générer une teinte basée sur l'ID pour avoir une couleur constante
    const hashCode = id.split("").reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);
    
    const h = Math.abs(hashCode % 360);
    
    // Utiliser HSL pour contrôler la saturation et la luminosité
    return `hsl(${h}, 70%, 40%)`;
  };

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl || undefined} alt={displayName || "Avatar"} />
      <AvatarFallback 
        style={{ backgroundColor: getColor(user.id) }}
        className={fallbackClassName || "text-white"}
      >
        {getInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );
}
