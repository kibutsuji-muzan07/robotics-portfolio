import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Activity, CheckCircle2, Send, FileText, Star } from "lucide-react";
import type { ActivityLog } from "@shared/schema";

const actionIcon = {
  day_completed: <CheckCircle2 size={14} className="text-green-400" />,
  briefing_sent: <Send size={14} className="text-blue-400" />,
  task_completed: <Star size={14} className="text-yellow-400" />,
  quiz_submitted: <FileText size={14} className="text-purple-400" />,
};

const actionLabel = {
  day_completed: "Day completed",
  briefing_sent: "Briefing sent",
  task_completed: "Task verified",
  quiz_submitted: "Quiz submitted",
};

export default function ActivityPage() {
  const { data: logs = [], isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity"],
    queryFn: () => apiRequest("GET", "/api/activity").then(r => r.json()),
  });

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={20} className="text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Activity Log</h1>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      )}

      {!isLoading && logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Activity size={40} className="text-muted-foreground mb-4 opacity-30" />
          <div className="text-sm font-medium text-foreground mb-1">No activity yet</div>
          <div className="text-xs text-muted-foreground">Activity will appear here as you complete tasks and submit quizzes.</div>
        </div>
      )}

      <div className="space-y-2">
        {logs.map(log => (
          <div
            key={log.id}
            data-testid={`activity-${log.id}`}
            className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl"
          >
            <div className="mt-0.5">
              {actionIcon[log.action as keyof typeof actionIcon] ?? <Activity size={14} className="text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${log.track === "A" ? "bg-[hsl(186,78%,42%,0.15)] text-[hsl(186,78%,42%)]" : "bg-[hsl(268,60%,58%,0.15)] text-[hsl(268,60%,58%)]"}`}>
                  Track {log.track} · Day {log.dayNumber}
                </span>
                <span className="text-xs text-muted-foreground">
                  {actionLabel[log.action as keyof typeof actionLabel] ?? log.action}
                </span>
              </div>
              {log.detail && <div className="text-xs text-muted-foreground truncate">{log.detail}</div>}
            </div>
            <div className="text-xs text-muted-foreground font-mono shrink-0">{log.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
