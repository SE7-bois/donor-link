import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

/**
 * Gets the SOL balance for a public key
 * @param publicKey The public key to check balance for
 * @param connection The Solana connection
 * @returns The balance in SOL (not lamports)
 */
export async function getSolanaBalance(
  publicKey: PublicKey,
  connection: Connection
): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching Solana balance:", error);
    throw error;
  }
}

/**
 * Formats a SOL amount with appropriate precision
 * @param amount The amount in SOL
 * @param maxDecimals Maximum decimal places to display
 * @returns Formatted SOL amount as string
 */
export function formatSolAmount(amount: number, maxDecimals: number = 4): string {
  if (amount === null || amount === undefined) return "0 SOL";

  // If very small amount, show more decimals
  const decimals = amount < 0.01 ? Math.max(maxDecimals, 6) : maxDecimals;

  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  })} SOL`;
} 