
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthFormProps {
  redirectTo?: string;
}

export function AuthForm({ redirectTo }: AuthFormProps) {
  const [view, setView] = useState<"login" | "signup">("login");
  const { signIn, signUp, loading } = useAuth();
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="w-full">
      <div className="relative mx-auto w-full max-w-md overflow-hidden border border-[#64B5D9]/20 rounded-xl glass-panel shadow-xl">
        <div className="absolute inset-0 bg-[#F2EBE4]/5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2364B5D9' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <Tabs 
          defaultValue={view} 
          onValueChange={(v) => setView(v as "login" | "signup")}
          className="relative z-10"
        >
          <TabsList className="w-full p-0 h-12 rounded-none bg-transparent border-b border-[#64B5D9]/20">
            <TabsTrigger 
              value="login" 
              className={cn(
                "w-full h-12 rounded-none data-[state=active]:bg-transparent",
                "data-[state=active]:text-[#F2EBE4] data-[state=active]:border-b-2",
                "data-[state=active]:border-[#64B5D9] transition-colors"
              )}
            >
              Se connecter
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className={cn(
                "w-full h-12 rounded-none data-[state=active]:bg-transparent",
                "data-[state=active]:text-[#F2EBE4] data-[state=active]:border-b-2",
                "data-[state=active]:border-[#64B5D9] transition-colors"
              )}
            >
              Créer un compte
            </TabsTrigger>
          </TabsList>

          <div className="p-6 bg-[#1B2A4A]/80 backdrop-blur-sm">
            <AnimatePresence mode="wait" custom={view === "login" ? -1 : 1}>
              <motion.div
                key={view}
                custom={view === "login" ? -1 : 1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="space-y-4"
              >
                <TabsContent value="login" forceMount>
                  {view === "login" && (
                    <LoginForm
                      email={email}
                      password={password}
                      loading={loading}
                      onEmailChange={setEmail}
                      onPasswordChange={setPassword}
                      onSubmit={handleLogin}
                    />
                  )}
                </TabsContent>
                <TabsContent value="signup" forceMount>
                  {view === "signup" && (
                    <SignupForm
                      email={email}
                      password={password}
                      fullName={fullName}
                      phone={phone}
                      loading={loading}
                      onEmailChange={setEmail}
                      onPasswordChange={setPassword}
                      onFullNameChange={setFullName}
                      onPhoneChange={setPhone}
                      onSubmit={handleSignup}
                    />
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
