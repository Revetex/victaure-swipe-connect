
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { BusinessSignupForm } from "./business/BusinessSignupForm";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { AuthChat } from "@/components/chat/AuthChat";

export function AuthForm({
  redirectTo
}: {
  redirectTo?: string;
}) {
  const [activeTab, setActiveTab] = useState("login");
  const [showChat, setShowChat] = useState(false);
  const {
    signIn,
    signUp,
    loading
  } = useAuth();
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
        <div className="p-6 bg-[#1A1F2C]/90 backdrop-blur-sm border border-[#64B5D9]/10 rounded-xl shadow-lg">
          <Tabs 
            defaultValue="login" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-[#1B2A4A]/20 mb-6">
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
                  onEmailChange={value => setFormData({
                    ...formData,
                    email: value
                  })} 
                  onPasswordChange={value => setFormData({
                    ...formData,
                    password: value
                  })} 
                  onSubmit={() => signIn(formData.email, formData.password)} 
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
                  onEmailChange={value => setFormData({
                    ...formData,
                    email: value
                  })} 
                  onPasswordChange={value => setFormData({
                    ...formData,
                    password: value
                  })} 
                  onFullNameChange={value => setFormData({
                    ...formData,
                    fullName: value
                  })} 
                  onPhoneChange={value => setFormData({
                    ...formData,
                    phone: value
                  })} 
                  onSubmit={() => signUp(formData.email, formData.password, formData.fullName, formData.phone)} 
                />
              </TabsContent>

              <TabsContent value="business" className="mt-0">
                <BusinessSignupForm redirectTo={redirectTo} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Bouton pour afficher/masquer l'assistant */}
        <div className="flex justify-center">
          <button 
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 text-[#F2EBE4] rounded-full border border-[#64B5D9]/30 transition-colors"
          >
            {showChat ? "Masquer l'assistant" : "Besoin d'aide ? Afficher l'assistant"}
          </button>
        </div>

        {/* Assistant réduit et déployable */}
        {showChat && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <AuthChat 
              maxQuestions={3} 
              context="Je suis l'assistant d'inscription. Je peux vous aider à comprendre les différentes options et répondre à vos questions. Comment puis-je vous aider aujourd'hui ?" 
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
