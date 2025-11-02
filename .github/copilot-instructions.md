# AI Agent Instructions for MediSteps App

## Project Overview
MediSteps is a healthcare management application built with React, TypeScript, and Vite, using shadcn-ui components. The app manages patient records, staff information, appointments, and insurance schemes.

## Architecture & Key Components

### Frontend Architecture
- **UI Components**: Located in `src/components/ui/` using shadcn-ui with Radix UI primitives
- **Pages**: Main route components in `src/pages/`
- **API Integration**: 
  - Auto-generated TypeScript clients in `frontend/src/api/`
  - Base API configuration in `src/lib/apiClient.ts`
  - Authentication handling in `src/lib/authContext.ts`

### Key Data Flow Patterns
1. API calls use the centralized `apiClient` instance which:
   - Automatically handles auth token management
   - Manages 401/403 responses with auto-logout
   - Sets base URL from environment or defaults to localhost:8081

2. Authentication flow:
   ```typescript
   // Example from src/lib/authContext.ts
   export const getCurrentUser = (): Staff | null => {
     const token = getToken();
     if (!token) return null;
     return jwtDecode<Staff>(token);
   };
   ```

## Development Workflows

### Setting Up Dev Environment
```bash
npm install
npm run dev  # Starts Vite dev server
```

### API Client Generation
When the API spec changes (in `src/resources/swagger.yml`):
```bash
npm run generate:client       # Basic TypeScript client
npm run generate:react-query  # React Query optimized client
```

### Component Development Patterns
1. Use shadcn-ui components from `src/components/ui/` as building blocks
2. Follow TypeScript strict mode and proper type definitions
3. Use React Hook Form with Zod for form validation
4. Implement protected routes using `src/lib/privateRouter.tsx`

## Common Patterns & Conventions

### Form Handling
Use the established pattern with React Hook Form and Zod validation:
```typescript
// Example from staff-form.tsx
const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['DOCTOR', 'NURSE', 'ADMIN'])
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema)
});
```

### API Integration
Use the `useAuthorizedApi` hook for authenticated requests:
```typescript
// Example pattern from any component
const api = useAuthorizedApi();
const { data } = useQuery(['key'], () => api.someEndpoint());
```

### Error Handling
- Use the toast system from `src/hooks/use-toast.ts` for user notifications
- API errors are centrally handled by `apiClient` interceptors
- Form validation errors should use Zod schemas

## Key Reference Points
- Authentication flow: `src/lib/authContext.ts`
- API client setup: `src/lib/apiClient.ts`
- Form patterns: `src/components/staff/staff-form.tsx`
- Protected routing: `src/lib/privateRouter.tsx`

## Project Structure Conventions
- Domain-specific components go in `src/components/{domain}/`
- Shared UI components go in `src/components/ui/`
- Hooks go in `src/hooks/`
- Types and interfaces go in `src/model/`
- API utilities go in `src/lib/`