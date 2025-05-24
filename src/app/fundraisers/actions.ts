"use server";

import { type formSchema } from "~/components/create-fundraiser-form-copy";
import { type z } from "zod";

export async function createFundraiser(formData: z.infer<typeof formSchema>) {
  console.log(formData);
}