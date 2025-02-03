import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return <div>Processing authentication...</div>;
}