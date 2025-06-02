import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
      CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
      NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
      hasWalletConnectProjectId: !!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    },
    request: {
      host: process.env.VERCEL_URL || "localhost",
      timestamp: new Date().toISOString(),
    }
  });
} 