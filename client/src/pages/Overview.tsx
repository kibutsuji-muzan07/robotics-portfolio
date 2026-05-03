import { Flame, GitCommit, Clock, TrendingUp, BookOpen, ExternalLink } from "lucide-react";
import { Odometer } from "@/components/Odometer";
import { TrackCard } from "@/components/TrackCard";
import { useNavigate } from "@/hooks/useNavigate";
import type { ProgressData, Track } from "../types";

function StatCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string | number; sub: string;
  icon: React.ElementType; accent: "yellow" | "teal" | "purple" | "green";
}) {
  const accMap = {
    yellow: "text-yellow-400",
    teal: "text-teal-400",
    purple: "text-purple-400",
    green: "text-green-400",
  };
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className={accMap[accent]} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function CourseraCard({ courses }: { courses: ProgressData["coursera"] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={14} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold">Coursera Progress</h3>
      </div>
      <div className="space-y-4">
        {courses.map((c) => {
          const pct = Math.round((c.current_week / c.total_weeks) * 100);
          const color = c.track === "A" ? "hsl(186 78% 42%)" : "hsl(268 60% 58%)";
          return (
            <div key={c.name}>
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{c.provider}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">Week {c.current_week}/{c.total_weeks}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: "width 0.7s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface OverviewProps {
  data: ProgressData;
  allTracks: Track[];
}

export default function Overview({ data, allTracks }: OverviewProps) {
  const navigate = useNavigate();

  // Overall completion: total completed days / total target days across all tracks
  const totalCompleted = allTracks.reduce((s, t) => s + t.days_completed, 0);
  const totalTarget = allTracks.reduce((s, t) => s + t.total_days, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

  // Quiz average across all tracks
  const allQuizDays = allTracks.flatMap((t) =>
    t.days.filter((d) => d.quiz_score != null)
  );
  const avgQuiz = allQuizDays.length
    ? Math.round(allQuizDays.reduce((s, d) => s + (d.quiz_score! / d.quiz_max) * 100, 0) / allQuizDays.length)
    : 0;

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Goal: <span className="text-foreground">{data.student.target_role}</span>
          </p>
        </div>
        <a
          href={`https://github.com/${data.student.github}/${data.student.repo}/tree/${data.student.branch}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="link-github-repo"
        >
          <ExternalLink size={12} />
          GitHub Repo
        </a>
      </div>

      {/* Odometer + KPI row */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-shrink-0">
          <Odometer
            percentage={overallPct}
            label={`${totalCompleted} of ${totalTarget} days completed`}
            size={300}
          />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          <StatCard label="Streak" value={`${data.summary.streak}d`} sub="consecutive days" icon={Flame} accent="yellow" />
          <StatCard label="Quiz Average" value={`${avgQuiz}%`} sub={`${allQuizDays.length} quizzes scored`} icon={TrendingUp} accent="teal" />
          <StatCard label="Study Hours" value={data.summary.total_study_hours.toFixed(1)} sub="total logged" icon={Clock} accent="purple" />
          <StatCard label="GitHub Commits" value={data.summary.github_commits} sub="in learning repo" icon={GitCommit} accent="green" />
        </div>
      </div>

      {/* Track cards */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Learning Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onClick={() => navigate(`/track/${track.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Coursera */}
      <CourseraCard courses={data.coursera} />

      <p className="text-xs text-muted-foreground">Last updated: {data._last_updated}</p>
    </div>
  );
}
