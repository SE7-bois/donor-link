"use server";

import { z } from "zod";
import { categories } from "~/data/fundraisers";
import { revalidatePath } from "next/cache";

// Server-side validation schema (should match client schema)
const serverFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
  category: z.enum(categories as [string, ...string[]], { message: "Category is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  goalAmount: z.coerce.number().positive({ message: "Goal amount must be greater than 0" }),
  stablecoin: z.enum(["USDC", "USDT"], { message: "Stablecoin is required" }),
  endDate: z.string().refine(
    (date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed > new Date();
    },
    { message: "End date must be in the future" }
  ),
});

type ServerFormInput = z.infer<typeof serverFormSchema>;

export type CreateFundraiserResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  fundraiserId?: string;
};

/**
 * Server action to create a new fundraiser
 */
export async function createFundraiser(formData: FormData): Promise<CreateFundraiserResponse> {
  try {
    // Extract form data
    const rawFormData: Record<string, string | string[]> = {};

    // Process regular form fields
    for (const [key, value] of formData.entries()) {
      // Skip if it's a file (we'll handle those separately)
      if (!(value instanceof File)) {
        const stringValue = value.toString();
        // Handle fields that might have multiple values
        if (rawFormData[key]) {
          const existingValue = rawFormData[key];
          if (Array.isArray(existingValue)) {
            existingValue.push(stringValue);
          } else {
            rawFormData[key] = [existingValue, stringValue];
          }
        } else {
          rawFormData[key] = stringValue;
        }
      }
    }

    // Validate the form data
    const validatedData = serverFormSchema.parse(rawFormData);

    // Process media files
    const mediaFiles: File[] = [];
    for (const file of formData.getAll("media") as File[]) {
      if (file instanceof File) {
        // Validate file type and size here if needed
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          mediaFiles.push(file);
        }
      }
    }

    // TODO: Process and store media files
    // This would involve:
    // 1. Uploading files to storage (e.g., S3, Cloudinary, etc.)
    // 2. Getting back URLs or IDs for the uploaded files

    // TODO: Store fundraiser data in database
    console.log("Creating fundraiser with data:", validatedData);
    console.log("Media files:", mediaFiles.map(f => ({ name: f.name, type: f.type, size: f.size })));

    // Simulate fundraiser creation with a delay of 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock fundraiser ID (in production this would come from your database)
    const fundraiserId = `${Math.floor(Math.random() * 100) % 24}`;

    // Revalidate the fundraisers page to show the new fundraiser
    revalidatePath("/fundraisers");

    return {
      success: true,
      message: "Fundraiser created successfully!",
      fundraiserId
    };
  } catch (error) {
    console.error("Error creating fundraiser:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      for (const issue of error.errors) {
        const path = issue.path.join(".");
        errors[path] ??= [];
        errors[path].push(issue.message);
      }

      return {
        success: false,
        message: "Validation failed",
        errors
      };
    }

    // Handle other errors
    return {
      success: false,
      message: "Failed to create fundraiser. Please try again."
    };
  }
}