"use client";

import { useState } from "react";
import type { SavedInspection, MaintenanceSubmitData, ReplacedPart } from "@/lib/types";
import { maintenanceChecklist, commonSpareParts, estimatedTimeOptions, riskLevels } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getRiskBgColor } from "@/lib/helpers";
import { X, Plus, Eye, Sparkles, Droplets, Ruler, Zap as ZapIcon, Shield, FileText, Wrench, CheckCircle } from "lucide-react";

const checklistIcons: Record<string, React.ReactNode> = {
  inspection: <Eye className="h-[18px] w-[18px]" />,
  cleaning: <Sparkles className="h-[18px] w-[18px]" />,
  lubrication: <Droplets className="h-[18px] w-[18px]" />,
  calibration: <Ruler className="h-[18px] w-[18px]" />,
  testing: <ZapIcon className="h-[18px] w-[18px]" />,
  safety: <Shield className="h-[18px] w-[18px]" />,
  documentation: <FileText className="h-[18px] w-[18px]" />,
};

interface MaintenanceModalProps {
  item: SavedInspection;
  actionType: string;
  onSubmit: (data: MaintenanceSubmitData) => void;
  onClose: () => void;
}

export function MaintenanceModal({ item, actionType, onSubmit, onClose }: MaintenanceModalProps) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    item.machineCase?.checklist || maintenanceChecklist.reduce((acc, c) => ({ ...acc, [c.id]: false }), {} as Record<string, boolean>),
  );
  const [replacedParts, setReplacedParts] = useState<ReplacedPart[]>(item.machineCase?.replacedParts || []);
  const [estimatedTime, setEstimatedTime] = useState(item.machineCase?.estimatedTime || 60);
  const [actualTime, setActualTime] = useState(item.machineCase?.actualTime?.toString() || "");
  const [technicianName, setTechnicianName] = useState(item.machineCase?.technicianName || "");
  const [technicianNotes, setTechnicianNotes] = useState(item.machineCase?.technicianNotes || "");
  const [newPart, setNewPart] = useState({ partId: "", qty: 1, notes: "" });

  const addReplacedPart = () => {
    if (!newPart.partId) return;
    const partInfo = commonSpareParts.find((p) => p.id === newPart.partId);
    if (partInfo) {
      setReplacedParts((prev) => [
        ...prev,
        { id: Date.now(), partId: newPart.partId, name: partInfo.name, unit: partInfo.unit, qty: newPart.qty, notes: newPart.notes },
      ]);
      setNewPart({ partId: "", qty: 1, notes: "" });
    }
  };

  const removeReplacedPart = (id: number) => {
    setReplacedParts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    onSubmit({
      status: actionType,
      checklist,
      replacedParts,
      estimatedTime,
      actualTime: actualTime ? parseInt(actualTime) : null,
      technicianName,
      technicianNotes,
    });
  };

  const completedCount = Object.values(checklist).filter((v) => v).length;
  const totalCount = maintenanceChecklist.length;
  const isStartWork = actionType === "in_progress";
  const isComplete = actionType === "closed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-5 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-[95vw] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl md:max-w-[600px]">
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            {isStartWork ? <><Wrench className="h-5 w-5" /> Start Maintenance</> : <><CheckCircle className="h-5 w-5" /> Complete Maintenance</>}
          </h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface-light text-muted-foreground hover:bg-border">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Item Info */}
          <div className="mb-5 rounded-[14px] border border-primary/30 bg-accent p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-primary">{item.id}</span>
              <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground", getRiskBgColor(item.severity))}>
                {item.severity?.toUpperCase()}
              </span>
            </div>
            <h4 className="mb-1.5 text-base font-bold text-foreground">{item.type}</h4>
            <p className="text-xs text-muted-foreground">
              Machine: {item.machine} {"\u00B7"} Lantai {item.floor}
            </p>
          </div>

          {/* Technician Info */}
          <div className="mb-5">
            <h3 className="mb-3 text-sm font-bold text-foreground">Technician Info</h3>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              placeholder="Enter technician name"
              className="w-full rounded-[14px] border-2 border-border bg-card px-[18px] py-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {/* Estimated Time */}
          <div className="mb-5">
            <h3 className="mb-3 text-sm font-bold text-foreground">Estimated Time</h3>
            <div className="grid grid-cols-4 gap-2">
              {estimatedTimeOptions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setEstimatedTime(t.value)}
                  className={cn(
                    "rounded-[10px] border-2 px-2 py-2.5 text-xs font-semibold transition-colors",
                    estimatedTime === t.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-light text-text-secondary",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actual Time */}
          {isComplete && (
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-bold text-foreground">Actual Time (minutes)</h3>
              <input
                type="number"
                value={actualTime}
                onChange={(e) => setActualTime(e.target.value)}
                placeholder="Enter actual time in minutes"
                className="w-full rounded-[14px] border-2 border-border bg-card px-[18px] py-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          )}

          {/* Checklist */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center text-sm font-bold text-foreground">
              Maintenance Checklist
              <span className="ml-auto text-xs font-semibold text-primary">({completedCount}/{totalCount})</span>
            </h3>
            <div className="flex flex-col gap-2">
              {maintenanceChecklist.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-border bg-surface-light p-3">
                  <input
                    type="checkbox"
                    checked={checklist[c.id] || false}
                    onChange={(e) => setChecklist((prev) => ({ ...prev, [c.id]: e.target.checked }))}
                    className="h-[22px] w-[22px] accent-success"
                  />
                  <span className="text-foreground">{checklistIcons[c.id]}</span>
                  <span className="flex-1 text-[13px] text-text-secondary">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Replaced Parts */}
          <div className="mb-5">
            <h3 className="mb-3 text-sm font-bold text-foreground">Replaced Parts</h3>
            <div className="mb-3 flex gap-2">
              <select
                value={newPart.partId}
                onChange={(e) => setNewPart((p) => ({ ...p, partId: e.target.value }))}
                className="flex-1 rounded-[10px] border border-border bg-surface-light px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-primary"
              >
                <option value="">Select part...</option>
                {commonSpareParts.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={newPart.qty}
                onChange={(e) => setNewPart((p) => ({ ...p, qty: parseInt(e.target.value) || 1 }))}
                min="1"
                className="w-[60px] rounded-[10px] border border-border bg-surface-light px-2 py-2.5 text-center text-[13px] text-foreground outline-none focus:border-primary"
                placeholder="Qty"
              />
              <button onClick={addReplacedPart} className="flex items-center gap-1 rounded-[10px] bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            {replacedParts.length > 0 && (
              <div className="flex flex-col gap-2">
                {replacedParts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-[10px] border border-border bg-surface-light px-3.5 py-2.5">
                    <span className="flex-1 text-[13px] font-semibold text-foreground">{p.name}</span>
                    <span className="text-xs font-semibold text-primary">{p.qty} {p.unit}</span>
                    <button onClick={() => removeReplacedPart(p.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-danger text-primary-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technician Notes */}
          <div className="mb-5">
            <h3 className="mb-3 text-sm font-bold text-foreground">Technician Notes</h3>
            <textarea
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              placeholder="Add any notes about the maintenance work..."
              className="w-full resize-none rounded-[14px] border-2 border-border bg-surface-light p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              rows={3}
            />
          </div>
        </div>

        <footer className="flex gap-2.5 border-t border-border bg-surface-light px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border bg-card px-3.5 py-3.5 text-[13px] font-semibold text-text-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-3.5 text-[13px] font-semibold text-primary-foreground">
            {isStartWork ? <><Wrench className="h-4 w-4" /> Start Work</> : <><CheckCircle className="h-4 w-4" /> Complete & Close</>}
          </button>
        </footer>
      </div>
    </div>
  );
}
