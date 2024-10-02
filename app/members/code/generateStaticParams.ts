/**
 * File Path: @/app/members/code/[slug]/generateStaticParams.ts
 * 
 * Static Params Generation
 * ------------------------
 * Generates the parameters for the dynamic route pages based on lesson slugs.
 * Fetches data from the `LessonContent` model.
 */

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

// Generate the Amplify client
const client = generateClient<Schema>();

/**
 * generateStaticParams Function
 * -----------------------------
 * Generates the parameters for the dynamic route pages based on lesson slugs.
 * 
 * @returns {Promise<Array<{ slug: string }>>} An array of slug objects for dynamic route generation.
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  // Fetch all lesson entries
  const { data: lessons } = await client.models.LessonContent.list();

  // Generate slugs for pages
  return (lessons || []).map((item) => ({ slug: item.slug }));
}
