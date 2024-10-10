/**
 * File Path: @/app/members/code/[slug]/generateStaticParams.ts
 * 
 * Static Params Generation
 * ------------------------
 * This module defines the `generateStaticParams` function, which is responsible for generating
 * the dynamic route parameters based on lesson slugs. It fetches data from the `LessonContent`
 * model in AWS Amplify to dynamically build the slugs for each lesson.
 */

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

// Generate the Amplify client using the defined schema
const client = generateClient<Schema>();

/**
 * generateStaticParams
 * --------------------
 * Asynchronously generates the parameters for dynamic routes based on lesson slugs. This is used to
 * statically generate dynamic pages in a Next.js application, allowing for the pre-rendering of
 * pages corresponding to each lesson.
 * 
 * @async
 * @function
 * @returns {Promise<Array<{ slug: string }>>} A promise that resolves to an array of objects,
 * each containing a `slug` property corresponding to the lesson slug.
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  // Fetch all lesson entries from the LessonContent model
  const { data: lessons } = await client.models.LessonContent.list();

  // Map through the lessons and return an array of objects with the slug for each lesson
  return (lessons || []).map((item) => ({ slug: item.slug }));
}
