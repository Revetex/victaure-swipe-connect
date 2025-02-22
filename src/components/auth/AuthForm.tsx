import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
interface AuthFormProps {
  redirectTo?: string;
}
export function AuthForm({
  redirectTo
}: AuthFormProps) {
  const [view, setView] = useState<"login" | "signup">("login");
  const {
    signIn,
    signUp,
    loading
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const handleLogin = async () => {
    await signIn(email, password, redirectTo);
  };
  const handleSignup = async () => {
    await signUp(email, password, fullName, phone, redirectTo);
  };
  const loginProps = {
    email,
    password,
    loading,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onSubmit: handleLogin
  };
  const signupProps = {
    email,
    password,
    fullName,
    phone,
    loading,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onFullNameChange: setFullName,
    onPhoneChange: setPhone,
    onSubmit: handleSignup
  };
  return <div className="w-full px-4 sm:px-0">
      <div className="relative mx-auto w-full max-w-md overflow-hidden border-2 border-[#222] rounded-xl glass-panel shadow-xl">
        <Tabs defaultValue={view} onValueChange={v => setView(v as "login" | "signup")} className="relative z-10">
          <TabsList className="w-full p-0 h-12 rounded-none bg-transparent border-b border-[#64B5D9]/20">
            <TabsTrigger value="login" className={cn("w-full h-12 rounded-none data-[state=active]:bg-transparent", "data-[state=active]:text-[#F2EBE4] data-[state=active]:border-b-2", "data-[state=active]:border-[#64B5D9] transition-colors")}>
              Se connecter
            </TabsTrigger>
            <TabsTrigger value="signup" className={cn("w-full h-12 rounded-none data-[state=active]:bg-transparent", "data-[state=active]:text-[#F2EBE4] data-[state=active]:border-b-2", "data-[state=active]:border-[#64B5D9] transition-colors")}>
              Créer un compte
            </TabsTrigger>
          </TabsList>

          <div className="p-6 bg-[#1B2A4A]/80 backdrop-blur-sm">
            {view === "login" ? <LoginForm {...loginProps} /> : <SignupForm {...signupProps} />}
          </div>
        </Tabs>
      </div>

      <footer className="mt-24 pb-8 px-4 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          

          

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-[#F2EBE4]">Nous contacter</h3>
            <form className="space-y-4">
              <Input type="text" placeholder="Votre nom" className="bg-[#1B2A4A]/80 border-[#64B5D9]/20 text-[#F2EBE4] placeholder:text-[#F2EBE4]/40" />
              <Input type="email" placeholder="Votre email" className="bg-[#1B2A4A]/80 border-[#64B5D9]/20 text-[#F2EBE4] placeholder:text-[#F2EBE4]/40" />
              <Textarea placeholder="Votre message..." className="bg-[#1B2A4A]/80 border-[#64B5D9]/20 text-[#F2EBE4] placeholder:text-[#F2EBE4]/40 min-h-[100px]" />
              <Button type="submit" className="w-full bg-[#64B5D9] text-[#F2EBE4] hover:bg-[#64B5D9]/90">
                Envoyer
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-[#64B5D9]/20" />
        
        <div className="text-center text-sm text-[#F2EBE4]/60">
          <p>© {new Date().getFullYear()} Victaure Technologies inc. Tous droits réservés.</p>
          <p className="mt-2">Une entreprise fièrement québécoise</p>
        </div>
      </footer>
    </div>;
}