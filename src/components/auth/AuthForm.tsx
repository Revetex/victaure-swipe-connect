
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { motion, AnimatePresence } from "framer-motion";

interface AuthFormProps {
  redirectTo?: string;
}

export function AuthForm({ redirectTo = '/dashboard' }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (type: 'login' | 'signup') => {
    try {
      setLoading(true);

      let result;
      if (type === 'signup') {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password
        });
      }

      const { error } = result;

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error("Veuillez confirmer votre email avant de vous connecter");
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error("Email ou mot de passe incorrect");
        } else if (error.message.includes('User already registered')) {
          toast.error("Un compte existe déjà avec cet email");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (type === 'signup') {
        toast.success("Inscription réussie! Veuillez vérifier votre email");
      } else {
        toast.success("Connexion réussie!");
        navigate(redirectTo);
      }

    } catch (error) {
      console.error('Auth error:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800"
    >
      <Tabs defaultValue="login" className="w-full p-1">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="login" 
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-100 dark:data-[state=active]:text-zinc-900"
          >
            Connexion
          </TabsTrigger>
          <TabsTrigger 
            value="signup"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-100 dark:data-[state=active]:text-zinc-900"
          >
            Inscription
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="login" className="p-6">
            <LoginForm
              email={email}
              password={password}
              loading={loading}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={() => handleAuth('login')}
            />
          </TabsContent>

          <TabsContent value="signup" className="p-6">
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
              onSubmit={() => handleAuth('signup')}
            />
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}
