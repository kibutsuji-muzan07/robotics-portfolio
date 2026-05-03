import { CheckCircle2, Send, PenLine, AlertCircle } from "lucide-react";
import type { ActivityEntry } from "../types";

const ACTION_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  day_completed: { label: "Day Completed", color: "hsl(142 71% 45%)", icon: CheckCircle2 },
  briefing_sent: { label: "Briefing Sent", color: "hsl(215 80% 58%)", icon: Send },
  task_completed: { label: "Task Done", color: "hsl(38 95% 55%)", icon: PenLine },
  quiz_submitted: { label: "Quiz Submitted", color: "hsl(268 60% 58%)", icon: PenLine },
  default: { label: "Event", color: "hsl(var(--muted-foreground))", icon: AlertCircle },
};

const TRACK_COLORS: Record<string, string> = {
  A: "hsl(186 78% 42%)",
  B: "hsl(268 60% 58%)",
};

interface ActivityLogProps {
  entries: ActivityEntry[];
}

export default function ActivityLog({ entries }: ActivityLogProps) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold text-foreground mb-1">Activity Log</h1>
      <p className="text-sm text-muted-foreground mb-6">All verified events across both tracks</p>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No activity recorded yet.</div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4 pl-10">
            {sorted.map((entry, i) => {
              const cfg = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG.default;
              const Icon = cfg.icon;
              const trackColor = TRACK_COLORS[entry.track] ?? "hsl(var(--muted-foreground))";

              return (
                <div key={i} className="relative" data-testid={`activity-${i}`}>
                  {/* Dot */}
                  <div
                    className="absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center"
                    style={{ background: cfg.color }}
                  >
                    <Icon size={8} color="white" />
                  </div>

                  <div className="bg-card border border-border rounded-lg p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full border"
                          style={{ color: trackColor, borderColor: `${trackColor}44`, background: `${trackColor}11` }}
                        >
                          Track {entry.track}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">Day {entry.day}</span>
                        <span className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 font-mono">{entry.date}</span>
                    </div>
                    {entry.detail && (
                      <p className="text-xs text-muted-foreground mt-1.5">{entry.detail}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
