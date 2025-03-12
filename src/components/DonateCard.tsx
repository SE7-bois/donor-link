import { createForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

type Token = {
  symbol: "USDT" | "USDC" | "ETH" | "SOL" | "BTC";
  name: string;
  decimals: number;
};

const TOKENS: Token[] = [
  { symbol: "USDT", name: "Tether USD", decimals: 6 },
  { symbol: "USDC", name: "USD Coin", decimals: 6 },
  { symbol: "ETH", name: "Ethereum", decimals: 18 },
  { symbol: "SOL", name: "Solana", decimals: 9 },
  { symbol: "BTC", name: "Bitcoin", decimals: 8 },
];

// Mock exchange rates - in a real app, these would come from an API
const MOCK_RATES: Record<Token["symbol"], number> = {
  USDT: 1,
  USDC: 1,
  ETH: 4000,
  SOL: 180,
  BTC: 100000,
};

const formSchema = z.object({
  token: z.enum(["USDT", "USDC", "ETH", "SOL", "BTC"]),
  amount: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Amount must be a positive number"
  ),
});

type FormSchema = z.infer<typeof formSchema>;

export default function DonateCard({status}: {status: boolean}) {
  const form = createForm<FormSchema>({
    defaultValues: {
      token: "USDT",
      amount: "",
    },
    onSubmit: async ({ value }) => {
      // Here you would integrate with wallet and blockchain
      console.log("Donating", value.amount, value.token);
    },
    validatorAdapter: zodValidator,
  });

  const selectedToken = TOKENS.find(t => t.symbol === form.getFieldValue("token"))!;
  const amount = form.getFieldValue("amount");
  const usdValue = amount ? Number(amount) * MOCK_RATES[selectedToken.symbol] : 0;

  return (
    <form.Provider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="bg-emphasized-element rounded-md p-4 space-y-4"
      >
        <form.Field
          name="token"
          validators={{
            onChange: z.enum(["USDT", "USDC", "ETH", "SOL", "BTC"]),
          }}
          children={(field) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-secondary-element">
                Select Token
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as Token["symbol"])}
                className="w-full px-3 py-2 bg-background text-key-element rounded-md border border-secondary-element/20 focus:outline-none focus:ring-2 focus:ring-key-element/20"
              >
                {TOKENS.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
              {field.state.meta.errors && (
                <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        />

        <form.Field
          name="amount"
          validators={{
            onChange: formSchema.shape.amount,
          }}
          children={(field) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-secondary-element">
                Amount
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                step="any"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={`Enter amount in ${selectedToken.symbol}`}
                className="w-full px-3 py-2 bg-background text-key-element rounded-md border border-secondary-element/20 focus:outline-none focus:ring-2 focus:ring-key-element/20"
              />
              {field.state.meta.errors && (
                <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
              )}
              {amount && (
                <p className="text-sm text-secondary-element">
                  ≈ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              )}
            </div>
          )}
        />

        <button
          type="submit"
          disabled={!status || form.state.isSubmitting || !form.state.canSubmit}
          className="w-full px-4 py-2 bg-key-element text-emphasized-element font-bold rounded-md hover:bg-key-element/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status ? (form.state.isSubmitting ? "Donating..." : "Donate") : "Fundraiser Ended"}
        </button>
      </form>
    </form.Provider>
  );
}