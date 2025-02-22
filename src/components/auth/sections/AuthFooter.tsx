import { Link } from "react-router-dom";
export function AuthFooter() {
  return <footer className="mt-24 w-full max-w-xl mx-auto px-4 text-center">
      <div className="space-y-8 border-t border-[#F2EBE4]/10 pt-8">
        

        <div className="text-sm text-[#F2EBE4]/60">
          <p>© {new Date().getFullYear()} Victaure Technologies inc.</p>
        </div>
      </div>
    </footer>;
}