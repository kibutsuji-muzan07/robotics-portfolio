import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BrainCircuit, GitBranch, ExternalLink } from "lucide-react";
import { DayCard } from "@/components/DayCard";
import type { TrackBDay, ProgressSummary } from "@shared/schema";

const PHASES = [
  { id: 1, name: "DL + Classic ML for NLP", desc: "scikit-learn · PyTorch · Text classification" },
  { id: 2, name: "Generative NLP & LLMs", desc: "Transformers · HuggingFace · Fine-tuning · LoRA" },
  { id: 3, name: "RAG Systems", desc: "Embeddings · Vector stores · UAV doc assistant" },
  { id: 4, name: "Deployment & MLOps", desc: "Docker · Kubernetes · AWS · MLflow" },
];

export default function TrackBPage() {
  const { data: days = [], isLoading } = useQuery<TrackBDay[]>({
    queryKey: ["/api/track-b"],
    queryFn: () => apiRequest("GET", "/api/track-b").then(r => r.json()),
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

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit size={20} style={{ color: "hsl(268 60% 58%)" }} />
            <h1 className="text-xl font-semibold text-foreground">Track B · AI/ML &amp; GenAI/RAG</h1>
          </div>
          <p className="text-sm text-muted-foreground">Python · PyTorch · HuggingFace · RAG · Docker · MLOps</p>
        </div>
        <a
          href="https://github.com/kibutsuji-muzan07/robotics-portfolio/tree/shadow_clone/ai_ml"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="github-link-track-b"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <GitBranch size={13} />
          ai_ml/
          <ExternalLink size={11} />
        </a>
      </div>

      {/* Summary row */}
      <div className="flex gap-6 mb-8 p-4 bg-card border border-border rounded-xl border-l-2 border-l-[hsl(268,60%,58%)]">
        <div>
          <div className="text-xs text-muted-foreground">Completed</div>
          <div className="text-2xl font-bold font-mono" style={{ color: "hsl(268 60% 58%)" }}>{completed.length}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Phase 1 Days</div>
          <div className="text-2xl font-bold font-mono text-foreground">{days.filter(d => d.phase === 1).length}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Current B-Day</div>
          <div className="text-2xl font-bold font-mono text-foreground">{summary?.currentTrackBDay ?? "—"}</div>
        </div>
      </div>

      {/* Phase roadmap */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {PHASES.map(p => {
          const pDays = days.filter(d => d.phase === p.id);
          const pCompleted = pDays.filter(d => d.status === "completed").length;
          const isActive = p.id === 1;
          return (
            <div key={p.id} className={`rounded-xl border p-3 ${isActive ? "border-[hsl(268,60%,58%,0.4)] bg-[hsl(268,60%,58%,0.06)]" : "border-border bg-card opacity-50"}`}>
              <div className="text-xs font-semibold text-foreground mb-1">Phase {p.id}</div>
              <div className="text-xs text-muted-foreground mb-2 leading-tight">{p.name}</div>
              {isActive && pDays.length > 0 && (
                <div className="text-xs font-mono text-muted-foreground">{pCompleted}/{pDays.length} days</div>
              )}
              {!isActive && (
                <div className="text-xs text-muted-foreground">Locked</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase 1 days */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground px-2">Phase 1 · DL + Classic ML for NLP</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {days.filter(d => d.phase === 1).map(d => (
            <DayCard
              key={d.id}
              dayNumber={d.dayNumber}
              theme={d.theme}
              status={d.status}
              track="B"
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
    </div>
  );
}
