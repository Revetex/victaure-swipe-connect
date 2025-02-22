
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { BusinessSignupForm } from "./BusinessSignupForm";

export function AuthForm({ redirectTo }: { redirectTo?: string }) {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="w-full glass-panel rounded-lg p-6 space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="signup">Inscription</TabsTrigger>
          <TabsTrigger value="business">Entreprise</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm redirectTo={redirectTo} />
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm redirectTo={redirectTo} />
        </TabsContent>
        <TabsContent value="business">
          <BusinessSignupForm redirectTo={redirectTo} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
