
import { useState } from "react";

export function useCalculator() {
  const [balance, setBalance] = useState(0);
  
  const deposit = (amount: number) => {
    setBalance(prevBalance => prevBalance + amount);
  };
  
  const withdraw = (amount: number) => {
    if (amount <= balance) {
      setBalance(prevBalance => prevBalance - amount);
    }
  };
  
  return {
    balance,
    deposit,
    withdraw
  };
}
