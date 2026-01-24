# Copilot Instructions for Kanaka Analysis

## Project Overview
This is a modern React + TypeScript web application using Vite, Tailwind CSS, and Supabase for backend integration. The codebase is organized for modularity and scalability, with clear separation of UI, layout, integrations, hooks, and context.

## Architecture & Key Patterns
- **Entry Point**: The app starts at `src/main.tsx` and uses `src/App.tsx` as the root component.
- **Routing & Navigation**: Custom navigation logic is implemented in `src/components/NavLink.tsx` and `src/components/ProtectedRoute.tsx`.
- **UI Components**: Reusable UI primitives are in `src/components/ui/`. Follow the pattern of stateless, prop-driven components.
- **Layout**: Shared layout elements are in `src/components/layout/`.
- **Landing Page**: Marketing sections are in `src/components/landing/`.
- **Pages**: Route-level components are in `src/pages/`.
- **State Management**: Use React Context for global state (see `src/contexts/AuthContext.tsx`).
- **Hooks**: Custom hooks are in `src/hooks/` and should be used for device detection, toast notifications, etc.
- **Supabase Integration**: All backend calls and types are in `src/integrations/supabase/`.
- **Utilities**: Shared helpers are in `src/lib/utils.ts`.

## Developer Workflows
- **Install dependencies**: `npm i`
- **Start dev server**: `npm run dev`
- **Run tests**: `npm test` (uses Vitest, see `vitest.config.ts` and `src/test/`)
- **Build for production**: `npm run build`
- **Lint**: `npm run lint` (uses ESLint, config in `eslint.config.js`)
- **Format**: Use Prettier (if configured)

## Conventions & Patterns
- **TypeScript**: All source files use TypeScript. Prefer explicit types for props and state.
- **Tailwind CSS**: Use utility classes for styling. Config in `tailwind.config.ts`.
- **Component Structure**: Prefer function components. Co-locate styles with components when possible.
- **Testing**: Place tests in `src/test/`. Use Vitest for unit tests.
- **Environment Config**: Supabase config is in `supabase/config.toml`.
- **Migrations**: Database migrations are in `supabase/migrations/`.

## Integration Points
- **Supabase**: All backend communication should use the client in `src/integrations/supabase/client.ts`.
- **Auth**: Use `AuthContext` for authentication state and logic.

## Examples
- To add a new UI component, follow the structure in `src/components/ui/`.
- To add a new page, create a file in `src/pages/` and update routing in `src/App.tsx`.
- To add a new hook, place it in `src/hooks/` and document its usage.

## References
- [src/App.tsx](src/App.tsx)
- [src/main.tsx](src/main.tsx)
- [src/components/ui/](src/components/ui/)
- [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)
- [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts)
- [src/pages/](src/pages/)

---
For questions or unclear conventions, review the README or ask for clarification. Please provide feedback if any section is incomplete or unclear.