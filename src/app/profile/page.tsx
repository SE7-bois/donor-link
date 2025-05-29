"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSolanaWallet } from "~/lib/hooks/use-solana-wallet";
import { WalletInfo } from "~/components/wallet-info";

export default function ProfilePage() {
  const { connected } = useSolanaWallet();
  const router = useRouter();

  // Redirect if not connected
  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
  }, [connected, router]);

  if (!connected) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your wallet connection and view your activities
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:col-span-1">
          <WalletInfo />
        </div>
        <div className="md:col-span-1">
          {/* Additional profile sections can go here */}
          <div className="h-full flex items-center justify-center border border-border/50 rounded-lg bg-card/50 p-8">
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Activity</h3>
              <p className="text-muted-foreground">
                Your donation history and activity will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 