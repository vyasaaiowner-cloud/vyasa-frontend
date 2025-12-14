import { QueryClient } from '@tanstack/react-query';

// TODO: Switch to a getQueryClient() factory when we add SSR prefetch/hydration
// to prevent cross-user cache issues in server-side rendering
export const queryClient = new QueryClient();
