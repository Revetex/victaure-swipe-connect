
interface AvatarLoaderProps {
  isLoading: boolean;
}

export function AvatarLoader({ isLoading }: AvatarLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
