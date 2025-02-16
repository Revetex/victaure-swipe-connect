
import { PageLayout } from "@/components/layout/PageLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export default function Auth() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        <AuthForm />
      </div>
    </PageLayout>
  );
}
