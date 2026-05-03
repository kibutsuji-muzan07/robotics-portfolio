import { Bot, BrainCircuit, Code2, Rocket, BookOpen, Trophy, Star, Cpu } from "lucide-react";
import type { Track } from "../types";

const ICONS: Record<string, React.ElementType> = {
  Bot, BrainCircuit, Code2, Rocket, BookOpen, Trophy, Star, Cpu,
};

const COLOR_MAP: Record<string, { accent: string; bg: string; text: string }> = {
  teal: { accent: "hsl(186 78% 42%)", bg: "hsl(186 78% 42% / 0.08)", text: "hsl(186 78% 42%)" },
  purple: { accent: "hsl(268 60% 58%)", bg: "hsl(268 60% 58% / 0.08)", text: "hsl(268 60% 58%)" },
  orange: { accent: "hsl(25 95% 55%)", bg: "hsl(25 95% 55% / 0.08)", text: "hsl(25 95% 55%)" },
  blue: { accent: "hsl(215 80% 58%)", bg: "hsl(215 80% 58% / 0.08)", text: "hsl(215 80% 58%)" },
  green: { accent: "hsl(142 71% 45%)", bg: "hsl(142 71% 45% / 0.08)", text: "hsl(142 71% 45%)" },
  red: { accent: "hsl(0 72% 55%)", bg: "hsl(0 72% 55% / 0.08)", text: "hsl(0 72% 55%)" },
};

interface TrackCardProps {
  track: Track;
  onClick?: () => void;
}

function QuizBar({ score, max, label }: { score: number; max: number; label: string }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{score}/{max} · {pct}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: pct >= 80 ? "hsl(142 71% 45%)" : pct >= 50 ? "hsl(38 95% 58%)" : "hsl(0 72% 55%)",
            transition: "width 0.7s ease",
          }}
        />
      </div>
    </div>
  );
}

export function TrackCard({ track, onClick }: TrackCardProps) {
  const colors = COLOR_MAP[track.color] ?? COLOR_MAP.blue;
  const Icon = ICONS[track.icon] ?? Code2;
  const pct = track.total_days > 0 ? Math.round((track.days_completed / track.total_days) * 100) : 0;
  const quizDays = track.days.filter((d) => d.quiz_score != null);
  const currentDay = track.days.find((d) => d.status === "in_progress" || d.status === "pending");

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-border/80 transition-colors"
      style={{ borderLeft: `3px solid ${colors.accent}` }}
      onClick={onClick}
      data-testid={`track-card-${track.id}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} style={{ color: colors.accent }} />
        <h3 className="text-sm font-semibold text-foreground">
          {track.label} · {track.name}
        </h3>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold font-mono text-foreground">{track.days_completed}</span>
        <span className="text-muted-foreground text-sm">/ {track.total_days} days</span>
        <span className="ml-auto text-xs font-mono" style={{ color: colors.accent }}>{pct}%</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: colors.accent, transition: "width 0.7s ease" }}
        />
      </div>

      {currentDay && (
        <div className="text-xs text-muted-foreground mb-2">
          Active: <span className="text-foreground font-medium">Day {currentDay.day} — {currentDay.theme}</span>
        </div>
      )}

      {quizDays.length > 0 && (
        <div className="space-y-1.5 mt-3">
          {quizDays.map((d) => (
            <QuizBar
              key={d.day}
              score={d.quiz_score!}
              max={d.quiz_max}
              label={`${track.label} Day ${d.day} quiz`}
            />
          ))}
        </div>
      )}

      <div className="mt-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
        style={{ background: colors.bg, borderColor: `${colors.accent}33`, color: colors.text }}>
        <Trophy size={10} />
        {track.phase_name}
      </div>
    </div>
  );
}
