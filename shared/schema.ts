import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Track A days (Robotics / ROS 2)
export const trackADays = sqliteTable("track_a_days", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dayNumber: integer("day_number").notNull().unique(),
  theme: text("theme").notNull(),
  status: text("status").notNull().default("pending"), // pending | in_progress | completed
  weekNumber: integer("week_number").notNull().default(1),
  phase: integer("phase").notNull().default(1),
  completedDate: text("completed_date"),
  studyHours: real("study_hours"),
  githubFiles: text("github_files"), // JSON array of verified file paths
  quizScore: real("quiz_score"),
  quizMaxScore: real("quiz_max_score"),
  notes: text("notes"),
});

export const insertTrackADaySchema = createInsertSchema(trackADays).omit({ id: true });
export type InsertTrackADay = z.infer<typeof insertTrackADaySchema>;
export type TrackADay = typeof trackADays.$inferSelect;

// Track B days (AI/ML/RAG)
export const trackBDays = sqliteTable("track_b_days", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dayNumber: integer("day_number").notNull().unique(),
  theme: text("theme").notNull(),
  status: text("status").notNull().default("pending"),
  phase: integer("phase").notNull().default(1),
  phaseName: text("phase_name").notNull().default("DL + Classic ML for NLP"),
  completedDate: text("completed_date"),
  studyHours: real("study_hours"),
  githubFiles: text("github_files"), // JSON array
  quizScore: real("quiz_score"),
  quizMaxScore: real("quiz_max_score"),
  notes: text("notes"),
});

export const insertTrackBDaySchema = createInsertSchema(trackBDays).omit({ id: true });
export type InsertTrackBDay = z.infer<typeof insertTrackBDaySchema>;
export type TrackBDay = typeof trackBDays.$inferSelect;

// Overall progress summary (single row, id=1)
export const progressSummary = sqliteTable("progress_summary", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  currentTrackADay: integer("current_track_a_day").notNull().default(3),
  currentTrackBDay: integer("current_track_b_day").notNull().default(1),
  streak: integer("streak").notNull().default(2),
  longestStreak: integer("longest_streak").notNull().default(2),
  totalStudyHours: real("total_study_hours").notNull().default(7.0),
  githubCommits: integer("github_commits").notNull().default(5),
  calendarDayCount: integer("calendar_day_count").notNull().default(4),
  lastUpdated: text("last_updated"),
  // Coursera
  modernRoboticsWeek: integer("modern_robotics_week").notNull().default(1),
  modernRoboticsCourse: integer("modern_robotics_course").notNull().default(1),
  mathForMlWeek: integer("math_for_ml_week").notNull().default(1),
  computerVisionWeek: integer("computer_vision_week").notNull().default(1),
});

export const insertProgressSummarySchema = createInsertSchema(progressSummary).omit({ id: true });
export type InsertProgressSummary = z.infer<typeof insertProgressSummarySchema>;
export type ProgressSummary = typeof progressSummary.$inferSelect;

// Daily activity log
export const activityLog = sqliteTable("activity_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  track: text("track").notNull(), // A | B
  dayNumber: integer("day_number").notNull(),
  action: text("action").notNull(), // briefing_sent | task_completed | quiz_submitted | day_completed
  detail: text("detail"),
});

export const insertActivityLogSchema = createInsertSchema(activityLog).omit({ id: true });
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLog.$inferSelect;
