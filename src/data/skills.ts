export const skillCategories = {
  "Développement": [
    "JavaScript", "TypeScript", "Python", "React", "Node.js", "Vue.js", "Angular", "PHP", "Java", "C#",
    "Ruby", "Swift", "Kotlin", "Go", "Rust", "SQL", "MongoDB", "GraphQL", "REST API", "WebSocket",
    "HTML", "CSS", "Sass", "Less", "Tailwind CSS", "Bootstrap", "Material UI", "Redux", "MobX", "Zustand",
    "Next.js", "Nuxt.js", "Gatsby", "Webpack", "Vite", "Jest", "Cypress", "Docker", "Kubernetes", "AWS"
  ],
  "DevOps & Cloud": [
    "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "CI/CD", "Jenkins", "GitLab CI", "GitHub Actions",
    "Terraform", "Ansible", "Prometheus", "Grafana", "ELK Stack", "Linux", "Nginx", "Apache", "Shell Scripting",
    "Network Security", "Load Balancing"
  ],
  "Design": [
    "UI Design", "UX Research", "Figma", "Adobe XD", "Photoshop", "Illustrator", "InDesign", "Sketch",
    "Prototyping", "Wireframing", "Design Systems", "Typography", "Color Theory", "Responsive Design",
    "Motion Design", "3D Design", "Blender", "Maya", "ZBrush", "After Effects"
  ],
  "Gestion & Soft Skills": [
    "Agile", "Scrum", "Leadership", "Communication", "Gestion de projet", "Product Management",
    "Team Management", "Stakeholder Management", "Risk Management", "Budgeting", "Strategic Planning",
    "Problem Solving", "Critical Thinking", "Time Management", "Conflict Resolution", "Negotiation",
    "Presentation Skills", "Customer Service", "Mentoring", "Public Speaking"
  ],
  "Construction": [
    "Maçonnerie", "Charpente", "Plomberie", "Électricité", "Menuiserie", "Peinture",
    "Carrelage", "Isolation", "Toiture", "Fondations", "Gros œuvre", "Second œuvre",
    "Lecture de plans", "AutoCAD", "Revit", "BIM", "Sécurité chantier", "Normes RT2020",
    "Rénovation", "Construction durable"
  ],
  "Manuel & Artisanat": [
    "Soudure", "Mécanique", "Jardinage", "Bricolage", "Rénovation", "Installation",
    "Maintenance", "Réparation", "Assemblage", "Finition", "Ébénisterie", "Ferronnerie",
    "Vitrerie", "Serrurerie", "Tapisserie", "Couverture", "Plâtrerie", "Carrosserie",
    "Peinture décorative", "Restauration de meubles"
  ],
  "Marketing & Communication": [
    "SEO", "SEM", "Content Marketing", "Social Media", "Email Marketing", "Growth Hacking",
    "Analytics", "CRM", "Copywriting", "Brand Strategy", "Market Research", "PR",
    "Digital Advertising", "Marketing Automation", "Video Marketing", "Influencer Marketing",
    "Community Management", "Event Planning", "Marketing Strategy", "Data Analysis"
  ]
};

export const predefinedSkills = Object.values(skillCategories).flat();