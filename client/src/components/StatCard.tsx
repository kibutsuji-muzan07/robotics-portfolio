import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: "teal" | "purple" | "green" | "yellow";
  testId?: string;
}

const accentMap = {
  teal: "text-[hsl(186,78%,42%)]",
  purple: "text-[hsl(268,60%,58%)]",
  green: "text-[hsl(142,71%,45%)]",
  yellow: "text-[hsl(38,95%,58%)]",
};

const bgMap = {
  teal: "bg-[hsl(186,78%,42%,0.1)] border-[hsl(186,78%,42%,0.25)]",
  purple: "bg-[hsl(268,60%,58%,0.1)] border-[hsl(268,60%,58%,0.25)]",
  green: "bg-[hsl(142,71%,45%,0.1)] border-[hsl(142,71%,45%,0.25)]",
  yellow: "bg-[hsl(38,95%,58%,0.1)] border-[hsl(38,95%,58%,0.25)]",
};

export function StatCard({ label, value, sub, icon: Icon, accent = "teal", testId }: StatCardProps) {
  return (
    <div
      data-testid={testId ?? `stat-${label.toLowerCase().replace(/\s/g, "-")}`}
      className="bg-card border border-border rounded-xl p-4 flex items-start gap-4"
    >
      <div className={`rounded-lg border p-2 ${bgMap[accent]}`}>
        <Icon size={18} className={accentMap[accent]} />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className="text-xl font-semibold text-foreground font-mono tabular-nums count-animate">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
