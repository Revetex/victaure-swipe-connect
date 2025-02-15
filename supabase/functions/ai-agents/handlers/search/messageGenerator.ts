
import { SearchContext } from "./jobSearchUtils.ts";

export function generateNoResultsMessage(context: SearchContext): string {
  return `Je n'ai pas trouvé d'offres d'emploi correspondant exactement à vos critères. Voici quelques suggestions pour élargir votre recherche :
  - Essayez d'utiliser des mots-clés plus généraux
  - Élargissez la zone géographique
  - Modifiez les critères de salaire ou d'expérience`;
}

export function generateSuggestedActions(context: SearchContext): any[] {
  return [
    {
      type: 'modify_search',
      label: 'Élargir la zone géographique',
      icon: 'map'
    },
    {
      type: 'modify_filters',
      label: 'Modifier les filtres',
      icon: 'filter'
    },
    {
      type: 'navigate_to_jobs',
      label: 'Voir toutes les offres',
      icon: 'briefcase'
    }
  ];
}

export function generateEnhancedResponseMessage(
  count: number,
  location?: string,
  jobType?: string | null,
  experienceLevel?: string | null,
  keywords: string[] = []
): string {
  let message = `J'ai trouvé ${count} offre${count > 1 ? 's' : ''} d'emploi`;
  
  const filters = [];
  
  if (location) {
    filters.push(`à ${location}`);
  }
  
  if (jobType) {
    const types: Record<string, string> = {
      'full-time': 'à temps plein',
      'part-time': 'à temps partiel',
      'contract': 'en contrat',
      'temporary': 'temporaire',
      'internship': 'en stage'
    };
    filters.push(types[jobType] || jobType);
  }
  
  if (experienceLevel) {
    const levels: Record<string, string> = {
      'entry-level': 'pour débutant',
      'mid-level': 'niveau intermédiaire',
      'senior': 'niveau senior'
    };
    filters.push(levels[experienceLevel] || experienceLevel);
  }
  
  if (keywords.length > 0) {
    filters.push(`correspondant à "${keywords.join(', ')}"`);
  }
  
  if (filters.length > 0) {
    message += ` ${filters.join(' ')}`;
  }
  
  message += `. Voici les plus pertinentes :`;
  
  return message;
}
