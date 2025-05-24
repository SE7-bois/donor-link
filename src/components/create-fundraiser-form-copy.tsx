"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categories } from "~/data/fundraisers";
import { useState, useRef, useEffect } from "react";
import { FileImage, Plus, Trash2, Upload, CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { createFundraiser, type CreateFundraiserResponse } from "~/app/fundraisers/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import Image from "next/image";

// Media item type
interface MediaItem {
  id: string;
  file: File;
  type: "image" | "video";
  previewUrl: string;
}

// Form input schema (what the form fields expect)
const formInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
  category: z.enum(categories as [string, ...string[]], { message: "Category is required" }),
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
});

// Final output schema (what we get after transformation)
export const formSchema = formInputSchema.extend({
  goalAmount: formInputSchema.shape.goalAmount
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, { message: "Goal amount must be greater than 0" }),
});

type FormInputSchema = z.infer<typeof formInputSchema>;
type FormSchema = z.infer<typeof formSchema>;

export function CreateFundraiserForm() {
  const form = useForm<FormInputSchema>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      title: "",
      summary: "",
      description: "",
      media: [],
      goalAmount: "",
      stablecoin: "USDT",
    },
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  // --- Drag and Drop Handlers & File Processing --- START ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addMediaFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addMediaFiles(Array.from(e.target.files));
    }
  };

  const addMediaFiles = (newFiles: File[]) => {
    const newLocalMediaItems: MediaItem[] = [];
    const currentFormFiles = form.getValues("media") || [];
    const updatedFormFiles = [...currentFormFiles];

    newFiles.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (isImage || isVideo) {
        if (!mediaItems.some(item => item.file.name === file.name && item.file.size === file.size) && 
            !updatedFormFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
          
          const previewUrl = URL.createObjectURL(file);
          newLocalMediaItems.push({
            id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            file,
            type: isImage ? "image" : "video",
            previewUrl,
          });
          updatedFormFiles.push(file);
        }
      }
    });

    if (newLocalMediaItems.length > 0) {
      setMediaItems((prev) => [...prev, ...newLocalMediaItems]);
      form.setValue("media", updatedFormFiles, { shouldValidate: true, shouldDirty: true });
    }
  };

  const removeMediaItem = (idToRemove: string) => {
    const itemToRemove = mediaItems.find(item => item.id === idToRemove);
    if (!itemToRemove) return;

    setMediaItems((prev) => prev.filter((item) => item.id !== idToRemove));

    // Remove from react-hook-form state
    const currentFiles = form.getValues("media") || [];
    const updatedFiles = currentFiles.filter(
      (file) => !(file.name === itemToRemove.file.name && file.size === itemToRemove.file.size)
    );
    form.setValue("media", updatedFiles, { shouldValidate: true, shouldDirty: true });

    URL.revokeObjectURL(itemToRemove.previewUrl);
  };
  // --- Drag and Drop Handlers & File Processing --- END ---
  
  const onFormSubmit = async (data: FormInputSchema) => {
    try {
      setIsSubmitting(true);
      
      // Transform the data using the full schema with transforms
      const transformedData = formSchema.parse(data);

      const formData = new FormData();
      Object.keys(transformedData).forEach(keyStr => {
        const key = keyStr as keyof FormSchema;
        if (key === "media") {
          if (transformedData.media && transformedData.media.length > 0) {
            transformedData.media.forEach(file => formData.append("media", file));
          }
        } else if (transformedData[key] instanceof Date) {
          formData.append(key, (transformedData[key] as Date).toISOString());
        } else if (transformedData[key] !== undefined && transformedData[key] !== null) {
          formData.append(key, String(transformedData[key]));
        }
      });

      // Call the server action with the form data
      const response: CreateFundraiserResponse = await createFundraiser(formData);

      if (response.success) {
        toast.success(response.message, {
          description: "Your fundraiser has been created successfully."
        });

        // Redirect to the fundraiser page if we have an ID
        if (response.fundraiserId) {
          router.push(`/fundraisers/${response.fundraiserId}`);
        } else {
          router.push("/fundraisers");
        }
      } else {
        // Handle validation errors from the server
        if (response.errors) {
          // Set errors in the form
          Object.keys(response.errors).forEach(field => {
            const errorMessage = response.errors?.[field]?.[0] ?? "Invalid field";
            form.setError(field as keyof FormInputSchema, { 
              type: "server", 
              message: errorMessage
            });
          });
        }

        toast.error("Error creating fundraiser", {
          description: response.message
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      mediaItems.forEach(item => URL.revokeObjectURL(item.previewUrl));
    };
  }, [mediaItems]);

  // Handle number input with regex validation
  const handleNumberInput = (value: string, onChange: (value: string) => void) => {
    // Allow empty string for clearing the field
    if (value === "") {
      onChange("");
      return;
    }
    
    // Only allow numbers and one decimal point
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      onChange(value);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((formData) => {
        // Create a new object that combines form data with media from UI state
        // This ensures we always use all the files from the UI state
        const mediaFiles = mediaItems.map(item => item.file);
        const combinedData = {
          ...formData,
          media: mediaFiles.length > 0 ? mediaFiles : formData.media
        };
        
        // Call our submit handler with the combined data
        void onFormSubmit(combinedData);
      })} className="space-y-8">
        <h2 className="text-2xl font-bold">Campaign Basics</h2>
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel>Fundraiser Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Help Build a Community Library" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is the title that will be displayed to the public.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({field}) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="e.g., We are raising funds to build a community library in our neighborhood."
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                A summary of your campaign.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({field}) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
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
              <FormMessage />
              <FormDescription>
                Select the category that best describes your campaign.
              </FormDescription>
            </FormItem>
          )}
        />
        <h2 className="text-2xl font-bold">Story & Media</h2>
        <FormField 
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  placeholder="e.g., We are raising funds to build a community library in our neighborhood."
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                A detailed description of your campaign.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField 
          control={form.control}
          name="media"
          render={() => (
            <FormItem>
              <FormLabel>Campaign Media</FormLabel>
              <FormControl>
                <div>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 transition-colors text-center",
                      dragActive ? "border-purple-500 bg-purple-500/5" : "border-border",
                      "relative cursor-pointer"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <FileImage className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-sm font-medium mb-1">Drag and drop files here or click to browse</p>
                    <p className="text-xs text-muted-foreground mb-4">Supports images and videos</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => { 
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center gap-1 mx-auto"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Browse Files
                    </Button>
                  </div>

                  {mediaItems.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium">Uploaded Media ({mediaItems.length})</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mediaItems.map((item) => (
                          <div key={item.id} className="relative group aspect-video">
                            <div className="rounded-md overflow-hidden bg-muted/30 w-full h-full">
                              {item.type === "image" ? (
                                <Image
                                  src={item.previewUrl}
                                  alt={`Preview of ${item.file.name}`}
                                  className="w-full h-full object-cover"
                                  width={100}
                                  height={100}
                                />
                              ) : (
                                <video src={item.previewUrl} className="w-full h-full object-cover" controls={false} />
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              onClick={() => removeMediaItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded">
                              {item.type === "image" ? "Image" : "Video"}
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          className="aspect-video flex flex-col items-center justify-center border-dashed h-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus className="h-5 w-5 mb-1" />
                          <span className="text-xs">Add More</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>
                Upload images and videos to help tell your story.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField control={form.control} name="goalAmount" render={({field}) => (
          <FormItem>
            <FormLabel>Goal Amount</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                placeholder="e.g., 10000 or 10000.50" 
                {...field} 
                onChange={e => handleNumberInput(e.target.value, field.onChange)}
              />
            </FormControl>
            <FormMessage />
            <FormDescription>
              Enter the amount you want to raise in USD.
            </FormDescription>
          </FormItem>
        )} />
        <FormField control={form.control} name="stablecoin" render={({field}) => <FormItem><FormLabel>Stablecoin</FormLabel><Select defaultValue={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder="Select stablecoin" /></SelectTrigger><SelectContent><SelectItem value="USDC">USDC</SelectItem><SelectItem value="USDT">USDT</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
        <FormField control={form.control} name="endDate" render={({field}) => (
          <FormItem className="flex flex-col">
            <FormLabel>Campaign End Date</FormLabel>
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
                      <span>Pick an end date</span>
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
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              Choose when your fundraising campaign should end.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        
        <div className="flex space-x-4">
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Launch Campaign"
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => console.log('Save as Draft clicked. Form data:', form.getValues())}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
        </div>
      </form>
    </Form>
  )
}