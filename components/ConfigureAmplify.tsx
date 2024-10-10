"use client";

/**
 * File Path: @/components/ConfigureAmplifyClientSide.tsx
 *
 * ConfigureAmplifyClientSide Component
 * -------------------------------------
 * This component is responsible for configuring AWS Amplify on the client side with the SSR (Server-Side Rendering) option enabled.
 * It imports Amplify configuration from a pre-defined JSON file (`amplify_outputs.json`) and applies the configuration globally.
 * 
 * Note: This component does not render any UI elements, it only handles configuration logic.
 */

import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

// Configure Amplify with server-side rendering (SSR) enabled
Amplify.configure(outputs, { ssr: true });

/**
 * ConfigureAmplifyClientSide Component
 * ------------------------------------
 * A functional component that configures AWS Amplify for client-side usage.
 * It returns `null` as it does not render any visual output.
 *
 * @returns {null} - The component does not return any visible UI.
 */
export default function ConfigureAmplifyClientSide(): null {
  return null;
}
