
// Fonction utilitaire pour détecter les appareils mobiles
const detectMobileDevice = () => {
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function AuthFooterLinks() {
  const isMobile = detectMobileDevice();
  
  // Version simplifiée pour mobile
  if (isMobile) {
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#F1F0FB]/60">
        <a href="#" className="hover:text-[#F1F0FB]/80 transition-colors">Confidentialité</a>
        <a href="#" className="hover:text-[#F1F0FB]/80 transition-colors">Conditions</a>
        <a href="#" className="hover:text-[#F1F0FB]/80 transition-colors">Contact</a>
      </div>
    );
  }
  
  // Version complète pour desktop
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#F1F0FB]/60">
      <a href="#" className="hover:text-[#F1F0FB]/80 transition-colors">Politique de confidentialité</a>
      <a href="#" className="hover:text-[#F1F0FB]/80 transition-colors">Conditions d'utilisation</a>
      <a href="#" className="hover:text-[#F1F0FB]/80 transition-colors">Politique de cookies</a>
      <a href="#" className="hover:text-[#F1F0FB]/80 transition-colors">Contact</a>
      <a href="#" className="hover:text-[#F1F0FB]/80 transition-colors">Partenariats</a>
      <a href="#" className="hover:text-[#F1F0FB]/80 transition-colors">Tarification</a>
    </div>
  );
}
