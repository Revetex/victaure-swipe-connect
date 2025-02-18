
export async function generateWithAI(prompt: string, style: "professional" | "creative" | "friendly" | "academic" = "professional") {
  try {
    const systemPrompt = `En tant que rédacteur professionnel, génère une description courte et percutante en français. 
    Utilise des verbes d'action au passé composé. Limite la description à 2 phrases maximum.
    Concentre-toi sur les réalisations clés et l'impact.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la génération de la description");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    throw new Error("Erreur lors de la génération du texte. Veuillez réessayer.");
  }
}
