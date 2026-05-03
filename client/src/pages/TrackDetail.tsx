import { CheckCircle2, Circle, Clock, Timer, FileCode2, Trophy, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Odometer } from "@/components/Odometer";
import type { Track, DayEntry } from "../types";

const STATUS_CONFIG = {
  completed: { label: "Completed", color: "hsl(142 71% 45%)", icon: CheckCircle2, bg: "hsl(142 71% 45% / 0.1)" },
  in_progress: { label: "In Progress", color: "hsl(38 95% 55%)", icon: Timer, bg: "hsl(38 95% 55% / 0.1)" },
  pending: { label: "Pending", color: "hsl(38 95% 55%)", icon: Timer, bg: "hsl(38 95% 55% / 0.1)" },
  not_started: { label: "Not Started", color: "hsl(var(--muted-foreground))", icon: Circle, bg: "transparent" },
};

const COLOR_MAP: Record<string, string> = {
  teal: "hsl(186 78% 42%)",
  purple: "hsl(268 60% 58%)",
  orange: "hsl(25 95% 55%)",
  blue: "hsl(215 80% 58%)",
  green: "hsl(142 71% 45%)",
  red: "hsl(0 72% 55%)",
};

function DayRow({ day, accent }: { day: DayEntry; accent: string }) {
  const cfg = STATUS_CONFIG[day.status] ?? STATUS_CONFIG.not_started;
  const Icon = cfg.icon;

  return (
    <div
      className="flex items-start gap-3 p-3.5 rounded-lg border border-border hover:border-border/60 transition-colors"
      style={{ background: day.status !== "not_started" ? cfg.bg : undefined }}
      data-testid={`day-row-${day.day}`}
    >
      <Icon size={16} style={{ color: cfg.color, marginTop: 1, flexShrink: 0 }} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-foreground">
            Day {day.day} <span className="font-normal text-muted-foreground">— {day.theme}</span>
          </p>
          {day.completed_date && (
            <span className="text-xs text-muted-foreground shrink-0">{day.completed_date}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-1.5">
          {day.quiz_score != null && (
            <span className="text-xs font-mono" style={{ color: day.quiz_score / day.quiz_max >= 0.8 ? "hsl(142 71% 45%)" : "hsl(38 95% 55%)" }}>
              Quiz {day.quiz_score}/{day.quiz_max} ({Math.round((day.quiz_score / day.quiz_max) * 100)}%)
            </span>
          )}
          {day.study_hours != null && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={10} /> {day.study_hours}h
            </span>
          )}
          {day.github_files.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileCode2 size={10} /> {day.github_files.length} file{day.github_files.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface TrackDetailProps {
  track: Track;
}

export default function TrackDetail({ track }: TrackDetailProps) {
  const [, setLocation] = useLocation();
  const accent = COLOR_MAP[track.color] ?? "hsl(186 78% 42%)";
  const pct = track.total_days > 0 ? Math.round((track.days_completed / track.total_days) * 100) : 0;

  const completed = track.days.filter((d) => d.status === "completed");
  const inProgress = track.days.filter((d) => d.status === "in_progress" || d.status === "pending");
  const notStarted = track.days.filter((d) => d.status === "not_started");

  const quizDays = track.days.filter((d) => d.quiz_score != null);
  const avgQuiz = quizDays.length
    ? Math.round(quizDays.reduce((s, d) => s + (d.quiz_score! / d.quiz_max) * 100, 0) / quizDays.length)
    : null;

  const totalHours = track.days.reduce((s, d) => s + (d.study_hours ?? 0), 0);

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Back */}
      <button
        onClick={() => setLocation("/")}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="button-back"
      >
        <ChevronLeft size={13} /> Back to Overview
      </button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full border" style={{ color: accent, borderColor: `${accent}44`, background: `${accent}11` }}>
              {track.label}
            </span>
            <span className="text-xs text-muted-foreground">{track.schedule}</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">{track.name}</h1>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
            <Trophy size={11} />
            {track.phase_name}
          </div>
        </div>

        <Odometer percentage={pct} label={`${track.days_completed}/${track.total_days} days`} size={200} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Days Done", value: track.days_completed },
          { label: "Total Target", value: track.total_days },
          { label: "Quiz Avg", value: avgQuiz != null ? `${avgQuiz}%` : "—" },
          { label: "Study Hours", value: totalHours > 0 ? `${totalHours.toFixed(1)}h` : "—" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-xl font-bold font-mono text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Days list */}
      <div className="space-y-5">
        {inProgress.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Active</h2>
            <div className="space-y-2">
              {inProgress.map((d) => <DayRow key={d.day} day={d} accent={accent} />)}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Completed ({completed.length})</h2>
            <div className="space-y-2">
              {completed.map((d) => <DayRow key={d.day} day={d} accent={accent} />)}
            </div>
          </div>
        )}

        {notStarted.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Upcoming ({notStarted.length} days remaining)
            </h2>
            <div className="space-y-2">
              {notStarted.slice(0, 10).map((d) => <DayRow key={d.day} day={d} accent={accent} />)}
              {notStarted.length > 10 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  + {notStarted.length - 10} more days in the plan
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
