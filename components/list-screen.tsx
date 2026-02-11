"use client";

import { useState } from "react";
import type { SavedInspection, MaintenanceSubmitData } from "@/lib/types";
import { riskLevels, workflowStages, priorityLevels, qualityImpacts, estimatedTimeOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getRiskBgColor, getStatusBgColor, getStatusLabel } from "@/lib/helpers";
import { ArrowLeft, Wrench, Clock, AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";
import { MaintenanceModal } from "./maintenance-modal";

interface ListScreenProps {
  title: string;
  status: string;
  data: SavedInspection[];
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onUpdateMachineCase: (id: string, maintenanceData: MaintenanceSubmitData) => void;
}

export function ListScreen({ title, status, data, onBack, onUpdateStatus, onUpdateMachineCase }: ListScreenProps) {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SavedInspection | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);

  const filtered = data.filter((d) => {
    if (status === "closed") return d.status === "closed" || d.status === "completed";
    return d.status === status;
  });

  const handleAction = (item: SavedInspection, action: string) => {
    if (action === "in_progress" || action === "closed") {
      setSelectedItem(item);
      setActionType(action);
      setShowMaintenanceModal(true);
    } else {
      onUpdateStatus(item.id, action);
    }
  };

  const handleMaintenanceSubmit = (maintenanceData: MaintenanceSubmitData) => {
    if (selectedItem) onUpdateMachineCase(selectedItem.id, maintenanceData);
    setShowMaintenanceModal(false);
    setSelectedItem(null);
    setActionType(null);
  };

  const getStatusActions = (item: SavedInspection) => {
    switch (item.status) {
      case "open":
        return [
          { label: "Start Work", action: "in_progress", color: "bg-info", icon: <Wrench className="h-3.5 w-3.5" /> },
          { label: "Move to Pending", action: "pending", color: "bg-warning", icon: <Clock className="h-3.5 w-3.5" /> },
        ];
      case "in_progress":
        return [
          { label: "Mark Complete", action: "closed", color: "bg-success", icon: <CheckCircle className="h-3.5 w-3.5" /> },
          { label: "Back to Open", action: "open", color: "bg-danger", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
        ];
      case "pending":
        return [
          { label: "Start Work", action: "in_progress", color: "bg-info", icon: <Wrench className="h-3.5 w-3.5" /> },
          { label: "Reopen", action: "open", color: "bg-danger", icon: <RotateCcw className="h-3.5 w-3.5" /> },
        ];
      case "closed":
      case "completed":
        return [{ label: "Reopen", action: "open", color: "bg-danger", icon: <RotateCcw className="h-3.5 w-3.5" /> }];
      default:
        return [];
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
        <button onClick={onBack} className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-bold text-foreground">{title}</h1>
        <div className="w-[42px]" />
      </header>

      <main className="flex-1 p-5">
        <p className="mb-3 text-[13px] font-semibold text-muted-foreground">{filtered.length} inspection(s)</p>
        {filtered.length === 0 ? (
          <div className="rounded-[14px] border border-border bg-card p-8 text-center">
            <AlertTriangle className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No items found</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((d) => (
              <div
                key={d.id}
                className={cn(
                  "rounded-2xl border border-border bg-card p-[18px] transition-all hover:-translate-y-0.5 hover:shadow-lg",
                  "border-l-4",
                  getRiskBgColor(d.severity).replace("bg-", "border-l-"),
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary">{d.id}</span>
                  <div className="flex gap-1.5">
                    <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground", getRiskBgColor(d.severity))}>
                      {d.severity?.toUpperCase()}
                    </span>
                    <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground", getStatusBgColor(d.status))}>
                      {getStatusLabel(d.status)}
                    </span>
                  </div>
                </div>
                <h4 className="mb-1.5 text-base font-bold text-foreground">{d.type || "General Inspection"}</h4>
                <p className="mb-2.5 text-[13px] leading-relaxed text-muted-foreground">{d.description}</p>
                <div className="mb-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  <span>Cal: {d.date}</span>
                  <span>User: {d.inspector}</span>
                  {d.machine && <span>Machine: {d.machine}</span>}
                  {d.floor && <span>Lantai {d.floor}</span>}
                </div>

                {/* Machine Case Info */}
                {d.machineCase && (
                  <div className="mt-2.5 rounded-[10px] border border-border bg-surface-light p-3">
                    <span className="mb-2 block text-xs font-bold text-primary">Machine Case Info</span>
                    {d.machineCase.technicianName && <p className="text-[11px] text-muted-foreground">Technician: {d.machineCase.technicianName}</p>}
                    {d.machineCase.estimatedTime && (
                      <p className="text-[11px] text-muted-foreground">
                        Est. Time: {estimatedTimeOptions.find((t) => t.value === d.machineCase!.estimatedTime)?.label}
                      </p>
                    )}
                    {d.machineCase.replacedParts && d.machineCase.replacedParts.length > 0 && (
                      <p className="text-[11px] text-muted-foreground">Parts: {d.machineCase.replacedParts.map((p) => `${p.name} (${p.qty})`).join(", ")}</p>
                    )}
                    {d.machineCase.completedAt && (
                      <p className="text-[11px] text-muted-foreground">Completed: {new Date(d.machineCase.completedAt).toLocaleString()}</p>
                    )}
                  </div>
                )}

                {d.workflowStage && (
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span>{workflowStages.find((s) => s.id === d.workflowStage)?.title}</span>
                    {d.priority && <span>{priorityLevels.find((p) => p.id === d.priority)?.label}</span>}
                    {d.qualityImpact && <span>{qualityImpacts.find((q) => q.id === d.qualityImpact)?.label}</span>}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {getStatusActions(d).map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(d, action.action)}
                      className={cn("flex items-center gap-1.5 rounded-[10px] px-3.5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90", action.color)}
                    >
                      {action.icon} {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showMaintenanceModal && selectedItem && actionType && (
        <MaintenanceModal
          item={selectedItem}
          actionType={actionType}
          onSubmit={handleMaintenanceSubmit}
          onClose={() => {
            setShowMaintenanceModal(false);
            setSelectedItem(null);
            setActionType(null);
          }}
        />
      )}
    </div>
  );
}
