
export interface PaymentProps {
  onPaymentRequested: (amount: number, gameTitle: string) => Promise<void>;
}
