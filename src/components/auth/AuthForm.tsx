
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { BusinessSignupForm } from "./BusinessSignupForm";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { VictaureChat } from "@/components/chat/VictaureChat";

export function AuthForm({
  redirectTo
}: {
  redirectTo?: string;
}) {
  const [activeTab, setActiveTab] = useState("login");
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
      className="w-full space-y-6"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section Formulaire */}
        <div className="flex-1 p-6 bg-[#1A1F2C]/90 backdrop-blur-sm rounded-2xl border border-[#64B5D9]/10">
          <Tabs defaultValue="login" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-[#1B2A4A]/20">
              <TabsTrigger value="login" className="text-[#F2EBE4]/80">
                Connexion
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-[#F2EBE4]/80">
                Inscription
              </TabsTrigger>
              <TabsTrigger value="business" className="text-[#F2EBE4]/80">
                Entreprise
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="login">
                <LoginForm 
                  email={formData.email}
                  password={formData.password}
                  loading={loading}
                  onEmailChange={(value) => setFormData({ ...formData, email: value })}
                  onPasswordChange={(value) => setFormData({ ...formData, password: value })}
                  onSubmit={() => signIn(formData.email, formData.password)}
                  redirectTo={redirectTo}
                />
              </TabsContent>

              <TabsContent value="signup">
                <SignupForm redirectTo={redirectTo} />
              </TabsContent>

              <TabsContent value="business">
                <BusinessSignupForm redirectTo={redirectTo} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Section Chat */}
        <div className="flex-1 max-h-[600px] bg-[#1A1F2C]/90 backdrop-blur-sm rounded-2xl border border-[#64B5D9]/10 overflow-hidden">
          <VictaureChat 
            maxQuestions={3} 
            context="Je suis Mr. Victaure, votre assistant pour l'inscription. Je peux vous aider à comprendre les différentes options et répondre à vos questions. Comment puis-je vous aider aujourd'hui ?"
          />
        </div>
      </div>
    </motion.div>
  );
}
