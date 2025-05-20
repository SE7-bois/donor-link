"use client"

import { useState, useEffect } from "react"
import { Copy, X, ChevronDown, ChevronUp, Search } from "lucide-react"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"

interface Supporter {
  id: string
  walletAddress: string
  amount: number
  timestamp: string | Date
  displayName?: string
}

interface SupportersModalProps {
  isOpen: boolean
  onClose: () => void
  fundraiserTitle: string
  supporters: Supporter[]
}

export function SupportersModal({ isOpen, onClose, fundraiserTitle, supporters }: SupportersModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Supporter
    direction: "ascending" | "descending"
  }>({
    key: "amount",
    direction: "descending",
  })
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Function to truncate wallet address
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Function to copy wallet address to clipboard
  const copyToClipboard = (address: string, id: string) => {
    navigator.clipboard.writeText(address)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Function to format date
  const formatDate = (timestamp: string | Date) => {
    if (typeof timestamp === "string" && timestamp.includes("ago")) {
      return timestamp
    }

    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Sort function
  const sortedSupporters = [...supporters]
    .filter(
      (supporter) =>
        supporter.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (supporter.displayName && supporter.displayName.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      const key = sortConfig.key

      if (key === "amount") {
        return sortConfig.direction === "ascending" ? a.amount - b.amount : b.amount - a.amount
      }

      if (key === "timestamp") {
        const dateA = new Date(a.timestamp)
        const dateB = new Date(b.timestamp)
        return sortConfig.direction === "ascending"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      }

      return 0
    })

  // Function to handle sort
  const requestSort = (key: keyof Supporter) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sort icon
  const getSortIcon = (key: keyof Supporter) => {
    if (sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className="bg-card border border-border/50 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-xl font-medium">Supporters of {fundraiserTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Search and Sort Controls */}
        <div className="p-4 border-b border-border/50 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by wallet address..."
              className="pl-9 bg-background border-border/50 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{sortedSupporters.length} supporters found</span>
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <button
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/30 transition-colors",
                  sortConfig.key === "amount" && "text-purple-500",
                )}
                onClick={() => requestSort("amount")}
              >
                Amount {getSortIcon("amount")}
              </button>
              <button
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/30 transition-colors",
                  sortConfig.key === "timestamp" && "text-purple-500",
                )}
                onClick={() => requestSort("timestamp")}
              >
                Date {getSortIcon("timestamp")}
              </button>
            </div>
          </div>
        </div>

        {/* Supporters List - Fixed height with ScrollArea */}
        <ScrollArea className="flex-1 overflow-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
          <div className="p-4">
            {sortedSupporters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No supporters found matching your search criteria.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Supporter
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {sortedSupporters.map((supporter) => (
                    <tr key={supporter.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-muted/50"></div>
                          <div>
                            {supporter.displayName && (
                              <div className="text-sm font-medium">{supporter.displayName}</div>
                            )}
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-muted-foreground">
                                {truncateAddress(supporter.walletAddress)}
                              </span>
                              <button
                                onClick={() => copyToClipboard(supporter.walletAddress, supporter.id)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span className="sr-only">Copy address</span>
                              </button>
                              {copiedId === supporter.id && <span className="text-xs text-purple-500">Copied!</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className="text-sm font-medium">{formatCurrency(supporter.amount * 100)}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className="text-sm text-muted-foreground">{formatDate(supporter.timestamp)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ScrollArea>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border/50 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
