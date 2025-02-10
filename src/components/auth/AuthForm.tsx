
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
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="container mx-auto px-4 py-8 max-w-md"
        >
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="login">
                <LoginForm
                  email={email}
                  password={password}
                  loading={loading}
                  onEmailChange={setEmail}
                  onPasswordChange={setPassword}
                  onSubmit={() => handleAuth('login')}
                />
              </TabsContent>

              <TabsContent value="signup">
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
      </div>
    </div>
  );
}
