import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "~/components/ui/sonner";
import Navbar from "~/components/navigations/navbar";
import { cn } from "~/lib/utils";
import SolanaProvider from "~/components/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Donor Link",
  description: "Decentralized fundraising platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        "flex flex-col antialiased mx-[2%]",
        "bg-background"
      )}>
        <SolanaProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <Toaster />
        </SolanaProvider>
      </body>
    </html>
  );
}