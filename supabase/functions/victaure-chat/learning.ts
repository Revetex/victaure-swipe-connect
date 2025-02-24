
import { supabase } from './db.ts';

export const getRelevantInteractions = async (question: string, limit = 5) => {
  const tags = extractTags(question);
  if (tags.length === 0) return [];

  const { data, error } = await supabase
    .from('ai_learning_data')
    .select('question, response, context, feedback_score')
    .contains('tags', tags)
    .order('feedback_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching relevant interactions:', error);
    return [];
  }

  return data;
};

const extractTags = (message: string): string[] => {
  const topics = [
    "emploi", "recrutement", "profil", "cv", "formation", 
    "compétences", "entretien", "carrière", "navigation", 
    "technique", "général", "aide"
  ];
  
  return topics.filter(topic => 
    message.toLowerCase().includes(topic.toLowerCase())
  );
};
