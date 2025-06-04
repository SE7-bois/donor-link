import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";

// Mainnet token addresses
export const TOKEN_ADDRESSES = {
  USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  USDT: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
} as const;

// Devnet token addresses (for testing)
export const DEVNET_TOKEN_ADDRESSES = {
  USDC: new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"),
  USDT: new PublicKey("EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"),
} as const;

export type SupportedToken = "USDC" | "USDT";

/**
 * Get the token mint address for a supported token
 * @param token The token symbol
 * @param isDevnet Whether to use devnet addresses
 * @returns The token mint public key
 */
export function getTokenMintAddress(token: SupportedToken, isDevnet: boolean = false): PublicKey {
  const addresses = isDevnet ? DEVNET_TOKEN_ADDRESSES : TOKEN_ADDRESSES;
  return addresses[token];
}

/**
 * Get the associated token account address for a wallet and token
 * @param walletAddress The wallet public key
 * @param tokenMint The token mint public key
 * @returns The associated token account address
 */
export async function getTokenAccount(
  walletAddress: PublicKey,
  tokenMint: PublicKey
): Promise<PublicKey> {
  return await getAssociatedTokenAddress(tokenMint, walletAddress);
}

/**
 * Check if a token account exists and get its balance
 * @param connection The Solana connection
 * @param tokenAccount The token account public key
 * @returns Token account info with balance, or null if doesn't exist
 */
export async function getTokenAccountBalance(
  connection: Connection,
  tokenAccount: PublicKey
): Promise<{ balance: number; decimals: number } | null> {
  try {
    const accountInfo = await getAccount(connection, tokenAccount);
    return {
      balance: Number(accountInfo.amount) / Math.pow(10, accountInfo.mint.toString() === TOKEN_ADDRESSES.USDC.toString() ? 6 : 6), // Both USDC and USDT use 6 decimals
      decimals: 6,
    };
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
      return null;
    }
    throw error;
  }
}

/**
 * Create a transaction to transfer tokens between wallets
 * @param connection The Solana connection
 * @param fromWallet The sender's wallet public key
 * @param toWallet The recipient's wallet public key
 * @param tokenMint The token mint public key
 * @param amount The amount to transfer (in token units, not the smallest unit)
 * @returns A transaction ready to be signed and sent
 */
export async function createTokenTransferTransaction(
  connection: Connection,
  fromWallet: PublicKey,
  toWallet: PublicKey,
  tokenMint: PublicKey,
  amount: number
): Promise<Transaction> {
  const transaction = new Transaction();

  // Get associated token accounts
  const fromTokenAccount = await getAssociatedTokenAddress(tokenMint, fromWallet);
  const toTokenAccount = await getAssociatedTokenAddress(tokenMint, toWallet);

  // Check if recipient token account exists, create if not
  const toAccountInfo = await getTokenAccountBalance(connection, toTokenAccount);
  if (!toAccountInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        fromWallet, // payer
        toTokenAccount, // associated token account
        toWallet, // owner
        tokenMint // mint
      )
    );
  }

  // Convert amount to smallest unit (6 decimals for USDC/USDT)
  const transferAmount = Math.floor(amount * Math.pow(10, 6));

  // Add transfer instruction
  transaction.add(
    createTransferInstruction(
      fromTokenAccount, // source
      toTokenAccount, // destination
      fromWallet, // owner
      transferAmount // amount in smallest unit
    )
  );

  // Set recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromWallet;

  return transaction;
}

/**
 * Get the token balance for a wallet
 * @param connection The Solana connection
 * @param walletAddress The wallet public key
 * @param token The token symbol
 * @param isDevnet Whether to use devnet addresses
 * @returns The token balance or 0 if account doesn't exist
 */
export async function getWalletTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  token: SupportedToken,
  isDevnet: boolean = false
): Promise<number> {
  try {
    const tokenMint = getTokenMintAddress(token, isDevnet);
    const tokenAccount = await getTokenAccount(walletAddress, tokenMint);
    const balance = await getTokenAccountBalance(connection, tokenAccount);
    return balance?.balance || 0;
  } catch (error) {
    console.error(`Error fetching ${token} balance:`, error);
    return 0;
  }
}



/**
 * Format token amount with appropriate precision
 * @param amount The amount in token units
 * @param token The token symbol
 * @param maxDecimals Maximum decimal places to display
 * @returns Formatted token amount as string
 */
export function formatTokenAmount(
  amount: number,
  token: SupportedToken,
  maxDecimals: number = 2
): string {
  if (amount === null || amount === undefined) return `0 ${token}`;

  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  })} ${token}`;
} 