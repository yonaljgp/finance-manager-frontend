# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Workflow

### Commands

**Build and Run:**
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run preview` - Preview production build

**Code Quality:**
- `npm run lint` - Run ESLint across codebase
- `npx react-doctor@latest` - Diagnostic tool for React issues

**Testing:**
- No test commands currently configured (no test files found in project)

### Development Setup

This is a React + TypeScript project using:
- **Framework**: React with Vite
- **UI Library**: Mantine components (v9.4.1)
- **Routing**: React Router with lazy loading and protected routes
- **Forms**: React Hook Form + Zod validation
- **State Management**: Custom hooks with localStorage persistence
- **HTTP Client**: Axios with auth interceptor for token refresh
- **Styling**: Tailwind CSS via @tailwindcss/vite

## Code Architecture

### Main Entry Point
`src/main.tsx` - Strict mode app setup with Mantine provider and dayjs locale configuration

### Routing System  
`src/routes/index.tsx` - Centralized route configuration with:
- Lazy-loaded components for performance
- Protected routes ( ProtectedRoutes / AuthRoutes ) 
- FullPageLoader fallback for auth bootstrapping
- Email verification state management via RequireState utility

### Authentication
`src/hooks/useAuth.ts` - Sophisticated auth system with:
- Token refresh on app mount
- Session expiration handling
- Email verification flow (registration, password reset)
- Persistent user state in localStorage
- Global access token management with interceptor

### Data Layer
`src/services/httpClient.ts` - API abstraction with:
- Configured axios instance (baseURL from VITE_BASE_URL)
- AuthApi wrapper for auth endpoints
- Global error handling through apiErrorMapper
- Request/response interception for auth tokens

### Component Structure
Feature-split organization:
- **Pages**: home, transactions, history, loans, notFound
- **Components**: layout (navbar, footer), dashboard, feature-specific components
- **Utils**: RequireState for state-dependent routing
- **Hooks**: useAuth for auth state management

### State Management
Custom hooks pattern with:
- useAuth for authentication state
- localStorage persistence
- Token refresh mechanism
- Global error handling and loading states

### Configuration
- ESLint with TypeScript support (eslint.config.js)
- Vite with React plugin and Tailwind CSS (vite.config.ts)
- TypeScript with separate tsconfig.app.json and tsconfig.node.json
- Mantine theme configuration in theme/mantineTheme.ts

## Key Architecture Decisions

1. **Lazy Loading**: All route components and major components are lazy-loaded for performance
2. **Protected Routes**: Authentication state is checked at route level, not component level
3. **Token Refresh**: Automatic token refresh on app startup to maintain session
4. **Email Verification**: Multi-step verification with state persistence across routes
5. **Type Safety**: Full TypeScript coverage with proper error mapping

## Important Patterns

- **Auth Flow**: Login → Validate Email → Verify Email → Protected Content
- **Password Recovery**: Send Email → Verify Code → New Password
- **Error Handling**: Centralized error mapping with user-friendly messages
- **Loading States**: Consistent loading/error handling across auth operations
- **State Persistence**: User data and auth state survive page refreshes

## Future Development Considerations

- Add testing strategy (currently no tests configured)
- Consider implementation of proper error boundaries
- Auth state could be extracted to context provider for broader use
- API layer could benefit from more specific error types
- Component library could be expanded with shared UI patterns