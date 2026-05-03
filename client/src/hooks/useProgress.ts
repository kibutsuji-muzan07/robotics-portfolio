import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProgressData, Track } from "../types";

// The progress data is imported at build time from the JSON file.
// When updated: replace public/data/progress.json AND client/src/data/progress.json, then rebuild.
// On GitHub Pages: push the updated JSON → GitHub Actions rebuilds automatically.
import defaultData from "../data/progress.json";

export function useProgress() {
  return useQuery<ProgressData>({
    queryKey: ["progress"],
    queryFn: async () => {
      // First try to fetch from the server (for local dev / any deployment with static files)
      try {
        const res = await fetch("./data/progress.json");
        if (res.ok) {
          const text = await res.text();
          if (text && text.trim().startsWith("{")) return JSON.parse(text);
        }
      } catch {
        // ignore fetch error, fall through to bundled data
      }
      // Fallback: use bundled data from build time
      return defaultData as unknown as ProgressData;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Custom tracks stored in memory (no localStorage — blocked in iframes)
let _customTracks: Track[] = [];

export function getCustomTracks(): Track[] {
  return _customTracks;
}

export function saveCustomTracks(tracks: Track[]) {
  _customTracks = tracks;
}
