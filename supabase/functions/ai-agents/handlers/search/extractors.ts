
export function extractKeywords(message: string): string[] {
  const text = message.toLowerCase();
  const keywords = [];
  
  const constructionKeywords = [
    'construction', 'chantier', 'bâtiment', 'maçon', 'charpentier',
    'plombier', 'électricien', 'peintre', 'menuisier', 'gestion',
    'projet', 'équipe', 'sécurité', 'qualité', 'maintenance',
    'rénovation', 'installation', 'supervision', 'coordination'
  ];

  for (const keyword of constructionKeywords) {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  }

  const words = text.split(/\s+/);
  const jobRelatedTerms = ['expérience', 'compétences', 'diplôme', 'certification', 'permis'];
  
  words.forEach(word => {
    if (jobRelatedTerms.includes(word)) {
      keywords.push(word);
    }
  });

  return keywords;
}

export function extractLocation(message: string): string {
  const cities = [
    'trois-rivieres', 'trois rivieres', 'trois-rivières', 'trois rivières',
    'montreal', 'montréal', 'quebec', 'québec', 'laval', 'gatineau',
    'sherbrooke', 'saguenay', 'levis', 'lévis', 'longueuil', 'saint-jean',
    'repentigny', 'saint-jérôme', 'drummondville', 'granby', 'shawinigan'
  ];
  
  const text = message.toLowerCase();
  for (const city of cities) {
    if (text.includes(city)) {
      return city.includes('trois') ? 'Trois-Rivieres' : 
             city.startsWith('montreal') ? 'Montreal' :
             city.startsWith('quebec') ? 'Quebec' : 
             city.charAt(0).toUpperCase() + city.slice(1);
    }
  }
  
  return '';
}

export function extractJobType(message: string): string | null {
  const text = message.toLowerCase();
  
  if (text.includes('temps plein') || text.includes('permanent')) {
    return 'full-time';
  }
  if (text.includes('temps partiel')) {
    return 'part-time';
  }
  if (text.includes('contractuel') || text.includes('contrat')) {
    return 'contract';
  }
  if (text.includes('temporaire')) {
    return 'temporary';
  }
  if (text.includes('stage')) {
    return 'internship';
  }
  
  return null;
}

export function extractExperienceLevel(message: string): string | null {
  const text = message.toLowerCase();
  
  if (text.includes('junior') || text.includes('débutant')) {
    return 'entry-level';
  }
  if (text.includes('senior') || text.includes('expérimenté')) {
    return 'senior';
  }
  if (text.includes('intermédiaire')) {
    return 'mid-level';
  }
  
  return null;
}

export function extractSalaryRange(message: string): { min?: number; max?: number } | null {
  const text = message.toLowerCase();
  
  const salaryPattern = /(\d{2,3}(?:[\s,.]?\d{3})*(?:\s?k)?)/g;
  const matches = text.match(salaryPattern);
  
  if (!matches) return null;
  
  const numbers = matches.map(match => {
    const num = parseInt(match.replace(/[\s,k]/g, ''));
    return num < 1000 ? num * 1000 : num;
  }).sort((a, b) => a - b);
  
  if (numbers.length === 1) {
    return { min: numbers[0] };
  }
  
  return {
    min: numbers[0],
    max: numbers[numbers.length - 1]
  };
}
