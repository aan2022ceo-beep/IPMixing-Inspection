"use client";

import type { SavedInspection } from "@/lib/types";
import { riskLevels, machineOptions, priorityLevels } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft, BarChart3 } from "lucide-react";

interface AnalyticsDashboardProps {
  data: SavedInspection[];
  onBack: () => void;
}

function BarChart({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <span className="w-[60px] text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="flex-1 h-5 rounded-md bg-surface-light overflow-hidden">
        <div className={cn("h-full rounded-md transition-all duration-300", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-[30px] text-right text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

export function AnalyticsDashboard({ data, onBack }: AnalyticsDashboardProps) {
  const totalCount = data.length;
  const openCount = data.filter((d) => d.status === "open").length;
  const inProgressCount = data.filter((d) => d.status === "in_progress").length;
  const pendingCount = data.filter((d) => d.status === "pending").length;
  const completedCount = data.filter((d) => d.status === "closed" || d.status === "completed").length;

  const priorityHighCount = data.filter((d) => d.priority === "high").length;
  const priorityMediumCount = data.filter((d) => d.priority === "medium").length;
  const priorityLowCount = data.filter((d) => d.priority === "low").length;
  const priorityNotSetCount = data.filter((d) => !d.priority).length;

  const machineStats = machineOptions
    .map((m) => ({ machine: m, count: data.filter((d) => d.machine === m).length }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);

  const floorStats = [...new Set(data.map((d) => d.floor).filter((f) => f))]
    .map((f) => ({
      floor: f,
      label: f === "A" ? "A Chemicals" : f === "Q" ? "Q Chemicals" : `Lantai ${f}`,
      count: data.filter((d) => d.floor === f).length,
    }))
    .sort((a, b) => b.count - a.count);

  const typeStats = [...new Set(data.map((d) => d.type))]
    .map((t) => ({ type: t, count: data.filter((d) => d.type === t).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const stats = [
    { l: "Open", v: openCount, color: "border-l-danger text-danger" },
    { l: "Progress", v: inProgressCount, color: "border-l-info text-info" },
    { l: "Pending", v: pendingCount, color: "border-l-warning text-warning" },
    { l: "Closed", v: completedCount, color: "border-l-success text-success" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
        <button onClick={onBack} className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex items-center gap-2 text-base font-bold text-foreground">
          <BarChart3 className="h-5 w-5" /> Analytics
        </h1>
        <div className="w-[42px]" />
      </header>

      <main className="flex-1 p-5">
        {/* Quick Stats */}
        <div className="mb-5 grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl border-l-[3px] bg-card p-3 text-center">
              <span className={cn("block text-2xl font-extrabold", s.color)}>{s.v}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{s.l}</span>
            </div>
          ))}
        </div>

        {totalCount === 0 ? (
          <div className="rounded-[14px] border border-border bg-card p-8 text-center">
            <BarChart3 className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No data available yet. Complete some inspections!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Risk Distribution */}
            <div className="rounded-2xl border border-border bg-card p-[18px]">
              <h4 className="mb-3.5 text-sm font-bold text-foreground">Risk Distribution</h4>
              {riskLevels.map((r) => {
                const count = data.filter((d) => d.severity === r.value).length;
                return <BarChart key={r.value} label={r.label} value={count} total={totalCount} color={r.color} />;
              })}
            </div>

            {/* Status Distribution */}
            <div className="rounded-2xl border border-border bg-card p-[18px]">
              <h4 className="mb-3.5 text-sm font-bold text-foreground">Status Distribution</h4>
              <BarChart label="Open" value={openCount} total={totalCount} color="bg-danger" />
              <BarChart label="Progress" value={inProgressCount} total={totalCount} color="bg-info" />
              <BarChart label="Pending" value={pendingCount} total={totalCount} color="bg-warning" />
              <BarChart label="Closed" value={completedCount} total={totalCount} color="bg-success" />
            </div>

            {/* Priority Distribution */}
            <div className="rounded-2xl border border-border bg-card p-[18px]">
              <h4 className="mb-3.5 text-sm font-bold text-foreground">Priority Distribution</h4>
              <BarChart label="High" value={priorityHighCount} total={totalCount} color="bg-danger" />
              <BarChart label="Medium" value={priorityMediumCount} total={totalCount} color="bg-warning" />
              <BarChart label="Low" value={priorityLowCount} total={totalCount} color="bg-success" />
              <BarChart label="Not Set" value={priorityNotSetCount} total={totalCount} color="bg-muted-foreground" />
            </div>

            {/* By Machine */}
            {machineStats.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-[18px]">
                <h4 className="mb-3.5 text-sm font-bold text-foreground">By Machine</h4>
                {machineStats.slice(0, 5).map((m) => (
                  <BarChart key={m.machine} label={m.machine} value={m.count} total={totalCount} color="bg-info" />
                ))}
              </div>
            )}

            {/* By Floor */}
            {floorStats.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-[18px]">
                <h4 className="mb-3.5 text-sm font-bold text-foreground">By Floor / Area</h4>
                {floorStats.map((f) => (
                  <BarChart key={f.floor} label={f.label} value={f.count} total={totalCount} color="bg-info" />
                ))}
              </div>
            )}

            {/* Top Issue Types */}
            {typeStats.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-[18px]">
                <h4 className="mb-3.5 text-sm font-bold text-foreground">Top Issue Types</h4>
                {typeStats.map((t, i) => (
                  <div key={t.type} className="flex items-center gap-3 border-b border-border py-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface-light text-xs font-bold text-muted-foreground">{i + 1}</span>
                    <span className="flex-1 text-[13px] font-semibold text-foreground">{t.type}</span>
                    <span className="text-sm font-bold text-primary">{t.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
