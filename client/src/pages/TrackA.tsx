import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bot, GitBranch, ExternalLink } from "lucide-react";
import { DayCard } from "@/components/DayCard";
import type { TrackADay, ProgressSummary } from "@shared/schema";

export default function TrackAPage() {
  const { data: days = [], isLoading } = useQuery<TrackADay[]>({
    queryKey: ["/api/track-a"],
    queryFn: () => apiRequest("GET", "/api/track-a").then(r => r.json()),
  });
  const { data: summary } = useQuery<ProgressSummary>({
    queryKey: ["/api/summary"],
    queryFn: () => apiRequest("GET", "/api/summary").then(r => r.json()),
  });

  if (isLoading) {
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-36 rounded-xl" />)}
      </div>
    );
  }

  const completed = days.filter(d => d.status === "completed");
  const current = days.find(d => d.status === "in_progress") ?? days.find(d => d.status === "pending");
  const phases = Array.from(new Set(days.map(d => d.phase))).sort();

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot size={20} style={{ color: "hsl(186 78% 42%)" }} />
            <h1 className="text-xl font-semibold text-foreground">Track A · Robotics / ROS 2</h1>
          </div>
          <p className="text-sm text-muted-foreground">ROS 2 Jazzy · UAV Software · Control Theory · Modern Robotics textbook</p>
        </div>
        <a
          href="https://github.com/kibutsuji-muzan07/robotics-portfolio/tree/shadow_clone"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="github-link-track-a"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <GitBranch size={13} />
          shadow_clone
          <ExternalLink size={11} />
        </a>
      </div>

      {/* Summary row */}
      <div className="flex gap-6 mb-8 p-4 bg-card border border-border rounded-xl border-l-2 border-l-[hsl(186,78%,42%)]">
        <div>
          <div className="text-xs text-muted-foreground">Completed</div>
          <div className="text-2xl font-bold font-mono" style={{ color: "hsl(186 78% 42%)" }}>{completed.length}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Total Days</div>
          <div className="text-2xl font-bold font-mono text-foreground">{days.length}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Current Day</div>
          <div className="text-2xl font-bold font-mono text-foreground">{summary?.currentTrackADay ?? "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Quiz Avg</div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {completed.filter(d => d.quizScore != null).length > 0
              ? Math.round(completed.filter(d => d.quizScore != null).reduce((s, d) => s + (d.quizScore! / d.quizMaxScore!) * 100, 0) / completed.filter(d => d.quizScore != null).length) + "%"
              : "—"}
          </div>
        </div>
      </div>

      {/* Days by phase */}
      {phases.map(phase => {
        const phaseDays = days.filter(d => d.phase === phase);
        return (
          <div key={phase} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground px-2">Phase {phase} · Week 1</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phaseDays.map(d => (
                <DayCard
                  key={d.id}
                  dayNumber={d.dayNumber}
                  theme={d.theme}
                  status={d.status}
                  track="A"
                  quizScore={d.quizScore}
                  quizMaxScore={d.quizMaxScore}
                  completedDate={d.completedDate}
                  githubFiles={d.githubFiles}
                  notes={d.notes}
                  isCurrent={current?.dayNumber === d.dayNumber}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
