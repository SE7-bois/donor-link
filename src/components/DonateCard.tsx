import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { z } from "zod";

type Token = {
  symbol: "USDT" | "USDC" | "ETH" | "SOL" | "BTC";
  name: string;
};

const TOKENS: Token[] = [
  { symbol: "USDT", name: "Tether USD" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "BTC", name: "Bitcoin" },
];

const MOCK_RATES: Record<Token["symbol"], number> = {
  USDT: 1,
  USDC: 1,
  ETH: 4000,
  SOL: 180,
  BTC: 100000,
};

const formSchema = z.object({
  token: z.enum(["USDT", "USDC", "ETH", "SOL", "BTC"], {message: "Invalid token."}),
  amount: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Amount must be a positive number"
  )
});

export default function DonateCard({status: active}: {status: boolean}) {

  const form = useForm({
    defaultValues: {
      token: "USDT",
      amount: "1",
    },
    onSubmit: async ({value}) => {
      alert(JSON.stringify(value));
    }
  })

  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS.find(t => t.symbol === form.getFieldValue("token"))!);
  const [amount, setAmount] = useState<string>(form.getFieldValue("amount"));
  const [usdValue, setUsdValue] = useState<number>(Number(amount) * MOCK_RATES[selectedToken.symbol]);

  const handleSelectTokenChange = (value: Token["symbol"]) => {
    setSelectedToken(TOKENS.find(t => t.symbol === value)!);
    form.setFieldValue("token", value);
    if (amount) {
      setUsdValue(Number(amount) * MOCK_RATES[value]);
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setUsdValue(Number(value) * MOCK_RATES[selectedToken.symbol]);
  }

  return (
      <form onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      method="POST"
      className={`${active ? "opacity-100" : "opacity-30"} transition-opacity duration-300 flex flex-col gap-4`}>
        <form.Field
          name="token"
          validators={{
            onChange: ({value}) => {
              const result = formSchema.shape.token.safeParse(value)
              if (!result.success) {
                return result.error.format()._errors
              }
              handleSelectTokenChange(value as Token["symbol"])
              return undefined
            }
          }}
          children={(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-secondary-element">
                Select Token
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                disabled={!active}
                onChange={(e) => field.handleChange(e.target.value as Token["symbol"])}
                className="w-full px-3 py-2 bg-background text-key-element rounded-md border border-secondary-element/20 focus:outline-none focus:ring-2 focus:ring-key-element/20"
              > 
                {TOKENS.map((token) => (
                  <option key={token.symbol} value={token.symbol} className="text-key-element bg-emphasized-element">
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        />
        <form.Field
          name="amount"
          validators={{
            onChange: ({value}) => {
              const result = formSchema.shape.amount.safeParse(value)
              if (!result.success) {
                return result.error.format()._errors
              }
              handleAmountChange(value)
              return undefined
            }
          }}
          children={(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-secondary-element">
                Amount
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                step="any"
                disabled={!active}
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
                  ≈ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} USD
                </p>
              )}
            </div>
          )}
        />
        <button type="submit" disabled={!active} className={`w-full px-3 py-2 bg-key-element text-background rounded-md border border-secondary-element/20 focus:outline-none focus:ring-2 focus:ring-key-element/20 transition-colors duration-300 cursor-pointer ${active ? "hover:bg-emphasized-element hover:text-key-element" : ""}`}>
          Donate
        </button>
      </form>
  );
}