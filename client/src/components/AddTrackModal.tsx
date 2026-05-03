import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Track } from "../types";

interface AddTrackModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (track: Track) => void;
}

const COLOR_OPTIONS = [
  { value: "teal", label: "Teal" },
  { value: "purple", label: "Purple" },
  { value: "orange", label: "Orange" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
];

const ICON_OPTIONS = [
  { value: "Bot", label: "Robot" },
  { value: "BrainCircuit", label: "AI Brain" },
  { value: "Code2", label: "Code" },
  { value: "Rocket", label: "Rocket" },
  { value: "BookOpen", label: "Book" },
  { value: "Trophy", label: "Trophy" },
  { value: "Star", label: "Star" },
  { value: "Cpu", label: "Hardware" },
];

export function AddTrackModal({ open, onClose, onAdd }: AddTrackModalProps) {
  const [form, setForm] = useState({
    label: "",
    name: "",
    color: "blue",
    icon: "Code2",
    schedule: "",
    total_weeks: "",
    days_per_week: "5",
    phase_name: "Phase 1",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.label.trim()) e.label = "Track label is required (e.g. Track C)";
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.total_weeks || isNaN(Number(form.total_weeks)) || Number(form.total_weeks) < 1)
      e.total_weeks = "Enter a valid number of weeks (minimum 1)";
    if (!form.days_per_week || isNaN(Number(form.days_per_week)) || Number(form.days_per_week) < 1 || Number(form.days_per_week) > 7)
      e.days_per_week = "Enter days per week (1-7)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const totalDays = Number(form.total_weeks) * Number(form.days_per_week);
    const id = `track_${form.label.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;

    const days = Array.from({ length: Math.min(totalDays, 200) }, (_, i) => ({
      day: i + 1,
      theme: `Day ${i + 1}`,
      status: "not_started" as const,
      completed_date: null,
      quiz_score: null,
      quiz_max: 10,
      study_hours: null,
      github_files: [],
    }));

    const newTrack: Track = {
      id,
      label: form.label.trim(),
      name: form.name.trim(),
      color: form.color as Track["color"],
      icon: form.icon,
      schedule: form.schedule.trim() || "Custom schedule",
      total_days: totalDays,
      current_day: 1,
      days_completed: 0,
      phase: 1,
      phase_name: form.phase_name.trim() || "Phase 1",
      days,
    };

    onAdd(newTrack);
    setForm({ label: "", name: "", color: "blue", icon: "Code2", schedule: "", total_weeks: "", days_per_week: "5", phase_name: "Phase 1", description: "" });
    setErrors({});
    onClose();
  };

  const totalDays =
    form.total_weeks && form.days_per_week && !isNaN(Number(form.total_weeks)) && !isNaN(Number(form.days_per_week))
      ? Number(form.total_weeks) * Number(form.days_per_week)
      : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" data-testid="add-track-modal">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add New Learning Track</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Track Label *</Label>
              <Input
                placeholder="Track C"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                data-testid="input-track-label"
              />
              {errors.label && <p className="text-xs text-destructive mt-1">{errors.label}</p>}
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Color</Label>
              <Select value={form.color} onValueChange={(v) => setForm({ ...form, color: v })}>
                <SelectTrigger data-testid="select-track-color">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium mb-1.5 block">Full Track Name *</Label>
            <Input
              placeholder="e.g. Computer Vision + OpenCV"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="input-track-name"
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Total Weeks *</Label>
              <Input
                type="number"
                min={1}
                placeholder="16"
                value={form.total_weeks}
                onChange={(e) => setForm({ ...form, total_weeks: e.target.value })}
                data-testid="input-total-weeks"
              />
              {errors.total_weeks && <p className="text-xs text-destructive mt-1">{errors.total_weeks}</p>}
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Days Per Week *</Label>
              <Input
                type="number"
                min={1}
                max={7}
                placeholder="5"
                value={form.days_per_week}
                onChange={(e) => setForm({ ...form, days_per_week: e.target.value })}
                data-testid="input-days-per-week"
              />
              {errors.days_per_week && <p className="text-xs text-destructive mt-1">{errors.days_per_week}</p>}
            </div>
          </div>

          {totalDays !== null && (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded px-3 py-2">
              Total target: <span className="text-foreground font-mono font-semibold">{totalDays} days</span> — this is your 100% goal for this track.
            </p>
          )}

          <div>
            <Label className="text-xs font-medium mb-1.5 block">Schedule / Cadence</Label>
            <Input
              placeholder="e.g. Weekdays, or Every other day"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              data-testid="input-track-schedule"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger data-testid="select-track-icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((i) => (
                    <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Phase 1 Name</Label>
              <Input
                placeholder="Phase 1"
                value={form.phase_name}
                onChange={(e) => setForm({ ...form, phase_name: e.target.value })}
                data-testid="input-phase-name"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} data-testid="button-cancel-track">Cancel</Button>
          <Button onClick={handleSubmit} data-testid="button-add-track">Add Track</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
