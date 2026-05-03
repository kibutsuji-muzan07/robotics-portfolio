import { useState } from "react";
import { Router, Switch, Route } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { AddTrackModal } from "@/components/AddTrackModal";
import { Toaster } from "@/components/ui/toaster";
import { useProgress } from "@/hooks/useProgress";
import { getCustomTracks, saveCustomTracks } from "@/hooks/useProgress";
import Overview from "@/pages/Overview";
import TrackDetail from "@/pages/TrackDetail";
import ActivityLog from "@/pages/ActivityLog";
import type { Track } from "./types";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

function AppInner() {
  const { data, isLoading, error } = useProgress();
  const [customTracks, setCustomTracks] = useState<Track[]>(getCustomTracks);
  const [addModalOpen, setAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        Loading progress...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen text-destructive text-sm">
        Failed to load progress.json. Make sure the file exists at <code className="mx-1 font-mono">public/data/progress.json</code>.
      </div>
    );
  }

  const allTracks: Track[] = [...data.tracks, ...customTracks];

  const handleAddTrack = (track: Track) => {
    const updated = [...customTracks, track];
    setCustomTracks(updated);
    saveCustomTracks(updated);
  };

  return (
    <Router hook={useHashLocation}>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar
          tracks={allTracks}
          studentName={data.student.name}
          onAddTrack={() => setAddModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto min-w-0">
          <Switch>
            <Route path="/" component={() => <Overview data={data} allTracks={allTracks} />} />
            <Route path="/track/:id">
              {(params) => {
                const track = allTracks.find((t) => t.id === params.id);
                if (!track) return <div className="p-6 text-muted-foreground text-sm">Track not found.</div>;
                return <TrackDetail track={track} />;
              }}
            </Route>
            <Route path="/activity" component={() => <ActivityLog entries={data.activity} />} />
            <Route component={() => <div className="p-6 text-muted-foreground text-sm">Page not found.</div>} />
          </Switch>
        </main>

        <AddTrackModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddTrack}
        />
        <Toaster />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
