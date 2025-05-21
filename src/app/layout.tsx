import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/app/globals.css";
import Navbar from "~/components/navbar";
import { cn } from "~/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Donor Link",
  description: "An open fundraising platform, powered by Solana.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        "flex flex-col antialiased mx-2",
        "bg-background"
      )}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}