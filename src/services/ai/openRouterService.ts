
export async function generateWithAI(prompt: string, style: "professional" | "creative" | "friendly" | "academic" = "professional") {
  const API_KEY = process.env.OPEN_ROUTER_API_KEY;
  
  const systemPrompts = {
    professional: "Tu es un rédacteur professionnel spécialisé dans les profils LinkedIn et les CV. Ton style est formel et orienté business.",
    creative: "Tu es un rédacteur créatif qui aime raconter des histoires captivantes. Ton style est dynamique et engageant.",
    friendly: "Tu es un rédacteur qui adopte un ton chaleureux et personnel. Tu mets l'accent sur l'humain et les relations.",
    academic: "Tu es un rédacteur académique qui met l'accent sur les réalisations éducatives et la rigueur intellectuelle."
  };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://victaure.com',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-2',
        messages: [
          { role: 'system', content: systemPrompts[style] },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    throw error;
  }
}
