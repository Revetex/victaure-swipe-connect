
import { WalletManager } from "./WalletManager";

export function WalletPage() {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Wallet</h1>
      <WalletManager />
    </div>
  );
}
