import { AuthForm } from "./AuthForm";
import { AuthVideo } from "./AuthVideo";
import { Logo } from "../Logo";

export function AuthContent() {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Logo */}
      <div className="w-full flex justify-center mb-8">
        <Logo size="lg" className="w-24 h-24" />
      </div>

      {/* Welcome Text */}
      <div className="w-full text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          Bienvenue sur Victaure
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Connectez-vous ou créez un compte pour continuer
        </p>
      </div>

      {/* Auth Form */}
      <div className="w-full mb-12">
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <AuthForm />
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full max-w-2xl mb-12">
        <AuthVideo />
      </div>
    </div>
  );
}