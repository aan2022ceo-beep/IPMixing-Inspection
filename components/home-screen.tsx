"use client";

import { useInspection } from "@/lib/inspection-store";
import { getStatusBgColor } from "@/lib/helpers";
import {
  ClipboardList,
  AlertTriangle,
  Wrench,
  Clock,
  CheckCircle,
  BarChart3,
  FolderOpen,
  Factory,
  Cog,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function HomeScreen() {
  const { setCurrentView, savedInspections, startNewInspection } = useInspection();

  const openCount = savedInspections.filter((d) => d.status === "open").length;
  const inProgressCount = savedInspections.filter((d) => d.status === "in_progress").length;
  const pendingCount = savedInspections.filter((d) => d.status === "pending").length;
  const completedCount = savedInspections.filter((d) => d.status === "closed" || d.status === "completed").length;
  const criticalCount = savedInspections.filter((d) => d.severity === "critical" && d.status === "open").length;

  const tiles = [
    { id: "new", icon: ClipboardList, title: "New Inspection", sub: "Start audit", color: "border-primary", action: () => startNewInspection() },
    { id: "issues", icon: AlertTriangle, title: "Open Issues", sub: `${openCount} unresolved`, color: "border-danger", action: () => setCurrentView("openIssues") },
    { id: "inProgress", icon: Wrench, title: "In Progress", sub: `${inProgressCount} working`, color: "border-info", action: () => setCurrentView("inProgress") },
    { id: "pending", icon: Clock, title: "Pending", sub: `${pendingCount} reports`, color: "border-warning", action: () => setCurrentView("pending") },
    { id: "completed", icon: CheckCircle, title: "Completed", sub: `${completedCount} closed`, color: "border-success", action: () => setCurrentView("completed") },
    { id: "analytics", icon: BarChart3, title: "Analytics", sub: "Dashboard", color: "border-info", action: () => setCurrentView("analytics") },
    { id: "history", icon: FolderOpen, title: "History", sub: `${savedInspections.length} records`, color: "border-info", action: () => setCurrentView("history") },
  ];

  const recentActivity = savedInspections.slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-primary-dark">
              <Cog className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">IP. Mixing Digital Inspection</h1>
              <p className="text-xs text-muted-foreground">Abnormal Process Program</p>
            </div>
          </div>
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border-2 border-primary bg-primary-light text-base font-bold text-primary-dark">
            M1
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-5">
        {/* Banner */}
        <div className="relative mb-5 flex items-center justify-between overflow-hidden rounded-[20px] border border-primary/20 bg-gradient-to-br from-accent to-primary-light p-6">
          <div className="relative z-10 flex-1">
            <h2 className="text-balance text-[22px] font-extrabold text-foreground">Good Morning!</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {criticalCount > 0
                ? `${criticalCount} critical issue(s) need attention`
                : "Ready for today's inspection"}
            </p>
          </div>
          <Factory className="absolute -bottom-2 -right-2 h-20 w-20 text-primary/10" />
        </div>

        {/* Quick Stats */}
        <div className="mb-5 grid grid-cols-4 gap-2">
          {[
            { label: "Open", value: openCount, color: "border-l-danger text-danger" },
            { label: "Progress", value: inProgressCount, color: "border-l-info text-info" },
            { label: "Pending", value: pendingCount, color: "border-l-warning text-warning" },
            { label: "Closed", value: completedCount, color: "border-l-success text-success" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border-l-[3px] bg-card p-3 text-center">
              <span className={cn("block text-2xl font-extrabold", stat.color)}>{stat.value}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <h3 className="mb-3.5 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">Quick Access</h3>
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {tiles.map((t) => (
            <button
              key={t.id}
              onClick={t.action}
              className={cn(
                "relative flex flex-col gap-1.5 overflow-hidden rounded-2xl border border-border bg-card p-[18px] text-left transition-all hover:-translate-y-0.5 hover:shadow-lg",
                "border-r-4",
                t.color,
              )}
            >
              <t.icon className="h-8 w-8 text-foreground" />
              <span className="text-sm font-bold text-foreground">{t.title}</span>
              <span className="text-xs text-muted-foreground">{t.sub}</span>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <h3 className="mb-3.5 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div className="rounded-[14px] border border-border bg-card p-8 text-center">
            <ClipboardList className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No activity yet. Start a new inspection!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-[14px] border border-border bg-card px-4 py-3.5">
                <div className={cn("h-2.5 w-2.5 shrink-0 rounded-full", getStatusBgColor(item.status))} />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-primary">{item.id}</span>
                  <span className="text-[13px] font-semibold text-foreground">{item.type}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {item.machine && `${item.machine} \u00B7 `}
                    {item.date} {"\u00B7"} {item.inspector}
                  </span>
                </div>
                <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground", getStatusBgColor(item.status))}>
                  {item.status === "in_progress" ? "PROGRESS" : item.status?.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
