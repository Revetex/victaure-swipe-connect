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
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 p-6 bg-[#1A1F2C]/90 backdrop-blur-sm border border-[#64B5D9]/10 rounded-xl">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-[#1B2A4A]/20">
              <TabsTrigger value="login" className="text-[#F2EBE4]/80">Connexion</TabsTrigger>
              <TabsTrigger value="signup" className="text-[#F2EBE4]/80">Inscription</TabsTrigger>
              <TabsTrigger value="business" className="text-[#F2EBE4]/80">Entreprise</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm email={formData.email} password={formData.password} loading={loading} onEmailChange={value => setFormData({
              ...formData,
              email: value
            })} onPasswordChange={value => setFormData({
              ...formData,
              password: value
            })} onSubmit={() => signIn(formData.email, formData.password)} redirectTo={redirectTo} />
            </TabsContent>

            <TabsContent value="signup">
              <SignupForm email={formData.email} password={formData.password} fullName={formData.fullName} phone={formData.phone} loading={loading} redirectTo={redirectTo} onEmailChange={value => setFormData({
              ...formData,
              email: value
            })} onPasswordChange={value => setFormData({
              ...formData,
              password: value
            })} onFullNameChange={value => setFormData({
              ...formData,
              fullName: value
            })} onPhoneChange={value => setFormData({
              ...formData,
              phone: value
            })} onSubmit={() => signUp(formData.email, formData.password, formData.fullName, formData.phone)} />
            </TabsContent>

            <TabsContent value="business">
              <BusinessSignupForm redirectTo={redirectTo} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1">
          <AuthChat maxQuestions={3} context="Je suis l'assistant d'inscription. Je peux vous aider à comprendre les différentes options et répondre à vos questions. Comment puis-je vous aider aujourd'hui ?" />
        </div>
      </div>
    </motion.div>;
}