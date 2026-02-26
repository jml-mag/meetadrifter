
---

## 📘 `meetadrifter/README.md`

```markdown
# Meet A Drifter
**https://www.meetadrifter.com**

A full-stack, tutorial-oriented web application designed to demonstrate how a modern Next.js + AWS Amplify Gen 2 system is built **in practice**, using a real deployed product instead of isolated examples.

Meet A Drifter is intentionally an “open book” codebase: users join the site in order to learn how to build the very site they are using.

---

## Why This Exists

Many tutorials show fragments of systems in isolation — auth here, data there, UI somewhere else.  
Meet A Drifter was built to answer a different question:

> *What does a complete, real-world full-stack application actually look like when everything is wired together?*

This project demonstrates:
- authentication
- authorization
- real-time data
- admin tooling
- serverless backends
- UI state management

…all inside a single, deployed application.

---

## What the Application Does

### 1. User Authentication & Roles
- Email-based signup/login via AWS Cognito
- Group-based authorization (admin vs member)
- Frontend and backend enforcement

### 2. Lesson & Tutorial System
- Lessons stored as structured content (markdown + optional code)
- Dynamic lesson routing
- Split-pane layouts for documentation and code
- Drag-and-drop lesson ordering in admin UI

### 3. Polling & Real-Time Data
- Admin-created polls
- Authenticated users vote
- Live updates via AppSync subscriptions

### 4. Admin Dashboard
- User management
- Poll creation and activation
- Site-wide notifications
- Content management

### 5. Frontend Experience
- Animated landing page
- Interactive components
- Clean, modular UI architecture

---

## Architectural Highlights

### App Router–First Design
The application is built entirely using Next.js App Router conventions, with clear separation between public, authenticated, and admin routes.

### Code-First Infrastructure
AWS Amplify Gen 2 is used to define backend resources directly in TypeScript:
- authentication
- data models
- serverless functions
- email configuration

This keeps infrastructure versioned alongside application code.

### Real-Time Data via GraphQL
Polls and votes update live using AppSync subscriptions, demonstrating how real-time features fit cleanly into a modern React app.

### Clear Separation of Concerns
- `app/` — routing and page composition
- `components/` — reusable UI pieces
- `contexts/` — auth and UI state
- `amplify/` — backend definitions
- `utils/` — shared helpers

---

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Markdown rendering with syntax highlighting

### Backend
- AWS Amplify Gen 2
- AppSync GraphQL
- Cognito authentication
- Lambda functions for custom logic
- SES for transactional email

---

## What This Project Demonstrates

- Building and deploying a real full-stack application
- Authentication and authorization done correctly
- Admin tooling as a first-class concern
- Real-time data flows
- Clean frontend architecture
- Teaching by example through a transparent codebase

---

## Deployment

The application is deployed using AWS Amplify Hosting with CI/CD integration from Git. Backend resources are provisioned via Amplify’s code-first infrastructure definitions.

---

## License

MIT