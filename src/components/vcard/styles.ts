export const styleOptions = [
  { id: "1", name: "Moderne" },
  { id: "2", name: "Classique" },
  { id: "3", name: "Minimaliste" },
  { id: "4", name: "Créatif" },
  { id: "5", name: "Professionnel" },
  { id: "6", name: "Élégant" },
  { id: "7", name: "Dynamique" }
];

export const cardStyles = {
  "1": {
    container: "bg-gradient-to-br from-blue-500 to-purple-600",
    header: "text-white",
    content: "bg-white/10 backdrop-blur-md",
    text: "text-white",
    accent: "border-white/20"
  },
  "2": {
    container: "bg-gray-100 dark:bg-gray-900",
    header: "text-gray-900 dark:text-gray-100",
    content: "bg-white dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-300",
    accent: "border-gray-200 dark:border-gray-700"
  },
  "3": {
    container: "bg-white dark:bg-black",
    header: "text-gray-900 dark:text-gray-100",
    content: "bg-gray-50 dark:bg-gray-900",
    text: "text-gray-500 dark:text-gray-400",
    accent: "border-gray-100 dark:border-gray-800"
  },
  "4": {
    container: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
    header: "text-white",
    content: "bg-white/20 backdrop-blur-lg",
    text: "text-white",
    accent: "border-white/30"
  },
  "5": {
    container: "bg-blue-900 dark:bg-gray-900",
    header: "text-white",
    content: "bg-white/5 backdrop-blur-sm",
    text: "text-blue-50 dark:text-gray-200",
    accent: "border-blue-800 dark:border-gray-800"
  },
  "6": {
    container: "bg-gradient-to-br from-gray-900 to-black",
    header: "text-white",
    content: "bg-white/10 backdrop-blur-md",
    text: "text-gray-200",
    accent: "border-gray-800"
  },
  "7": {
    container: "bg-gradient-to-r from-green-400 to-blue-500",
    header: "text-white",
    content: "bg-white/15 backdrop-blur-lg",
    text: "text-white",
    accent: "border-white/25"
  }
};

export type CardStyle = keyof typeof cardStyles;

export const getCardStyle = (styleId: string) => {
  return cardStyles[styleId as CardStyle] || cardStyles["1"];
};