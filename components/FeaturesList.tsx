// @/components/FeaturesList.tsx

import React from "react";

// FeaturesList.tsx
// -----------------
// Provides an overview of the core technical features in the Meet a Drifter project.
// This file defines the `FeaturesList` component to display a collection of feature entries.

const featuresData = [
  {
    title: "The Stack",
    summary: "React, Next.js 14, AWS Amplify Gen 2",
    more: "Meet a Drifter is built using React for its component-based architecture, Next.js 14 for routing and optimized performance with server-side capabilities, and AWS Amplify Gen 2 for seamless backend services like authentication, data management, CI/CD, and hosting.",
  },
  {
    title: "The Backend",
    summary: "AWS Amplify Gen 2 - Rebuilt on CDK",
    more: "The backend leverages AWS Amplify to seamlessly integrate authentication, data models, and email services. It provides a solid foundation for user management through AppSync-driven operations and Amplify Functions. This setup ensures scalable, real-time interaction between the frontend and backend while maintaining flexibility with custom queries, mutations, and email configurations via AWS SES when moving to production.",
  },
  {
    title: "Backend - Data",
    summary:
      "Customizable models and real-time synchronization with AppSync, ensuring users always access the latest polls, votes, and notifications, with flexible authorization for seamless content management.",
    more: "The data layer is built with customizable models for handling real-time interactions, such as polls, votes, and notifications. Each model has specific authorization rules, allowing only authenticated users or admins to access, modify, or manage content. AppSync enables real-time data synchronization, ensuring users always interact with the latest data, while flexible structures like nested links support complex content management.",
  },
  {
    title: "Backend - Authentication/Authorization",
    summary:
      "AWS Cognito with email-based login, role-based grouping, and Amplify Functions for advanced user management, ensuring secure workflows with custom verification, and group permissions.",
    more: "Authentication is powered by AWS Cognito with email-based login and verification, supporting secure user management. Users are grouped into roles (e.g., admin), and Amplify Functions offer powerful tools to list, add, or remove users from groups. Custom email verification, group-based permissions, and SES integration ensure secure and reliable authentication workflows for a production-ready environment.",
  },
  {
    title: "The Frontend",
    summary: "Next.js 14 and the App Router",
    more: "The frontend is built with Next.js 14, utilizing the App Router to enable dynamic routing, layouts, and file-based navigation. This structure promotes modular development with nested routes and reusable components. The setup embraces client-side rendering for fast interactions, with support for serverless API routes when needed. It takes full advantage of Next.js's optimized performance, handling static and dynamic content efficiently, while enabling modern web standards like image optimization and lazy loading. This architecture ensures seamless, production-ready web experiences with smooth navigation and minimal load times.",
  },
  {
    title: "Frontend - Routing and Protected Routes",
    summary:
      "Next.js 14’s App Router enables flexible routing with nested layouts, providing modular code management and dynamic content delivery.",
    more: "The App Router in Next.js 14 enhances frontend architecture by offering file-based routing with nested layouts, enabling developers to organize routes intuitively. Protected routes ensure secure access, limiting member and admin sections to authenticated users via AWS Cognito. Authentication checks are performed at the client level using the `useAuth` hook and dynamic redirects, ensuring seamless transitions between authenticated and public areas. Admin layouts further enforce access control by redirecting non-admin users. Amplify authentication and session management integrate smoothly with routing, creating a secure, scalable, and dynamic user experience across all sections of the application.",
  },
  {
    title: "Frontend - React",
    summary: "React State, Context, Hooks, and more",
    more: "The application leverages core React features to manage state and behavior efficiently across components. React Hooks, such as `useState` and `useEffect`, control UI logic and handle side effects like fetching data and managing animations. Contexts, like `AuthContext` and `ToastContext`, provide global state management, ensuring consistent access to authentication and notifications throughout the app. Components are designed with modularity and reusability in mind, while stateful logic dynamically drives UI elements, including member pages and admin dashboards. Animations powered by Framer Motion enhance the user experience by introducing smooth transitions, further improving the interface's responsiveness and interactivity.",
  },
  {
    title: "Lessons CMS",
    summary:
      "Comprehensive management of lesson content with ordering and dynamic rendering.",
    more: "The Lessons CMS allows admins to create, manage, and order lessons using AWS Amplify Gen 2. Lesson data, including titles, content, and relevant links, is stored within the `LessonContent` model. Admins can manage lessons through an intuitive interface with CRUD operations and set their display order using a `LessonOrder` drag and drop interface. Lessons are dynamically rendered for users, with lesson progress tracked locally and slugs pre-generated for SEO optimization. The integration ensures efficient content delivery with features like Next.js static generation and dynamic routing for seamless user navigation.",
  },
  {
    title: "And plenty more...",
    summary: "Every file running this site is available and explained.",
    more: "Every line of code running this site is available to you for study, modification, and  inspiration for your own projects.",
  },
];

/**
 * Renders an individual feature entry.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.title - The feature's title.
 * @param {string} props.summary - A brief summary of the feature.
 * @param {string} props.more - Detailed information about the feature.
 * @returns {JSX.Element} The rendered feature item.
 */
const FeaturesItem: React.FC<{
  title: string;
  summary: string;
  more: string;
}> = ({ title, summary, more }): JSX.Element => (
  <article
    className="flex-grow p-4 rounded-lg min-w-[250px] max-w-[400px] md:m-2 bg-gradient-to-br from-black to-black via-stone-800"
    aria-label={`Feature: ${title}`}
  >
    <h3 className="font-extralight text-lg text-white">{title}</h3>
    <p className="text-left ml-3 pt-3 text-white">{summary}</p>
    <p className="mt-4 text-sm mx-4 text-white">{more}</p>
  </article>
);

/**
 * Displays a list of feature entries based on the `featuresData`.
 *
 * @component
 * @returns {JSX.Element} The list of feature sections.
 */
export const FeaturesList: React.FC = (): JSX.Element => {
  return (
    <section
      className="backdrop-blur-lg bg-black bg-opacity-50 rounded-lg p-4"
      aria-labelledby="features-heading"
    >
      <h2
        id="features-heading"
        className="mb-4 text-left md:text-center text-2xl md:text-3xl text-white font-bold"
      >
        Featuring
      </h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {featuresData.map((item, index) => (
          <FeaturesItem
            key={index}
            title={item.title}
            summary={item.summary}
            more={item.more}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesList;
