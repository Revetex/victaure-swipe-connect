
import { useState, useEffect } from "react";
import { JobList } from "../JobList";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";

const SEARCH_ENGINE_ID = "22e4528bd7c6f4db0";
const API_KEY = "AIzaSyACeSmrGf4l49R9E3-I3ZRU-R9YtxTVj60";

export function ExternalSearchSection() {
  useEffect(() => {
    // Ajouter le script Google Custom Search
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=${SEARCH_ENGINE_ID}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Nettoyer le script lors du démontage
      const existingScript = document.querySelector(`script[src*="cse.google.com"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Recherche d'emplois</h3>
      <Card className="p-4">
        <div className="gcse-search"></div>
      </Card>
    </div>
  );
}
