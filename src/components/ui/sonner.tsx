"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      closeButton
      richColors
      expand={true}
      duration={4000}
      style={
        {
          "--normal-bg": "hsl(var(--card))",
          "--normal-border": "hsl(var(--border))",
          "--normal-text": "hsl(var(--card-foreground))",
          "--success-bg": "hsl(142 45% 25%)",
          "--success-border": "hsl(142 50% 30%)",
          "--success-text": "hsl(142 60% 85%)",
          "--error-bg": "hsl(0 62.8% 45%)",
          "--error-border": "hsl(0 62.8% 50%)",
          "--error-text": "hsl(0 0% 100%)",
          "--info-bg": "hsl(267 100% 65%)",
          "--info-border": "hsl(267 100% 70%)",
          "--info-text": "hsl(0 0% 100%)",
          "--warning-bg": "hsl(38 92% 50%)",
          "--warning-border": "hsl(38 92% 55%)",
          "--warning-text": "hsl(0 0% 100%)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          border: "1px solid",
          borderRadius: "0.75rem",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(8px)",
        },
        className: "animate-in slide-in-from-top-2 duration-300",
      }}
      {...props}
    />
  )
}

export { Toaster }
