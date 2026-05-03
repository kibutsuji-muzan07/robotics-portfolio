export interface DayEntry {
  day: number;
  theme: string;
  status: "completed" | "in_progress" | "not_started" | "pending";
  completed_date: string | null;
  quiz_score: number | null;
  quiz_max: number;
  study_hours: number | null;
  github_files: string[];
}

export interface Track {
  id: string;
  label: string;
  name: string;
  color: "teal" | "purple" | "orange" | "blue" | "green" | "red";
  icon: string;
  schedule: string;
  total_days: number;
  current_day: number;
  days_completed: number;
  phase: number;
  phase_name: string;
  days: DayEntry[];
}

export interface CourseraEntry {
  name: string;
  provider: string;
  current_week: number;
  total_weeks: number;
  track: string;
  status: string;
}

export interface ActivityEntry {
  date: string;
  track: string;
  day: number;
  action: string;
  detail: string;
}

export interface ProgressData {
  _schema_version: string;
  _last_updated: string;
  student: {
    name: string;
    goal: string;
    target_role: string;
    github: string;
    repo: string;
    branch: string;
    start_date: string;
  };
  summary: {
    streak: number;
    longest_streak: number;
    total_study_hours: number;
    github_commits: number;
    last_updated: string;
  };
  tracks: Track[];
  coursera: CourseraEntry[];
  activity: ActivityEntry[];
}
