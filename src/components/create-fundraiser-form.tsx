"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Calendar, FileImage, Info, Loader2, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Calendar as CalendarComponent } from "~/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { ScrollArea } from "~/components/ui/scroll-area"
import { cn } from "~/lib/utils"
import { format } from "date-fns"

// Category types
type FundraiserCategory =
  | "Education"
  | "Health & Medical"
  | "Environment"
  | "Community Projects"
  | "Arts & Creative"
  | "Technology & Open Source"
  | "Emergency Relief"
  | "Others"

// Available categories for selection
const categories: FundraiserCategory[] = [
  "Education",
  "Health & Medical",
  "Environment",
  "Community Projects",
  "Arts & Creative",
  "Technology & Open Source",
  "Emergency Relief",
  "Others",
]

// Media item type
interface MediaItem {
  id: string
  file: File
  type: "image" | "video"
  previewUrl: string
}

export function CreateFundraiserForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [category, setCategory] = useState<FundraiserCategory | "">("")
  const [description, setDescription] = useState("")
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [goalAmount, setGoalAmount] = useState("")
  const [stablecoin, setStablecoin] = useState("USDC")
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState(false)

  // Mock connected wallet address
  const connectedWallet = "0x1234567890abcdef1234567890abcdef12345678"

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addMediaFiles(Array.from(e.target.files))
    }
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addMediaFiles(Array.from(e.dataTransfer.files))
    }
  }

  // Add media files to state
  const addMediaFiles = (files: File[]) => {
    const newMediaItems: MediaItem[] = []

    files.forEach((file) => {
      // Check if file is an image or video
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")

      if (isImage || isVideo) {
        const previewUrl = URL.createObjectURL(file)
        newMediaItems.push({
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          type: isImage ? "image" : "video",
          previewUrl,
        })
      }
    })

    setMediaItems((prev) => [...prev, ...newMediaItems])
  }

  // Remove media item
  const removeMediaItem = (id: string) => {
    setMediaItems((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      return updated
    })
  }

  // Truncate wallet address
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!category) {
      newErrors.category = "Category is required"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
      newErrors.goalAmount = "Valid funding goal is required"
    }

    if (!endDate) {
      newErrors.endDate = "End date is required"
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (endDate < today) {
        newErrors.endDate = "End date must be in the future"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to fundraiser page (in a real app, would redirect to the newly created fundraiser)
      router.push("/browse-fundraisers")
    } catch (error) {
      console.error("Error creating fundraiser:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-3.5rem)]">
      <div className="container max-w-3xl py-8 md:py-12">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create a New Fundraiser</h1>
          <p className="text-muted-foreground">Share your vision and start raising funds for your project on Solana.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Campaign Basics */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <h2 className="text-xl font-medium">Campaign Basics</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-1">
                  Fundraiser Title <span className="text-purple-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Help Build a Community Library"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(errors.title && "border-red-500")}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary" className="flex items-center gap-1">
                  Short Summary/Tagline
                  <span className="text-xs text-muted-foreground ml-1">(Recommended)</span>
                </Label>
                <Input
                  id="summary"
                  placeholder="e.g., Bringing books and learning to our neighborhood"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-1">
                  Category <span className="text-purple-500">*</span>
                </Label>
                <Select value={category} onValueChange={(value) => setCategory(value as FundraiserCategory)}>
                  <SelectTrigger id="category" className={cn(errors.category && "border-red-500")}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
            </div>
          </div>

          {/* Story & Media */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <h2 className="text-xl font-medium">Story & Media</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-1">
                  Full Description <span className="text-purple-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell your story... Why is this important? How will the funds be used?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={cn("min-h-[200px]", errors.description && "border-red-500")}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Campaign Media
                  <span className="text-xs text-muted-foreground ml-1">(Recommended)</span>
                </Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 transition-colors",
                    dragActive ? "border-purple-500 bg-purple-500/5" : "border-border",
                    "relative",
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center text-center">
                    <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">Drag and drop files here or click to browse</p>
                    <p className="text-xs text-muted-foreground mb-4">Supports images and videos (max 10MB each)</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Browse Files
                    </Button>
                  </div>
                </div>

                {mediaItems.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Uploaded Media ({mediaItems.length})</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {mediaItems.map((item) => (
                        <div key={item.id} className="relative group">
                          <div className="aspect-video rounded-md overflow-hidden bg-muted/30">
                            {item.type === "image" ? (
                              <img
                                src={item.previewUrl || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video src={item.previewUrl} className="w-full h-full object-cover" controls={false} />
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeMediaItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                            {item.type === "image" ? "Image" : "Video"}
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        className="aspect-video flex flex-col items-center justify-center border-dashed"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus className="h-5 w-5 mb-1" />
                        <span className="text-xs">Add More</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Funding Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <h2 className="text-xl font-medium">Funding Details</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goalAmount" className="flex items-center gap-1">
                  Funding Goal (USD) <span className="text-purple-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="goalAmount"
                    type="number"
                    placeholder="e.g., 5000"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    className={cn("pl-8", errors.goalAmount && "border-red-500")}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-muted-foreground">$</span>
                  </div>
                </div>
                {errors.goalAmount && <p className="text-sm text-red-500">{errors.goalAmount}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Receiving Stablecoin <span className="text-purple-500">*</span>
                </Label>
                <RadioGroup value={stablecoin} onValueChange={setStablecoin} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="USDC" id="usdc" />
                    <Label htmlFor="usdc" className="cursor-pointer">
                      USDC (Solana)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="USDT" id="usdt" />
                    <Label htmlFor="usdt" className="cursor-pointer">
                      USDT (Solana)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-1">
                  Campaign End Date <span className="text-purple-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                        errors.endDate && "border-red-500",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Wallet Information */}
          <div className="rounded-lg border border-border/50 bg-muted/10 p-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Funds will be sent to: <span className="font-medium">{truncateAddress(connectedWallet)}</span> (Your
                connected wallet)
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Fundraiser...
                </>
              ) : (
                "Launch Campaign"
              )}
            </Button>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Save as Draft
            </Button>
          </div>
        </form>
      </div>
    </ScrollArea>
  )
}
