// @/components/Pitch.tsx

// Pitch.tsx
// ----------
// This component serves as an introduction to the Meet a Drifter project,
// showcasing the transparency of the codebase and key technical features.

// use client

import React from "react";
import { FeaturesList } from "@/components/FeaturesList";
import Image from "next/image";
import codeImage from "@/public/code-screenshot.jpg";
import adminCodeImage from "@/public/admin-poll-screenshot.png";
import { tiltWarp } from "@/app/fonts"; // Import custom fonts

/**
 * Renders the main pitch section, introducing the Meet a Drifter project.
 *
 * @component
 * @returns {JSX.Element} A section displaying introductory content and project features.
 */
const Pitch: React.FC = (): JSX.Element => {
  return (
    <main className="w-full text-white rounded-lg">
      {/* Introduction with a blurred background */}
      <section className="mt-14 backdrop-blur-lg bg-blue-950 bg-opacity-50 rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-full px-4 py-12">
          <p
            className={`text-3xl xl:text-4xl font-extralight leading-tight text-center max-w-3xl`}
          >
            Meet a Drifter is an open book project for web developers who want
            to see real-world code in action.
          </p>
        </div>
      </section>

      {/* Image section showcasing project code */}
      <section className="bg-black bg-opacity-70 pb-4 m-2 rounded-2xl shadow-inner">
        <div className="my-4 mx-2 lg:max-w-7xl lg:mx-auto">
          <Image
            src={codeImage}
            alt="Screenshot of members/code page."
            className="rounded-lg"
          />
        </div>
      </section>
      {/* Image section showcasing project code */}
      <section className="bg-black bg-opacity-70 pb-4 m-2 rounded-2xl shadow-inner">
        <div className="my-4 mx-2 lg:max-w-7xl lg:mx-auto">
          <Image
            src={adminCodeImage}
            alt="Screenshot of members/admin/polls page."
            className="rounded-lg"
          />
        </div>
      </section>
      {/* Closing text with custom fonts */}
      <section
        className={`${tiltWarp.className} m-auto w-11/12 mt-8 mb-8 text-sm md:text-base lg:text-2xl text-center p-12 leading-relaxed`}
      >
        All in, this project is
        <span className="text-base md:text-lg lg:text-4xl text-sky-300">
          {" "}
          45 files{" "}
        </span>
        on top of the default Next.js and Amplify Gen 2 installations designed
        to provide insights for web developers and hopefully help someone
        <span className="text-sky-300"> ship something great</span>.
      </section>
      {/* Features list showcasing technical highlights */}
      <section className="relative md:flex justify-around mt-8 mb-8">
        <div>
          <FeaturesList />
        </div>
      </section>
    </main>
  );
};

export default Pitch;
