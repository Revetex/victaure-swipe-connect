
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
    <div className="w-full glass-panel rounded-lg p-6 space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="signup">Inscription</TabsTrigger>
          <TabsTrigger value="business">Entreprise</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
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
        <TabsContent value="signup">
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
        <TabsContent value="business">
          <BusinessSignupForm redirectTo={redirectTo} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
