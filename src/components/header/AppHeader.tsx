
import { Star, Menu, Bot, Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { VictaureChat } from "@/components/chat/VictaureChat";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AppHeaderProps {
  totalJobs?: number;
  onRequestAssistant?: () => void;
  showMobileMenu?: boolean;
  setShowMobileMenu?: (show: boolean) => void;
}

interface SearchResult {
  id: string;
  title: string;
  company: string;
  location: string;
}

export function AppHeader({
  totalJobs,
  showMobileMenu,
  setShowMobileMenu
}: AppHeaderProps) {
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearching(true);
      console.log('Recherche effectuée pour:', searchQuery);
      
      try {
        // Simuler des résultats de recherche pour démonstration
        const mockResults: SearchResult[] = [
          {
            id: '1',
            title: 'Développeur Frontend',
            company: 'TechCorp',
            location: 'Montréal'
          },
          {
            id: '2',
            title: 'Développeur Backend',
            company: 'WebSolutions',
            location: 'Québec'
          },
          {
            id: '3',
            title: 'Développeur Full Stack',
            company: 'DigitalCo',
            location: 'Laval'
          }
        ];

        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSearchResults(mockResults.filter(result => 
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.location.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      } catch (error) {
        console.error('Erreur de recherche:', error);
        toast.error("Erreur lors de la recherche");
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleMenuClick = () => {
    if (setShowMobileMenu) {
      setShowMobileMenu(!showMobileMenu);
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] flex flex-col h-auto items-center justify-between px-4 bg-[#1A1F2C] border-b border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMenuClick}
                className="text-white hover:bg-white/10 border border-white/10 active:scale-95 transition-transform touch-manipulation"
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src="/lovable-uploads/color-logo.png"
                    alt="Victaure Logo"
                    className="h-9 w-9 object-contain shrink-0"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-[#64B5D9] text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white/20"
                  >
                    BETA
                  </Badge>
                </div>
                <span className="relative font-tiempos font-black tracking-[0.15em] text-[#F2EBE4] text-2xl shrink-0 pl-1">
                  VICTAURE
                </span>
              </div>

              <div className="hidden lg:flex flex-1 max-w-2xl ml-8">
                <div className="grid grid-cols-[1fr,auto,auto] gap-2 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      onKeyPress={handleKeyPress}
                      placeholder="Rechercher un emploi, une entreprise..."
                      className="h-10 pl-10 pr-4 w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 transition-colors"
                    />
                  </div>
                  
                  <Select>
                    <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <SelectValue placeholder="Lieu" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="montreal">Montréal</SelectItem>
                      <SelectItem value="quebec">Québec</SelectItem>
                      <SelectItem value="laval">Laval</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    className="h-10 px-4 bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {totalJobs !== undefined && (
                <div className="hidden sm:flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <span className="text-xs text-white/80 whitespace-nowrap">
                    {totalJobs} offres disponibles
                  </span>
                </div>
              )}

              <Button
                onClick={() => setShowChat(true)}
                className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#64B5D9]/20 to-[#64B5D9]/10 hover:from-[#64B5D9]/30 hover:to-[#64B5D9]/20 border border-[#64B5D9]/20 rounded-full transition-all duration-300 shadow-lg shadow-black/20"
                title="Assistant IA"
              >
                <Bot className="h-4 w-4 text-[#64B5D9] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white/90 hidden sm:block">Assistant IA</span>
              </Button>

              <Dialog open={showChat} onOpenChange={setShowChat}>
                <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 bg-[#1A1F2C] border border-[#64B5D9]/20 rounded-2xl mx-auto my-auto overflow-hidden">
                  <VictaureChat 
                    maxQuestions={user ? undefined : 3}
                    context="Tu es Mr. Victaure, un assistant professionnel spécialisé dans l'emploi. Tu aides les utilisateurs à trouver du travail et à améliorer leur carrière."
                    onMaxQuestionsReached={() => {
                      setShowChat(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="lg:hidden w-full pb-4">
            <div className="grid grid-cols-[1fr,auto] gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyPress={handleKeyPress}
                  placeholder="Rechercher un emploi..."
                  className="h-10 pl-10 pr-4 w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 transition-colors"
                />
              </div>
              <Button
                variant="outline"
                className="h-10 px-4 bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {showResults && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-[4.5rem] left-0 right-0 z-[99] px-4 bg-[#1A1F2C]/95 backdrop-blur-sm border-b border-white/5"
        >
          <div className="w-full max-w-3xl mx-auto py-4">
            <div className="bg-[#1B2A4A] rounded-lg shadow-xl border border-[#64B5D9]/10 p-4">
              {isSearching ? (
                <div className="flex items-center justify-center text-white/60 py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Recherche en cours...
                </div>
              ) : searchQuery ? (
                searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map(result => (
                      <div 
                        key={result.id}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <h3 className="text-white font-medium">{result.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-white/60">
                          <span>{result.company}</span>
                          <span>•</span>
                          <span>{result.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/60 py-4 text-center">
                    Aucun résultat trouvé pour "{searchQuery}"
                  </div>
                )
              ) : (
                <div className="text-white/60 py-4 text-center">
                  Commencez à taper pour rechercher
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
