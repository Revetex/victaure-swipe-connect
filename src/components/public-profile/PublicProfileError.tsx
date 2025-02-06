export function PublicProfileError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Profil non trouvé</h1>
      <p className="text-muted-foreground">Ce profil n'existe pas ou a été supprimé.</p>
    </div>
  );
}