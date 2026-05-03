import { CheckCircle2, Clock, Circle, Star } from "lucide-react";

interface DayCardProps {
  dayNumber: number;
  theme: string;
  status: string;
  track: "A" | "B";
  quizScore?: number | null;
  quizMaxScore?: number | null;
  completedDate?: string | null;
  githubFiles?: string | null;
  notes?: string | null;
  isCurrent?: boolean;
}

const statusIcon = {
  completed: <CheckCircle2 size={14} className="text-green-400 shrink-0" />,
  in_progress: <Clock size={14} className="text-yellow-400 shrink-0 animate-pulse" />,
  pending: <Circle size={14} className="text-muted-foreground shrink-0" />,
};

const statusLabel = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
};

export function DayCard({ dayNumber, theme, status, track, quizScore, quizMaxScore, completedDate, githubFiles, isCurrent }: DayCardProps) {
  const files: string[] = githubFiles ? JSON.parse(githubFiles) : [];
  const accentClass = track === "A" ? "border-l-[hsl(186,78%,42%)]" : "border-l-[hsl(268,60%,58%)]";
  const currentRing = isCurrent ? "ring-1 ring-yellow-500/40" : "";
  const scorePercent = quizScore != null && quizMaxScore != null ? Math.round((quizScore / quizMaxScore) * 100) : null;

  return (
    <div
      data-testid={`day-card-${track.toLowerCase()}-${dayNumber}`}
      className={`bg-card border border-border rounded-xl p-4 border-l-2 ${accentClass} ${currentRing} transition-all`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {statusIcon[status as keyof typeof statusIcon] ?? statusIcon.pending}
          <span className="text-xs font-mono text-muted-foreground shrink-0">
            Day {dayNumber}
          </span>
          {isCurrent && (
            <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium shrink-0">
              <Star size={10} fill="currentColor" /> Current
            </span>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium status-${status}`}>
          {statusLabel[status as keyof typeof statusLabel] ?? status}
        </span>
      </div>

      <div className="text-sm font-medium text-foreground leading-snug mb-3">{theme}</div>

      {completedDate && (
        <div className="text-xs text-muted-foreground mb-2">Completed {completedDate}</div>
      )}

      {/* Quiz score bar */}
      {scorePercent != null && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Quiz</span>
            <span className={`font-mono font-semibold ${scorePercent >= 80 ? "text-green-400" : scorePercent >= 50 ? "text-yellow-400" : "text-red-400"}`}>
              {quizScore}/{quizMaxScore} · {scorePercent}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scorePercent >= 80 ? "bg-green-400" : scorePercent >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>
      )}

      {/* GitHub proof files */}
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map(f => (
            <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 size={11} className="text-green-400 shrink-0" />
              <span className="font-mono truncate">{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
