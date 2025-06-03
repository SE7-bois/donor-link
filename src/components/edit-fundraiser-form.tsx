"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categories, type FundraiserCategory } from "~/data/fundraisers";
import { useState, useRef } from "react";
import { FileImage, Plus, Trash2, Upload, CalendarIcon, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Id } from "../../convex/_generated/dataModel";

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectValue } from "~/components/ui/select";
import { SelectTrigger } from "~/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";

// Media item type
interface MediaItem {
  id: string;
  file?: File;
  type: "image" | "video";
  previewUrl: string;
  url?: string; // For existing media
  alt: string;
  thumbnail?: string;
}

// Form input schema (what the form fields expect)
const formInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
  category: z.enum(categories as [FundraiserCategory, ...FundraiserCategory[]], { message: "Category is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  media: z.array(z.instanceof(File))
    .refine(files => files.every(file =>
      file.type.startsWith("image/") || file.type.startsWith("video/")),
      { message: "Only image and video files are allowed" }),
  goalAmount: z.string()
    .min(1, { message: "Goal amount is required" })
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Please enter a valid amount (e.g., 1000 or 1000.50)" }),
  stablecoin: z.enum(["USDC", "USDT"], { message: "Stablecoin is required" }),
  endDate: z.date({ message: "End date is required" }),
  isActive: z.boolean(),
});

// Final output schema (what we get after transformation)
export const formSchema = formInputSchema.extend({
  goalAmount: formInputSchema.shape.goalAmount
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, { message: "Goal amount must be greater than 0" }),
});

type FormInputSchema = z.infer<typeof formInputSchema>;

export function EditFundraiserForm() {
  const router = useRouter();
  const params = useParams();
  const fundraiserId = params.id as Id<"fundraisers">;
  const { data: session } = useSession();
  const { publicKey } = useWallet();

  // Convex mutations
  const updateFundraiserMutation = useMutation(api.fundraisers.updateFundraiser);
  const generateUploadUrl = useMutation(api.fundraisers.generateUploadUrl);
  const storeFileMetadata = useMutation(api.fundraisers.storeFileMetadata);

  // Fetch existing fundraiser data
  const fundraiser = useQuery(
    api.fundraisers.getFundraiser,
    fundraiserId ? { fundraiser_id: fundraiserId } : "skip"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is owner
  const userWalletAddress = publicKey?.toBase58();
  const isOwner = userWalletAddress && fundraiser && userWalletAddress === fundraiser.owner_wallet_address;

  // Form setup
  const form = useForm<FormInputSchema>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      title: "",
      summary: "",
      category: "Education",
      description: "",
      media: [],
      goalAmount: "",
      stablecoin: "USDC",
      endDate: new Date(),
      isActive: true,
    },
  });

  // Load existing data into form when fundraiser is fetched (inline logic, no useEffect)
  if (fundraiser && !dataLoaded) {
    form.reset({
      title: fundraiser.title,
      summary: fundraiser.tagline || "",
      category: fundraiser.category[0] || "Education",
      description: fundraiser.description,
      media: [],
      goalAmount: fundraiser.target_amount.toString(),
      stablecoin: "USDC",
      endDate: fundraiser.end_date ? new Date(fundraiser.end_date) : new Date(),
      isActive: fundraiser.is_active,
    });

    // Set existing media
    if (fundraiser.media) {
      setMediaItems(
        fundraiser.media.map((media) => ({
          id: media.id,
          type: media.type,
          previewUrl: media.url,
          url: media.url,
          alt: media.alt,
          thumbnail: media.thumbnail,
        }))
      );
    }
    setDataLoaded(true);
  }

  // Authorization check
  if (!session || !publicKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please connect your wallet to edit this fundraiser.</p>
          <Button asChild>
            <Link href={`/fundraisers/${fundraiserId}`}>Back to Fundraiser</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (fundraiser === undefined) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fundraiser...</p>
        </div>
      </div>
    );
  }

  if (fundraiser === null || !isOwner) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You are not authorized to edit this fundraiser.</p>
          <Button asChild>
            <Link href={`/fundraisers/${fundraiserId}`}>Back to Fundraiser</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Media handling functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newMediaItems: MediaItem[] = [];

    files.forEach((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const mediaItem: MediaItem = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          type: file.type.startsWith("image/") ? "image" : "video",
          previewUrl: URL.createObjectURL(file),
          alt: file.name,
        };
        newMediaItems.push(mediaItem);
      }
    });

    setMediaItems((prev) => [...prev, ...newMediaItems]);

    // Update react-hook-form state
    const currentFiles = form.getValues("media") || [];
    const newFiles = newMediaItems.map((item) => item.file!);
    form.setValue("media", [...currentFiles, ...newFiles], { shouldValidate: true, shouldDirty: true });

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMediaItem = (idToRemove: string) => {
    const itemToRemove = mediaItems.find(item => item.id === idToRemove);
    if (!itemToRemove) return;

    setMediaItems((prev) => prev.filter((item) => item.id !== idToRemove));

    // Remove from react-hook-form state if it's a new file
    if (itemToRemove.file) {
      const currentFiles = form.getValues("media") || [];
      const updatedFiles = currentFiles.filter(
        (file) => !(file.name === itemToRemove.file!.name && file.size === itemToRemove.file!.size)
      );
      form.setValue("media", updatedFiles, { shouldValidate: true, shouldDirty: true });
    }

    // Manual cleanup for object URLs (no useEffect needed)
    if (itemToRemove.previewUrl && !itemToRemove.url) {
      URL.revokeObjectURL(itemToRemove.previewUrl);
    }
  };

  const onFormSubmit = async (data: FormInputSchema) => {
    try {
      setIsSubmitting(true);

      // Transform the data using the full schema with transforms
      const transformedData = formSchema.parse(data);

      // Step 1: Upload any new media files to Convex storage
      const uploadedMedia = [];

      // Keep existing media that wasn't removed
      const existingMedia = mediaItems.filter(item => !item.file && item.url);
      uploadedMedia.push(...existingMedia.map(item => ({
        id: item.id,
        type: item.type,
        url: item.url!,
        alt: item.alt,
        thumbnail: item.thumbnail,
      })));

      // Upload new media files
      const newMediaFiles = mediaItems.filter(item => item.file);
      for (const mediaItem of newMediaFiles) {
        try {
          // Generate upload URL
          const uploadUrl = await generateUploadUrl();

          // Upload file to Convex storage
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": mediaItem.file!.type },
            body: mediaItem.file!,
          });

          if (!result.ok) {
            throw new Error(`Upload failed: ${result.statusText}`);
          }

          const { storageId } = await result.json();

          // Store file metadata
          const uploadedMediaItem = await storeFileMetadata({
            storageId,
            type: mediaItem.type,
            alt: mediaItem.alt,
          });

          uploadedMedia.push(uploadedMediaItem);
        } catch (uploadError) {
          toast.error("File upload failed", {
            description: `Failed to upload ${mediaItem.file!.name}`
          });
          return;
        }
      }

      // Step 2: Update fundraiser in database
      await updateFundraiserMutation({
        fundraiser_id: fundraiserId,
        wallet_address: userWalletAddress!,
        title: transformedData.title,
        description: transformedData.description,
        tagline: transformedData.summary,
        category: [transformedData.category as FundraiserCategory],
        target_amount: transformedData.goalAmount,
        end_date: transformedData.endDate.getTime(),
        is_active: transformedData.isActive,
        media: uploadedMedia,
      });

      toast.success("Fundraiser updated successfully!", {
        description: "Your changes have been saved."
      });

      // Redirect back to the fundraiser page
      router.push(`/fundraisers/${fundraiserId}`);

    } catch (error) {
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground hover:text-foreground">
          <Link href={`/fundraisers/${fundraiserId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Fundraiser
          </Link>
        </Button>
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg border border-border/50 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Edit Fundraiser</h2>
          <p className="text-muted-foreground">Update your fundraiser details below.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fundraiser Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your fundraiser title" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, compelling title that explains what you're fundraising for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your fundraiser..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief summary that will appear in listings and the header (plain text only).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best fits your fundraiser.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center justify-between">
                      <span>Full Description</span>
                      <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                        Supports Markdown
                      </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell people more about your fundraiser. You can use Markdown formatting..."
                      className="resize-none min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about your fundraiser. You can use Markdown for formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Media Upload */}
            <FormField
              control={form.control}
              name="media"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Gallery</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Upload Button */}
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Media
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Upload images or videos (max 10MB each)
                        </span>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {/* Media Preview Grid */}
                      {mediaItems.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {mediaItems.map((item) => (
                            <div key={item.id} className="relative group aspect-video rounded-lg overflow-hidden bg-muted/30">
                              {item.type === "image" ? (
                                <img
                                  src={item.previewUrl}
                                  alt={item.alt}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="relative w-full h-full bg-muted flex items-center justify-center">
                                  <FileImage className="h-8 w-8 text-muted-foreground" />
                                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                                    Video
                                  </span>
                                </div>
                              )}
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMediaItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload images and videos to showcase your fundraiser.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goal Amount and Stablecoin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="goalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fundraising Goal (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Target amount you want to raise.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stablecoin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Stablecoin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Stablecoin for receiving donations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* End Date and Active Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When this fundraiser should end.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Whether this fundraiser is active and accepting donations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Fundraiser"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/fundraisers/${fundraiserId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 