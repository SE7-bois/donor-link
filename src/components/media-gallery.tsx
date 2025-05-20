"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

export interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  alt?: string
}

interface MediaGalleryProps {
  media: MediaItem[]
  className?: string
}

export function MediaGallery({ media, className }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenContainerRef = useRef<HTMLDivElement>(null)

  const activeMedia = media[activeIndex]

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return

      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape") {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen])

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
    }
  }, [activeIndex, activeMedia])

  return (
    <>
      <div className={cn("relative rounded-lg overflow-hidden", className)}>
        {/* Main Media Display */}
        <div className="relative aspect-video bg-muted/30 overflow-hidden">
          {activeMedia.type === "image" ? (
            <div className="relative w-full h-full">
              <Image
                src={activeMedia.url || "/placeholder.svg"}
                alt={activeMedia.alt || "Fundraiser media"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority={activeIndex === 0}
              />
            </div>
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={activeMedia.url}
                className="w-full h-full object-cover"
                controls
                controlsList="nodownload"
                poster={activeMedia.thumbnail}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {!isPlaying && activeMedia.thumbnail && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                  onClick={togglePlay}
                >
                  <div className="rounded-full bg-black/50 p-4 backdrop-blur-sm">
                    <Play className="h-8 w-8 text-white" fill="white" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Arrows (only show if more than one media item) */}
          {media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </Button>
            </>
          )}

          {/* Fullscreen Button */}
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

        {/* Thumbnails */}
        {media.length > 1 && (
          <div className="flex mt-2 gap-2 overflow-x-auto pb-1 scrollbar-thin">
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
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          ref={fullscreenContainerRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
        >
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
            {activeMedia.type === "image" ? (
              <div className="relative w-full h-full">
                <Image
                  src={activeMedia.url || "/placeholder.svg"}
                  alt={activeMedia.alt || "Fundraiser media"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                src={activeMedia.url}
                className="w-full h-full object-contain"
                controls
                controlsList="nodownload"
                poster={activeMedia.thumbnail}
                autoPlay
              />
            )}
          </div>

          {media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next</span>
              </Button>
            </>
          )}

          {/* Thumbnails in fullscreen mode */}
          {media.length > 1 && (
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
          )}
        </div>
      )}
    </>
  )
}
