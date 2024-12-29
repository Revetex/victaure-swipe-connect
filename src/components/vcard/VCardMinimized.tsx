import { Mail, Phone, MapPin } from "lucide-react";

interface VCardMinimizedProps {
  profile: any;
  onExpand: () => void;
  onEdit: () => void;
}

export function VCardMinimized({ profile, onExpand, onEdit }: VCardMinimizedProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex-1">
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{profile.city}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onExpand}
          className="text-muted-foreground hover:text-foreground"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="text-muted-foreground hover:text-foreground"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Éditer
        </Button>
      </div>
    </>
  );
}