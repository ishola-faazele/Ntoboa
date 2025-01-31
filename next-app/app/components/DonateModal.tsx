import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { ethers } from "ethers";

export function DonateModal({
  address,
  onDonate,
}: {
  address: string;
  onDonate: (amount: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const isValidAmount = (value: string) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 && num <= 100;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value && !isValidAmount(value)) {
      setError("Please enter a valid amount between 0 and 100 ETH");
    } else {
      setError("");
    }
  };

  const formatError = (err: Error): string => {
    // Handle ethers.js specific errors
    if (err.code === "CALL_EXCEPTION") {
      return "Transaction failed. Please check your wallet balance and try again.";
    }

    // Handle user rejected transaction
    if (err.code === "ACTION_REJECTED") {
      return "Transaction was rejected. Please try again.";
    }

    // Handle insufficient funds
    if (err.code === "INSUFFICIENT_FUNDS") {
      return "Insufficient funds to complete this transaction.";
    }

    // Handle network errors
    if (err.code === "NETWORK_ERROR") {
      return "Network error. Please check your connection and try again.";
    }

    // Handle unpredictable gas limit
    if (err.message?.includes("cannot estimate gas")) {
      return "Unable to estimate gas. The transaction might fail.";
    }

    return err.message || "Transaction failed. Please try again.";
  };

  const handleDonate = async () => {
    if (!isValidAmount(amount)) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await onDonate(parseFloat(amount));
      setIsOpen(false);
      setAmount("");
    } catch (err) {
      console.error("Donation error:", err);
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          size="lg"
        >
          Donate Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white border-0">
        <DialogHeader className="bg-blue-600 -mx-6 -mt-6 p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-bold text-white">
            Donate to Charity
          </DialogTitle>
          <DialogDescription className="text-sm text-blue-100">
            Support our cause by making a donation to address:{" "}
            <span className="font-mono bg-blue-500 text-white p-1 rounded">
              {shortenedAddress}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert
              variant="destructive"
              className="text-sm bg-red-50 border-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="amount"
              className="text-right font-medium text-gray-700"
            >
              Amount (ETH)
            </Label>
            <div className="col-span-3">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.0"
                step="0.01"
                min="0"
                max="100"
                className="font-mono border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum donation: 100 ETH
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 pt-4">
          <Button
            onClick={handleDonate}
            disabled={!isValidAmount(amount) || isLoading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Donate ${amount ? `${amount} ETH` : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DonateModal;
