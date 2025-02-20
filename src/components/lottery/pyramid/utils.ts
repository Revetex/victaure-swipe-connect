
export interface PyraidLevel {
  id: number;
  name: string;
  description: string;
  prize: number;
  multiplier: number;
  maxSelections: number;
  maxNumbers: number;
}

export const levels: Record<number, PyraidLevel> = {
  1: {
    id: 1,
    name: "BASE",
    description: "Sélectionnez 3 numéros parmi 30 disponibles",
    prize: 50,
    multiplier: 1,
    maxSelections: 3,
    maxNumbers: 30
  },
  2: {
    id: 2,
    name: "BRONZE",
    description: "Choisissez 2 numéros parmi 20",
    prize: 200,
    multiplier: 2,
    maxSelections: 2,
    maxNumbers: 20
  },
  3: {
    id: 3,
    name: "ARGENT",
    description: "Sélectionnez 2 numéros parmi 25",
    prize: 1000,
    multiplier: 3,
    maxSelections: 2,
    maxNumbers: 25
  },
  4: {
    id: 4,
    name: "OR",
    description: "Choisissez 1 numéro parmi 15",
    prize: 5000,
    multiplier: 5,
    maxSelections: 1,
    maxNumbers: 15
  },
  5: {
    id: 5,
    name: "PLATINE",
    description: "Sélectionnez 1 symbole parmi 10",
    prize: 20000,
    multiplier: 10,
    maxSelections: 1,
    maxNumbers: 10
  },
  6: {
    id: 6,
    name: "DIAMANT",
    description: "Choisissez 1 couleur parmi 5",
    prize: 100000,
    multiplier: 20,
    maxSelections: 1,
    maxNumbers: 5
  },
  7: {
    id: 7,
    name: "IMPERIAL",
    description: "Sélectionnez 1 choix parmi 3",
    prize: 1000000,
    multiplier: 50,
    maxSelections: 1,
    maxNumbers: 3
  }
};

export function generateWinningNumbers(level: number): number[] {
  const numbers: number[] = [];
  const currentLevel = levels[level];
  
  while (numbers.length < currentLevel.maxSelections) {
    const num = Math.floor(Math.random() * currentLevel.maxNumbers) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  
  return numbers;
}
