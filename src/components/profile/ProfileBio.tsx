interface ProfileBioProps {
  bio?: string | null;
}

export function ProfileBio({ bio }: ProfileBioProps) {
  if (!bio) return null;
  
  return (
    <p className="text-sm text-center text-muted-foreground/90 border-t border-border/50 pt-4">
      {bio}
    </p>
  );
}