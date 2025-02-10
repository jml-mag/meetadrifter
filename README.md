# [Meet A Drifter](https://www.meetadrifter.com)


**Meet A Drifter** is a tutorial-oriented web application showcasing a modern, full-stack approach with **Next.js** (using the App Router) and **AWS Amplify Gen 2**. It demonstrates how to integrate authentication, data models, serverless functions, and more—providing an open book of code for learning and reuse.

## What the Site Is

- A **tutorial**/demo site, designed to help developers see a real-world codebase in action.
- Includes features such as user authentication (AWS Cognito), polls, lesson content, contact forms, and basic admin functionality.
- Organized to be as transparent as possible, allowing you to follow along and understand each piece of the stack.

## What It Does

1. **User Management**  
   - Email-based sign-up and login via AWS Cognito.
   - Group-based authorization, so certain pages or admin features are locked to users in the "admin" group.

2. **Data & Content**  
   - Stores and manages polls, votes, and lesson content using AWS Amplify’s data layer and AppSync.
   - Real-time updates for polls and voting, ensuring data consistency.

3. **Admin Features**  
   - Admins can manage users, control poll statuses (activate/inactivate), and post site-wide notifications.
   - Lesson content can be created, edited, and reordered via a drag-and-drop interface.

4. **Frontend Experiences**  
   - A dynamic “lesson” system for step-by-step or tutorial-like content, with code blocks and markdown.
   - An animated home page, plus interactive UI elements built with **Framer Motion** and **Tailwind CSS**.

## Basics of How It Is Built

1. **Next.js (App Router)**  
   - Handles routing, layouts, and static/dynamic rendering in a React environment.
   - Provides a file-based approach for pages (e.g., `app/page.tsx`, `app/members/page.tsx`, etc.).

2. **AWS Amplify Gen 2**  
   - Combines AWS CDK with Amplify’s developer experience.  
   - The `amplify/` directory defines backend resources (Cognito, AppSync, functions, SES email identity) using “infrastructure-as-code.”
   - Includes authentication, data models (using Amplify’s schema definitions), and serverless functions for user management and custom operations.

3. **Authentication & Authorization**  
   - AWS Cognito for email-based signup/login and group-based roles.
   - Admin checks in the front-end (`isAdmin`) plus function-level group enforcement in the backend.

4. **Data Models**  
   - Declarative schemas (`amplify/data/resource.ts`) define models like `Poll`, `Vote`, and `LessonContent`.
   - Real-time sync with AppSync subscriptions is used for live updates (e.g., poll votes).

5. **Deployed & Serverless**  
   - The site can be deployed via Amplify Hosting, with CI/CD integrated or by hooking up a Git repo.
   - Serverless functions in the `amplify/functions/` directory handle special logic (e.g., user management in Cognito).

---

**Enjoy exploring the code and learning how a Next.js + Amplify Gen 2 project is structured from end to end!**
