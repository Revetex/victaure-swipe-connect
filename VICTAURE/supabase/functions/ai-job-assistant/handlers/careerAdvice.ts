export async function handleCareerAdvice(message: string, profile: any) {
  const advice = generateCareerAdvice(profile);
  
  return {
    message: advice.message,
    suggestedActions: advice.actions
  };
}

function generateCareerAdvice(profile: any) {
  const advice = {
    message: "",
    actions: [] as any[]
  };

  if (profile.role === 'professional') {
    advice.message = "Voici quelques conseils pour optimiser votre recherche d'emploi";
    advice.actions = [
      {
        type: 'navigate_to_profile',
        label: 'Optimiser mon profil',
        icon: 'user'
      },
      {
        type: 'navigate_to_jobs',
        label: 'Explorer les offres',
        icon: 'briefcase'
      }
    ];
  } else {
    advice.message = "Voici quelques conseils pour attirer les meilleurs talents";
    advice.actions = [
      {
        type: 'create_job',
        label: 'Publier une offre',
        icon: 'briefcase'
      }
    ];
  }

  return advice;
}