import { Link, useLocation } from "wouter";
import { LayoutDashboard, Activity, Bot, BrainCircuit, Code2, Rocket, BookOpen, Trophy, Star, Cpu, Sun, Moon, Plus } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import type { Track } from "../types";

const ICONS: Record<string, React.ElementType> = {
  Bot, BrainCircuit, Code2, Rocket, BookOpen, Trophy, Star, Cpu,
};

const COLOR_HEX: Record<string, string> = {
  teal: "hsl(186 78% 42%)",
  purple: "hsl(268 60% 58%)",
  orange: "hsl(25 95% 55%)",
  blue: "hsl(215 80% 58%)",
  green: "hsl(142 71% 45%)",
  red: "hsl(0 72% 55%)",
};

interface SidebarProps {
  tracks: Track[];
  studentName: string;
  onAddTrack: () => void;
}

function NavLink({ href, icon: Icon, label, color }: { href: string; icon: React.ElementType; label: string; color?: string }) {
  const [location] = useLocation();
  const active = location === href || (href !== "/" && location.startsWith(href));
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
          active
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        data-testid={`nav-${label.toLowerCase().replace(/\s/g, "-")}`}
      >
        <Icon size={15} style={color ? { color } : undefined} />
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
}

export function Sidebar({ tracks, studentName, onAddTrack }: SidebarProps) {
  const { theme, toggle } = useTheme();

  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-border bg-card h-screen sticky top-0 overflow-y-auto">
      {/* Logo / name */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-teal-500/10 flex items-center justify-center">
            <Bot size={14} className="text-teal-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{studentName}</p>
            <p className="text-[10px] text-muted-foreground">Learning Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <NavLink href="/" icon={LayoutDashboard} label="Overview" />

        <div className="pt-3 pb-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-1">Tracks</p>
        </div>

        {tracks.map((t) => {
          const Icon = ICONS[t.icon] ?? Code2;
          return (
            <NavLink
              key={t.id}
              href={`/track/${t.id}`}
              icon={Icon}
              label={`${t.label} · ${t.name.split(" ").slice(0, 3).join(" ")}`}
              color={COLOR_HEX[t.color]}
            />
          );
        })}

        <button
          onClick={onAddTrack}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          data-testid="button-add-track-sidebar"
        >
          <Plus size={14} />
          <span>Add Track</span>
        </button>

        <div className="pt-3 pb-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-1">Log</p>
        </div>
        <NavLink href="/activity" icon={Activity} label="Activity Log" />
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] text-muted-foreground">Goal: Voice-Controlled UAV</p>
          <button
            onClick={toggle}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
