import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { BusinessSignupForm } from "./BusinessSignupForm";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
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
  return <div className="w-full max-w-md mx-auto">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="bg-[#1B2A4A]/60 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border-2 border-[#64B5D9]/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative overflow-hidden">
        {/* Effet de brillance sur les bords */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#64B5D9]/20 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#64B5D9]/20 to-transparent" />
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="relative z-10">
          <TabsList className="grid grid-cols-3 w-full mb-6 bg-[#D3E4FD]/5 border-2 border-[#D3E4FD]/20 rounded-lg p-1 px-[4px] py-[2px]">
            <TabsTrigger value="login" className="text-[#F1F0FB] data-[state=active]:bg-[#64B5D9]/20 data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200">
              Connexion
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-[#F1F0FB] data-[state=active]:bg-[#64B5D9]/20 data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200">
              Inscription
            </TabsTrigger>
            <TabsTrigger value="business" className="text-[#F1F0FB] data-[state=active]:bg-[#64B5D9]/20 data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200">
              Entreprise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0 space-y-6">
            <LoginForm email={formData.email} password={formData.password} loading={loading} redirectTo={redirectTo} onEmailChange={value => setFormData(prev => ({
            ...prev,
            email: value
          }))} onPasswordChange={value => setFormData(prev => ({
            ...prev,
            password: value
          }))} onSubmit={() => signIn(formData.email, formData.password, redirectTo)} />
          </TabsContent>

          <TabsContent value="signup" className="mt-0 space-y-6">
            <SignupForm email={formData.email} password={formData.password} fullName={formData.fullName} phone={formData.phone} loading={loading} redirectTo={redirectTo} onEmailChange={value => setFormData(prev => ({
            ...prev,
            email: value
          }))} onPasswordChange={value => setFormData(prev => ({
            ...prev,
            password: value
          }))} onFullNameChange={value => setFormData(prev => ({
            ...prev,
            fullName: value
          }))} onPhoneChange={value => setFormData(prev => ({
            ...prev,
            phone: value
          }))} onSubmit={() => signUp(formData.email, formData.password, formData.fullName, formData.phone, redirectTo)} />
          </TabsContent>

          <TabsContent value="business" className="mt-0 space-y-6">
            <BusinessSignupForm redirectTo={redirectTo} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>;
}