
import { useState } from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { useWallet } from "@/hooks/useWallet";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { PaymentMethodsList } from "@/components/settings/payment/PaymentMethodsList";
import { PaymentTypeSelector } from "@/components/settings/payment/PaymentTypeSelector";

export function WalletManager() {
  const [sendAmount, setSendAmount] = useState("");
  const [receiverWalletId, setReceiverWalletId] = useState("");
  const { wallet, isLoading, addFunds, sendFunds, freezeWallet, transactions } = useWallet();
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8"/>
      </div>
    );
  }

  if (!wallet) {
    return (
      <Alert>
        <AlertDescription>
          Wallet not found. Please contact support.
        </AlertDescription>
      </Alert>
    );
  }

  const handleSendFunds = async () => {
    try {
      if (!sendAmount || !receiverWalletId) {
        toast.error("Please fill in all fields");
        return;
      }

      await sendFunds(receiverWalletId, Number(sendAmount));
      toast.success("Funds sent successfully");
      setSendAmount("");
      setReceiverWalletId("");
    } catch (error) {
      toast.error("Failed to send funds");
      console.error("Send funds error:", error);
    }
  };

  const handleFreezeToggle = async () => {
    try {
      await freezeWallet(!wallet.is_frozen);
      toast.success(wallet.is_frozen ? "Wallet unfrozen" : "Wallet frozen");
    } catch (error) {
      toast.error("Failed to update wallet status");
      console.error("Freeze wallet error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
          <CardDescription>Manage your digital wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Wallet ID</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input 
                value={wallet.wallet_id} 
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(wallet.wallet_id);
                  toast.success("Wallet ID copied to clipboard");
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Balance</Label>
            <p className="text-2xl font-bold mt-1">
              {wallet.balance.toLocaleString('en-CA', { style: 'currency', currency: wallet.currency })}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label>Freeze Wallet</Label>
            <Switch
              checked={wallet.is_frozen}
              onCheckedChange={handleFreezeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Send Funds */}
      <Card>
        <CardHeader>
          <CardTitle>Send Funds</CardTitle>
          <CardDescription>Transfer money to another wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiverWallet">Recipient Wallet ID</Label>
            <Input
              id="receiverWallet"
              value={receiverWalletId}
              onChange={(e) => setReceiverWalletId(e.target.value)}
              placeholder="Enter recipient's wallet ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({wallet.currency})</Label>
            <Input
              id="amount"
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              placeholder="Enter amount to send"
              min="0"
              step="0.01"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSendFunds}
            disabled={!sendAmount || !receiverWalletId || wallet.is_frozen}
          >
            Send Funds
          </Button>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowPaymentMethods(!showPaymentMethods)}
          >
            {showPaymentMethods ? "Hide" : "Show"} Payment Methods
          </Button>

          {showPaymentMethods && (
            <div className="space-y-4">
              <PaymentTypeSelector />
              <PaymentMethodsList />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
