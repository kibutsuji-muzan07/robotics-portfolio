import { QueryClient } from "@tanstack/react-query";

// This is a purely static app — no backend API calls.
// Data is loaded from public/data/progress.json via useProgress hook.
// This queryClient is kept for compatibility with shadcn ui hooks.

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Compatibility stub — not used in static mode
export async function apiRequest(method: string, url: string, data?: unknown): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });
  return res;
}
