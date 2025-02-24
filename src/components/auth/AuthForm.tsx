
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { BusinessSignupForm } from "./BusinessSignupForm";
import { useAuth } from "@/hooks/useAuth";

export function AuthForm({ redirectTo }: { redirectTo?: string }) {
  const [activeTab, setActiveTab] = useState("login");
  const { signIn, signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });

  return (
    <div className="w-full">
      <div className="relative group">
        {/* Effet de brillance au survol */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#64B5D9]/20 to-[#9B6CD9]/20 dark:from-[#64B5D9]/10 dark:to-[#9B6CD9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
        
        {/* Conteneur principal avec effet glassmorphism */}
        <div className="bg-white/10 dark:bg-[#1B2A4A]/60 backdrop-blur-xl p-8 rounded-2xl border-2 border-white/20 dark:border-[#D3E4FD]/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative overflow-hidden">
          {/* Effet de brillance sur les bords */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#64B5D9]/20 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#64B5D9]/20 to-transparent" />
          </div>

          <div className="relative mb-6">
            <div className="flex items-center justify-center gap-4">
              <img src="/lovable-uploads/color-logo.png" alt="Logo" className="w-10 h-10" />
              <div className="relative">
                <h2 className="text-2xl font-tiempos font-black tracking-[0.15em] text-[#F2EBE4] uppercase">
                  Victaure
                  <div className="absolute -top-2 -right-12 bg-[#64B5D9] text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white/20">
                    BETA
                  </div>
                </h2>
              </div>
            </div>
          </div>

          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab}
            className="relative z-10"
          >
            <TabsList className="grid grid-cols-3 w-full mb-6 bg-white/5 dark:bg-[#D3E4FD]/5 border-2 border-white/20 dark:border-[#D3E4FD]/20 rounded-lg p-1">
              <TabsTrigger 
                value="login"
                className="text-gray-800 dark:text-[#F1F0FB] data-[state=active]:bg-[#64B5D9]/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200"
              >
                Connexion
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="text-gray-800 dark:text-[#F1F0FB] data-[state=active]:bg-[#64B5D9]/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200"
              >
                Inscription
              </TabsTrigger>
              <TabsTrigger 
                value="business"
                className="text-gray-800 dark:text-[#F1F0FB] data-[state=active]:bg-[#64B5D9]/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200"
              >
                Entreprise
              </TabsTrigger>
            </TabsList>

            <TabsContent 
              value="login"
              className="mt-0 space-y-6"
            >
              <LoginForm 
                email={formData.email}
                password={formData.password}
                loading={loading}
                redirectTo={redirectTo}
                onEmailChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                onPasswordChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                onSubmit={() => signIn(formData.email, formData.password, redirectTo)}
              />
            </TabsContent>

            <TabsContent 
              value="signup"
              className="mt-0 space-y-6"
            >
              <SignupForm 
                email={formData.email}
                password={formData.password}
                fullName={formData.fullName}
                phone={formData.phone}
                loading={loading}
                redirectTo={redirectTo}
                onEmailChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                onPasswordChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                onFullNameChange={(value) => setFormData(prev => ({ ...prev, fullName: value }))}
                onPhoneChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                onSubmit={() => signUp(formData.email, formData.password, formData.fullName, formData.phone, redirectTo)}
              />
            </TabsContent>

            <TabsContent 
              value="business"
              className="mt-0 space-y-6"
            >
              <BusinessSignupForm redirectTo={redirectTo} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
