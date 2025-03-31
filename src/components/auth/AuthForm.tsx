
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { BusinessSignupForm } from "./business/BusinessSignupForm";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { AuthChat } from "@/components/chat/AuthChat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

export function AuthForm({
  redirectTo
}: {
  redirectTo?: string;
}) {
  const [activeTab, setActiveTab] = useState("login");
  const [showChat, setShowChat] = useState(false);
  const [showExtendedHelp, setShowExtendedHelp] = useState(false);
  const { signIn, signUp, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-col gap-6">
        <div className="p-6 bg-[#1A1F2C]/90 backdrop-blur-sm border border-[#64B5D9]/10 rounded-xl shadow-lg relative">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#1B2A4A]/20 mb-6 py-0 my-[8px]">
              <TabsTrigger 
                value="login" 
                className={`text-[#F2EBE4]/80 transition-all py-3 ${activeTab === 'login' ? 'bg-[#64B5D9]/20 text-[#64B5D9]' : ''}`}
              >
                Connexion
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className={`text-[#F2EBE4]/80 transition-all py-3 ${activeTab === 'signup' ? 'bg-[#64B5D9]/20 text-[#64B5D9]' : ''}`}
              >
                Inscription
              </TabsTrigger>
              <TabsTrigger 
                value="business" 
                className={`text-[#F2EBE4]/80 transition-all py-3 ${activeTab === 'business' ? 'bg-[#64B5D9]/20 text-[#64B5D9]' : ''}`}
              >
                Entreprise
              </TabsTrigger>
            </TabsList>

            <div className="relative overflow-hidden mt-2">
              <TabsContent value="login" className="mt-0">
                <LoginForm 
                  email={formData.email} 
                  password={formData.password} 
                  loading={loading} 
                  onEmailChange={value => setFormData({...formData, email: value})} 
                  onPasswordChange={value => setFormData({...formData, password: value})} 
                  onSubmit={() => signIn(formData.email, formData.password, redirectTo)} 
                  redirectTo={redirectTo} 
                />
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <SignupForm 
                  email={formData.email} 
                  password={formData.password} 
                  fullName={formData.fullName} 
                  phone={formData.phone} 
                  loading={loading} 
                  redirectTo={redirectTo} 
                  onEmailChange={value => setFormData({...formData, email: value})} 
                  onPasswordChange={value => setFormData({...formData, password: value})} 
                  onFullNameChange={value => setFormData({...formData, fullName: value})} 
                  onPhoneChange={value => setFormData({...formData, phone: value})} 
                  onSubmit={() => signUp(formData.email, formData.password, formData.fullName, formData.phone)} 
                />
              </TabsContent>

              <TabsContent value="business" className="mt-0">
                <BusinessSignupForm redirectTo={redirectTo} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Quick help section */}
        <motion.div 
          animate={{ height: showExtendedHelp ? 'auto' : '46px' }}
          className="relative overflow-hidden"
        >
          <Card className="p-3 border-[#64B5D9]/10 backdrop-blur-sm py-0 bg-transparent px-[8px]">
            <div 
              className="flex items-center justify-between cursor-pointer" 
              onClick={() => setShowExtendedHelp(!showExtendedHelp)}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#64B5D9]" />
                <h3 className="font-medium text-[#F2EBE4]">
                  {activeTab === 'login' ? "Problèmes de connexion ?" : 
                   activeTab === 'signup' ? "Guide d'inscription rapide" : 
                   "Avantages des comptes entreprise"}
                </h3>
              </div>
              <Button variant="ghost" size="sm" className="text-[#F2EBE4]/70 hover:text-[#F2EBE4]">
                {showExtendedHelp ? "Masquer" : "Afficher"}
              </Button>
            </div>

            {/* Help content sections based on active tab */}
            {activeTab === 'login' && showExtendedHelp && (
              <div className="mt-3 space-y-2 text-sm text-[#F2EBE4]/80">
                <p>• Si vous avez oublié votre mot de passe, cliquez sur "Mot de passe oublié"</p>
                <p>• Vérifiez que vous utilisez la bonne adresse email</p>
                <p>• Assurez-vous que le verrouillage des majuscules est désactivé</p>
                <p>• Si vous continuez à rencontrer des problèmes, contactez notre support</p>
                <div className="pt-2">
                  <Button 
                    variant="link" 
                    className="px-0 text-[#64B5D9] h-auto text-sm" 
                    onClick={() => setShowChat(true)}
                  >
                    Discuter avec notre assistant →
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'signup' && showExtendedHelp && (
              <div className="mt-3 space-y-2 text-sm text-[#F2EBE4]/80">
                <p>• Utilisez une adresse email professionnelle pour une meilleure crédibilité</p>
                <p>• Choisissez un mot de passe fort (min. 8 caractères, lettres, chiffres et symboles)</p>
                <p>• Remplissez votre profil complètement pour maximiser votre visibilité</p>
                <p>• Après l'inscription, vous recevrez un email de confirmation</p>
                <div className="pt-2">
                  <Button 
                    variant="link" 
                    className="px-0 text-[#64B5D9] h-auto text-sm" 
                    onClick={() => setShowChat(true)}
                  >
                    Des questions ? Parlez à notre assistant →
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'business' && showExtendedHelp && (
              <div className="mt-3 space-y-2 text-sm text-[#F2EBE4]/80">
                <p>• Publiez des offres d'emploi illimitées et accédez à notre base de talents</p>
                <p>• Profitez d'outils de recrutement avancés et d'analyses détaillées</p>
                <p>• Bénéficiez d'un support client prioritaire et personnalisé</p>
                <p>• Essai gratuit de 30 jours sans engagement</p>
                <div className="pt-2">
                  <Button 
                    variant="link" 
                    className="px-0 text-[#64B5D9] h-auto text-sm" 
                    onClick={() => setShowChat(true)}
                  >
                    Plus d'informations avec notre assistant →
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Assistant chat */}
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <AuthChat 
                maxQuestions={3} 
                context={
                  activeTab === 'login' 
                    ? "Je suis l'assistant d'authentification. Je peux vous aider avec tout problème de connexion ou question liée à l'accès à votre compte." 
                    : activeTab === 'signup' 
                    ? "Je suis l'assistant d'inscription. Je peux vous aider à créer votre compte personnel et répondre à vos questions sur le processus d'inscription." 
                    : "Je suis l'assistant pour les comptes entreprise. Je peux vous expliquer les avantages des comptes professionnels et vous aider avec le processus d'inscription pour votre entreprise."
                } 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
