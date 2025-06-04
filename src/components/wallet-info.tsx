"use client";

import { useSolanaWallet } from "~/lib/hooks/use-solana-wallet";
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Shield, Lock, FileText, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { truncateAddress } from "~/lib/utils";
import { formatSolAmount } from "~/lib/solana-utils";

export function WalletInfo() {
  const { connected, publicKey, wallet, balance, isLoading } = useSolanaWallet();

  if (!connected || !wallet) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Wallet</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {wallet.adapter.icon && (
                  <img
                    src={wallet.adapter.icon}
                    alt={`${wallet.adapter.name} icon`}
                    className="w-5 h-5"
                  />
                )}
                <span className="font-medium">{wallet.adapter.name}</span>
              </div>
              <a
                href={`https://explorer.solana.com/address/${publicKey?.toString()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-purple-500 hover:underline"
              >
                View <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Address</div>
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm">{publicKey ? truncateAddress(publicKey.toString(), 10, 8) : '...'}</div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  if (publicKey) {
                    navigator.clipboard.writeText(publicKey.toString());
                  }
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Balance</div>
            <div className="font-medium">
              {isLoading ? 'Loading...' : balance !== null ? formatSolAmount(balance) : 'Unknown'}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="text-sm font-medium">Permissions Granted</div>

            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">View Address</div>
                  <div className="text-xs text-muted-foreground">Your wallet address is visible to this application</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Request Signatures</div>
                  <div className="text-xs text-muted-foreground">
                    This app can request transaction approvals, but cannot sign without your consent
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Transaction History</div>
                  <div className="text-xs text-muted-foreground">
                    This app cannot access your transaction history unless you approve it
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-center text-muted-foreground mt-4">
            Donor Link never has access to your private keys.
            <br />All transactions require your explicit approval.
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 