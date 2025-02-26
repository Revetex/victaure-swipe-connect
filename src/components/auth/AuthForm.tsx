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
  return;
}