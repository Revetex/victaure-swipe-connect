interface ProfileSkillsProps {
  skills?: string[] | null;
}

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  if (!skills?.length) return null;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {skills.slice(0, 5).map((skill, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}