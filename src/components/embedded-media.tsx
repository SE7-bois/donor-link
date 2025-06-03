"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Maximize2, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import type { MediaItem } from "./media-gallery"

interface EmbeddedMediaProps {
  media: MediaItem[]
  className?: string
}

export function EmbeddedMedia({ media, className }: EmbeddedMediaProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Handle undefined or empty media array
  if (!media || media.length === 0) {
    return (
      <div className={cn("relative rounded-md overflow-hidden my-4 flex items-center justify-center aspect-video bg-muted/30", className)}>
        <span className="text-muted-foreground text-center">No media available</span>
      </div>
    )
  }

  // Defensive: If activeIndex is out of bounds, reset to 0
  const activeMedia = media[activeIndex] ?? media[0]

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // For a single image, render it directly
  if (media.length === 1 && media[0]?.type === "image") {
    return (
      <div className={cn("relative rounded-md overflow-hidden my-4", className)}>
        <div className="relative aspect-video">
          <Image
            src={media[0]?.url || "/placeholder.svg"}
            alt={media[0]?.alt || "Update media"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">View fullscreen</span>
          </Button>
        </div>
      </div>
    )
  }

  // For a single video, render it directly
  if (media.length === 1 && media[0]?.type === "video") {
    return (
      <div className={cn("relative rounded-md overflow-hidden my-4", className)}>
        <div className="relative aspect-video">
          <video
            src={media[0]?.url}
            className="w-full h-full object-cover"
            controls
            controlsList="nodownload"
            poster={media[0]?.thumbnail}
          />
        </div>
      </div>
    )
  }

  // For multiple media items, render a grid
  return (
    <div className={cn("my-4", className)}>
      <div className="grid grid-cols-2 gap-2">
        {media.slice(0, 4).map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "relative rounded-md overflow-hidden cursor-pointer",
              media.length === 3 && index === 0 ? "col-span-2" : "",
              media.length > 4 && index === 3 ? "relative" : "",
            )}
            onClick={() => {
              setActiveIndex(index)
              toggleFullscreen()
            }}
          >
            <div className="relative aspect-video">
              {item.type === "image" ? (
                <Image
                  src={item.url || "/placeholder.svg"}
                  alt={item.alt || `Media ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
              ) : (
                <>
                  <Image
                    src={item.thumbnail || item.url}
                    alt={item.alt || `Media ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-8 w-8 text-white" fill="white" />
                  </div>
                </>
              )}

              {media.length > 4 && index === 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-white font-medium text-lg">+{media.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10 z-10"
            onClick={toggleFullscreen}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close fullscreen</span>
          </Button>

          <div className="relative w-full max-w-6xl max-h-[90vh] aspect-video">
            {activeMedia?.type === "image" ? (
              <div className="relative w-full h-full">
                <Image
                  src={activeMedia?.url || "/placeholder.svg"}
                  alt={activeMedia?.alt || "Update media"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>
            ) : (
              <video
                src={activeMedia?.url}
                className="w-full h-full object-contain"
                controls
                controlsList="nodownload"
                poster={activeMedia?.thumbnail}
                autoPlay
              />
            )}
          </div>

          {/* Thumbnails in fullscreen mode */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto pb-1 max-w-[90%]">
            {media.map((item, index) => (
              <button
                key={item.id}
                className={cn(
                  "relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                  activeIndex === index ? "border-purple-500" : "border-transparent hover:border-purple-500/50",
                )}
                onClick={() => setActiveIndex(index)}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt={item.alt || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={item.thumbnail || item.url}
                      alt={item.alt || `Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-4 w-4 text-white" fill="white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
