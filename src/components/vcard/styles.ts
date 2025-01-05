import { StyleOption } from "./types";

export const styleOptions: StyleOption[] = [
  {
    id: "1",
    name: "Classique",
    color: "#9b87f5",
    font: "poppins",
    displayStyle: "default",
    bgGradient: "bg-gradient-to-br from-[#1A1F2C] to-[#221F26] dark:from-[#E5DEFF]/10 dark:to-[#9b87f5]/10",
    secondaryColor: "#E5DEFF",
    accentGradient: "bg-gradient-to-br from-[#9b87f5]/10 to-[#E5DEFF]/10",
    borderStyle: "border-b-4 border-[#9b87f5]/30",
    colors: {
      primary: "#9b87f5",
      secondary: "#E5DEFF",
      text: {
        primary: "#FFFFFF",
        secondary: "#C8C8C9",
        muted: "#8E9196"
      }
    }
  },
  {
    id: "2",
    name: "Chaleureux",
    color: "#D946EF",
    font: "montserrat",
    displayStyle: "warm",
    bgGradient: "bg-gradient-to-br from-[#222222] to-[#1A1F2C] dark:from-[#FEC6A1]/10 dark:to-[#D946EF]/10",
    secondaryColor: "#FEC6A1",
    accentGradient: "bg-gradient-to-br from-[#D946EF]/10 to-[#FEC6A1]/10",
    borderStyle: "border-l-4 border-[#D946EF]/30",
    colors: {
      primary: "#D946EF",
      secondary: "#FEC6A1",
      text: {
        primary: "#FFFFFF",
        secondary: "#C8C8C9",
        muted: "#8E9196"
      }
    }
  },
  {
    id: "3",
    name: "Moderne",
    color: "#1EAEDB",
    font: "roboto",
    displayStyle: "modern",
    bgGradient: "bg-gradient-to-br from-[#1A1F2C] to-[#221F26] dark:from-[#F2FCE2]/10 dark:to-[#1EAEDB]/10",
    secondaryColor: "#F2FCE2",
    accentGradient: "bg-gradient-to-br from-[#1EAEDB]/10 to-[#F2FCE2]/10",
    borderStyle: "border-t-4 border-[#1EAEDB]/30",
    colors: {
      primary: "#1EAEDB",
      secondary: "#F2FCE2",
      text: {
        primary: "#FFFFFF",
        secondary: "#C8C8C9",
        muted: "#8E9196"
      }
    }
  },
  {
    id: "4",
    name: "Élégant",
    color: "#9b87f5",
    font: "playfair",
    displayStyle: "elegant",
    bgGradient: "bg-gradient-to-br from-[#1A1F2C] to-[#221F26] dark:from-[#E5DEFF]/10 dark:to-[#9b87f5]/10",
    secondaryColor: "#E5DEFF",
    accentGradient: "bg-gradient-to-br from-[#9b87f5]/10 to-[#E5DEFF]/10",
    borderStyle: "rounded-xl shadow-xl border-[#9b87f5]/30",
    colors: {
      primary: "#9b87f5",
      secondary: "#E5DEFF",
      text: {
        primary: "#FFFFFF",
        secondary: "#C8C8C9",
        muted: "#8E9196"
      }
    }
  },
  {
    id: "5",
    name: "Audacieux",
    color: "#D946EF",
    font: "opensans",
    displayStyle: "bold",
    bgGradient: "bg-gradient-to-br from-[#1A1F2C] to-[#221F26] dark:from-[#FEC6A1]/10 dark:to-[#D946EF]/10",
    secondaryColor: "#FEC6A1",
    accentGradient: "bg-gradient-to-br from-[#D946EF]/10 to-[#FEC6A1]/10",
    borderStyle: "border-x-4 border-[#D946EF]/30",
    colors: {
      primary: "#D946EF",
      secondary: "#FEC6A1",
      text: {
        primary: "#FFFFFF",
        secondary: "#C8C8C9",
        muted: "#8E9196"
      }
    }
  },
  {
    id: "6",
    name: "Minimaliste",
    color: "#333333",
    font: "inter",
    displayStyle: "minimal",
    bgGradient: "bg-gradient-to-br from-[#1A1F2C] to-[#221F26] dark:from-[#C8C8C9]/10 dark:to-[#333333]/10",
    secondaryColor: "#C8C8C9",
    accentGradient: "bg-gradient-to-br from-[#333333]/10 to-[#C8C8C9]/10",
    borderStyle: "border-2 border-[#333333]/30",
    colors: {
      primary: "#333333",
      secondary: "#C8C8C9",
      text: {
        primary: "#FFFFFF",
        secondary: "#C8C8C9",
        muted: "#8E9196"
      }
    }
  },
  {
    id: "7",
    name: "Créatif",
    color: "#1EAEDB",
    font: "quicksand",
    displayStyle: "creative",
    bgGradient: "bg-gradient-to-br from-[#1A1F2C] to-[#221F26] dark:from-[#FB923C]/10 dark:to-[#1EAEDB]/10",
    secondaryColor: "#FB923C",
    accentGradient: "bg-gradient-to-br from-[#1EAEDB]/10 to-[#FB923C]/10",
    borderStyle: "rounded-3xl shadow-2xl border-[#1EAEDB]/30",
    colors: {
      primary: "#1EAEDB",
      secondary: "#FB923C",
      text: {
        primary: "#FFFFFF",
        secondary: "#C8C8C9",
        muted: "#8E9196"
      }
    }
  },
  {
    id: "8",
    name: "Professionnel",
    color: "#0284C7",
    font: "lato",
    displayStyle: "professional",
    bgGradient: "bg-gradient-to-br from-[#1A1F2C] to-[#221F26] dark:from-[#38BDF8]/10 dark:to-[#0284C7]/10",
    secondaryColor: "#38BDF8",
    accentGradient: "bg-gradient-to-br from-[#0284C7]/10 to-[#38BDF8]/10",
    borderStyle: "border-r-4 border-[#0284C7]/30",
    colors: {
      primary: "#0284C7",
      secondary: "#38BDF8",
      text: {
        primary: "#FFFFFF",
        secondary: "#C8C8C9",
        muted: "#8E9196"
      }
    }
  }
];
