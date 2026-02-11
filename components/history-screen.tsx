"use client";

import { useState } from "react";
import type { SavedInspection } from "@/lib/types";
import { fiveMCategories, workflowStages, priorityLevels, qualityImpacts, riskLevels, inspectionCategories, estimatedTimeOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusLabel, getStatusBgColor, getRiskBgColor } from "@/lib/helpers";
import { ArrowLeft, Download, FolderOpen, X, FileSpreadsheet } from "lucide-react";

interface HistoryScreenProps {
  data: SavedInspection[];
  onBack: () => void;
}

export function HistoryScreen({ data, onBack }: HistoryScreenProps) {
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<SavedInspection | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [exporting, setExporting] = useState(false);

  const filtered = filter === "all" ? data : data.filter((d) => {
    if (filter === "closed") return d.status === "closed" || d.status === "completed";
    return d.status === filter;
  });

  const exportToExcel = async (item: SavedInspection) => {
    setExporting(true);
    try {
      const XLSX = (await import("xlsx")).default;
      const dateClosed = item.machineCase?.completedAt
        ? new Date(item.machineCase.completedAt).toLocaleString()
        : item.closedAt
          ? new Date(item.closedAt).toLocaleString()
          : item.status === "closed" || item.status === "completed"
            ? "Completed"
            : "-";

      const exportData: (string | number)[][] = [
        ["IP. MIXING DIGITAL INSPECTION - DETAIL REPORT"],
        ["Generated:", new Date().toLocaleString()],
        [""],
        ["=== BASIC INFORMATION ==="],
        ["Inspection ID", item.id],
        ["Date", item.date],
        ["Shift", item.shift || "-"],
        ["Inspector", item.inspector],
        ["Status", getStatusLabel(item.status)],
        ["Created At", item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"],
        ["Date Closed", dateClosed],
        [""],
        ["=== LOCATION & EQUIPMENT ==="],
        ["Machine/Chemical", item.machine || "-"],
        ["Location/Floor", item.floor === "A" || item.floor === "Q" ? `${item.floor} Chemicals` : item.floor ? `Lantai ${item.floor}` : "-"],
        [""],
        ["=== ISSUE DETAILS ==="],
        ["Type", item.type || "General Inspection"],
        ["Risk Level", item.severity?.toUpperCase() || "-"],
        ["Priority", priorityLevels.find((p) => p.id === item.priority)?.label || "Not Set"],
        ["Workflow Stage", workflowStages.find((s) => s.id === item.workflowStage)?.title || "-"],
        ["Quality Impact", qualityImpacts.find((q) => q.id === item.qualityImpact)?.label || "-"],
        [""],
        ["=== DESCRIPTION ==="],
        ["Description", item.description || "-"],
        [""],
      ];

      if (item.photos && item.photos.length > 0) {
        exportData.push(["=== EVIDENCE PHOTOS ==="]);
        exportData.push(["Total Photos", item.photos.length]);
        item.photos.forEach((photo, idx) => {
          const category = photo.category ? inspectionCategories.find((c) => c.id === photo.category)?.title || photo.category : "General";
          exportData.push([`Photo ${idx + 1}`, `${photo.name || "Photo"} (${category})`]);
        });
        exportData.push([""]);
      }

      if (item.abnormalData?.fiveMAnalysis) {
        exportData.push(["=== 5M ROOT CAUSE ANALYSIS ==="]);
        fiveMCategories.forEach((m) => {
          const value = item.abnormalData.fiveMAnalysis[m.id];
          exportData.push([m.title, value || "-"]);
        });
        exportData.push([""]);
      }

      if (item.machineCase) {
        exportData.push(["=== MAINTENANCE INFORMATION ==="]);
        exportData.push(["Technician Name", item.machineCase.technicianName || "-"]);
        exportData.push(["Estimated Time", estimatedTimeOptions.find((t) => t.value === item.machineCase!.estimatedTime)?.label || "-"]);
        exportData.push(["Actual Time", item.machineCase.actualTime ? `${item.machineCase.actualTime} minutes` : "-"]);
        exportData.push(["Completed At", item.machineCase.completedAt ? new Date(item.machineCase.completedAt).toLocaleString() : "-"]);
        if (item.machineCase.replacedParts?.length > 0) {
          exportData.push([""]);
          exportData.push(["Replaced Parts:"]);
          item.machineCase.replacedParts.forEach((part, idx) => {
            exportData.push([`  ${idx + 1}. ${part.name}`, `Qty: ${part.qty}`]);
          });
        }
        if (item.machineCase.technicianNotes) {
          exportData.push([""]);
          exportData.push(["Technician Notes", item.machineCase.technicianNotes]);
        }
      }

      const ws = XLSX.utils.aoa_to_sheet(exportData);
      ws["!cols"] = [{ wch: 25 }, { wch: 50 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inspection Detail");
      const safeId = item.id.replace(/\//g, "-");
      XLSX.writeFile(wb, `Inspection_${safeId}_${item.date}.xlsx`);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting to Excel. Please try again.");
    }
    setExporting(false);
  };

  const exportAllToExcel = async () => {
    if (filtered.length === 0) { alert("No data to export"); return; }
    setExporting(true);
    try {
      const XLSX = (await import("xlsx")).default;
      const summaryData: (string | number)[][] = [
        ["IP. MIXING DIGITAL INSPECTION - SUMMARY REPORT"],
        ["Generated:", new Date().toLocaleString()],
        ["Total Records:", filtered.length],
        ["Filter:", filter === "all" ? "All Records" : filter.toUpperCase()],
        [""],
        ["ID", "Date", "Inspector", "Type", "Machine", "Location", "Status", "Priority", "Risk Level", "Workflow Stage", "Quality Impact", "Date Closed", "Photos", "Description"],
      ];

      filtered.forEach((item) => {
        const dateClosed = item.machineCase?.completedAt
          ? new Date(item.machineCase.completedAt).toLocaleDateString()
          : item.closedAt
            ? new Date(item.closedAt).toLocaleDateString()
            : item.status === "closed" || item.status === "completed" ? "Yes" : "-";
        summaryData.push([
          item.id, item.date, item.inspector, item.type || "General Inspection",
          item.machine || "-",
          item.floor === "A" || item.floor === "Q" ? `${item.floor} Chemicals` : item.floor ? `Lantai ${item.floor}` : "-",
          getStatusLabel(item.status),
          priorityLevels.find((p) => p.id === item.priority)?.label || "Not Set",
          item.severity?.toUpperCase() || "-",
          workflowStages.find((s) => s.id === item.workflowStage)?.title || "-",
          qualityImpacts.find((q) => q.id === item.qualityImpact)?.label || "-",
          dateClosed,
          item.photos?.length || 0,
          item.description || "-",
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(summaryData);
      ws["!cols"] = [{ wch: 20 }, { wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 8 }, { wch: 40 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "All Inspections");
      const today = new Date().toISOString().split("T")[0];
      XLSX.writeFile(wb, `Inspection_Report_${filter}_${today}.xlsx`);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting to Excel. Please try again.");
    }
    setExporting(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
        <button onClick={onBack} className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex items-center gap-2 text-base font-bold text-foreground">
          <FolderOpen className="h-5 w-5" /> History
        </h1>
        <button
          onClick={exportAllToExcel}
          disabled={exporting || filtered.length === 0}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-primary bg-primary-light text-primary disabled:opacity-50"
        >
          <Download className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 p-5">
        {/* Filter Row */}
        <div className="mb-4 flex flex-wrap gap-2">
          {["all", "open", "in_progress", "pending", "closed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "border border-border bg-surface-light text-muted-foreground hover:bg-border",
              )}
            >
              {f === "all" ? "All" : f === "in_progress" ? "Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] font-semibold text-muted-foreground">{filtered.length} record(s)</p>
          {filtered.length > 0 && (
            <button onClick={exportAllToExcel} disabled={exporting} className="flex items-center gap-1.5 rounded-[10px] border border-primary bg-primary-light px-4 py-2 text-xs font-semibold text-primary disabled:opacity-50">
              <Download className="h-3.5 w-3.5" /> {exporting ? "Exporting..." : "Export All to Excel"}
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[14px] border border-border bg-card p-8 text-center">
            <FolderOpen className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No history yet</p>
          </div>
        ) : (
          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((d) => (
              <button
                key={d.id}
                onClick={() => { setSelectedItem(d); setShowDetail(true); }}
                className="rounded-[14px] border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary">{d.id}</span>
                  <span className={cn("text-[11px] font-bold", getStatusColor(d.status))}>{getStatusLabel(d.status)}</span>
                </div>
                <h4 className="mb-2 text-sm font-bold text-foreground">{d.type || "General Inspection"}</h4>
                <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  <span>Cal: {d.date}</span>
                  <span>User: {d.inspector}</span>
                  {d.machine && <span>Machine: {d.machine}</span>}
                </div>
                {d.priority && (
                  <div className="mt-1.5 text-[11px] text-muted-foreground">
                    Priority: {priorityLevels.find((p) => p.id === d.priority)?.label}
                  </div>
                )}
                {d.machineCase && (
                  <div className="mt-2 flex flex-wrap gap-2.5 border-t border-border pt-2 text-[10px] text-muted-foreground">
                    {d.machineCase.technicianName && <span>Tech: {d.machineCase.technicianName}</span>}
                    {d.machineCase.replacedParts?.length > 0 && <span>{d.machineCase.replacedParts.length} parts</span>}
                    {d.machineCase.completedAt && <span>Done: {new Date(d.machineCase.completedAt).toLocaleDateString()}</span>}
                  </div>
                )}
                <p className="mt-2.5 text-[10px] font-semibold text-primary">Tap to view details</p>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {showDetail && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-5 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-[95vw] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl md:max-w-[600px]">
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <FileSpreadsheet className="h-5 w-5" /> Inspection Detail
              </h2>
              <button onClick={() => setShowDetail(false)} className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface-light text-muted-foreground hover:bg-border">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Basic Info */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{selectedItem.id}</span>
                  <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground", getStatusBgColor(selectedItem.status))}>
                    {getStatusLabel(selectedItem.status)}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-foreground">{selectedItem.type || "General Inspection"}</h3>
              </div>

              {/* Meta */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Date", value: selectedItem.date },
                  { label: "Inspector", value: selectedItem.inspector },
                  { label: "Shift", value: selectedItem.shift?.split(" ")[0] || "-" },
                  { label: "Created", value: selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : "-" },
                  ...(selectedItem.status === "closed" || selectedItem.status === "completed"
                    ? [{ label: "Date Closed", value: selectedItem.machineCase?.completedAt ? new Date(selectedItem.machineCase.completedAt).toLocaleString() : selectedItem.closedAt ? new Date(selectedItem.closedAt).toLocaleString() : "Completed" }]
                    : []),
                  ...(selectedItem.machine ? [{ label: "Machine", value: selectedItem.machine }] : []),
                  ...(selectedItem.floor ? [{ label: "Location", value: selectedItem.floor === "A" || selectedItem.floor === "Q" ? `${selectedItem.floor} Chemicals` : `Lantai ${selectedItem.floor}` }] : []),
                ].map((item, idx) => (
                  <div key={idx} className="rounded-[10px] border border-border bg-surface-light p-3">
                    <span className="block text-[10px] font-bold uppercase text-muted-foreground">{item.label}</span>
                    <span className="text-[13px] font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Priority & Workflow */}
              {(selectedItem.priority || selectedItem.workflowStage) && (
                <div className="mb-5">
                  <h4 className="mb-3 text-sm font-bold text-text-secondary">Status Info</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedItem.priority && (
                      <div className="rounded-[10px] border border-border bg-surface-light p-3">
                        <span className="block text-[10px] font-bold uppercase text-muted-foreground">Priority</span>
                        <span className={cn("text-[13px] font-semibold", priorityLevels.find((p) => p.id === selectedItem.priority)?.textColor)}>
                          {priorityLevels.find((p) => p.id === selectedItem.priority)?.label}
                        </span>
                      </div>
                    )}
                    {selectedItem.workflowStage && (
                      <div className="rounded-[10px] border border-border bg-surface-light p-3">
                        <span className="block text-[10px] font-bold uppercase text-muted-foreground">Workflow</span>
                        <span className="text-[13px] font-semibold text-foreground">
                          {workflowStages.find((s) => s.id === selectedItem.workflowStage)?.title}
                        </span>
                      </div>
                    )}
                    {selectedItem.qualityImpact && (
                      <div className="rounded-[10px] border border-border bg-surface-light p-3">
                        <span className="block text-[10px] font-bold uppercase text-muted-foreground">Quality Impact</span>
                        <span className="text-[13px] font-semibold text-foreground">
                          {qualityImpacts.find((q) => q.id === selectedItem.qualityImpact)?.label}
                        </span>
                      </div>
                    )}
                    {selectedItem.severity && (
                      <div className="rounded-[10px] border border-border bg-surface-light p-3">
                        <span className="block text-[10px] font-bold uppercase text-muted-foreground">Risk Level</span>
                        <span className={cn("text-[13px] font-semibold", riskLevels.find((r) => r.value === selectedItem.severity)?.textColor)}>
                          {selectedItem.severity?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedItem.description && (
                <div className="mb-5">
                  <h4 className="mb-3 text-sm font-bold text-text-secondary">Description / Notes</h4>
                  <div className="rounded-xl border border-border bg-surface-light p-3.5">
                    <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-text-secondary">{selectedItem.description}</p>
                  </div>
                </div>
              )}

              {/* 5M Analysis */}
              {selectedItem.abnormalData?.fiveMAnalysis && Object.values(selectedItem.abnormalData.fiveMAnalysis).some((v) => v) && (
                <div className="mb-5">
                  <h4 className="mb-3 text-sm font-bold text-text-secondary">5M Root Cause Analysis</h4>
                  {fiveMCategories.map((m) => {
                    const value = selectedItem.abnormalData.fiveMAnalysis[m.id];
                    if (!value) return null;
                    return (
                      <div key={m.id} className="mb-2.5 rounded-[10px] border border-border bg-surface-light p-3">
                        <span className="mb-1.5 block text-xs font-bold text-text-secondary">{m.title}</span>
                        <p className="text-xs leading-relaxed text-foreground">{value}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Photos */}
              {selectedItem.photos && selectedItem.photos.length > 0 && (
                <div className="mb-5">
                  <h4 className="mb-3 text-sm font-bold text-text-secondary">Evidence Photos ({selectedItem.photos.length})</h4>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
                    {selectedItem.photos.map((photo, idx) => (
                      <div key={photo.id || idx} className="overflow-hidden rounded-xl border border-border bg-surface-light">
                        <img src={photo.url} alt={photo.name || `Evidence ${idx + 1}`} className="h-[100px] w-full cursor-pointer object-cover transition-transform hover:scale-105" onClick={() => window.open(photo.url, "_blank")} />
                        <div className="p-2">
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-semibold text-foreground">{photo.name || `Photo ${idx + 1}`}</span>
                          <span className="block text-[9px] text-muted-foreground">{photo.category ? inspectionCategories.find((c) => c.id === photo.category)?.title || photo.category : "General"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2.5 text-center text-[10px] italic text-muted-foreground">Tap photo to view full size</p>
                </div>
              )}

              {/* Machine Case */}
              {selectedItem.machineCase && (
                <div className="mb-5">
                  <h4 className="mb-3 text-sm font-bold text-text-secondary">Maintenance Info</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedItem.machineCase.technicianName && (
                      <div className="rounded-[10px] border border-border bg-surface-light p-3">
                        <span className="block text-[10px] font-bold uppercase text-muted-foreground">Technician</span>
                        <span className="text-[13px] font-semibold text-foreground">{selectedItem.machineCase.technicianName}</span>
                      </div>
                    )}
                    {selectedItem.machineCase.estimatedTime && (
                      <div className="rounded-[10px] border border-border bg-surface-light p-3">
                        <span className="block text-[10px] font-bold uppercase text-muted-foreground">Est. Time</span>
                        <span className="text-[13px] font-semibold text-foreground">{estimatedTimeOptions.find((t) => t.value === selectedItem.machineCase!.estimatedTime)?.label}</span>
                      </div>
                    )}
                    {selectedItem.machineCase.actualTime && (
                      <div className="rounded-[10px] border border-border bg-surface-light p-3">
                        <span className="block text-[10px] font-bold uppercase text-muted-foreground">Actual Time</span>
                        <span className="text-[13px] font-semibold text-foreground">{selectedItem.machineCase.actualTime} min</span>
                      </div>
                    )}
                    {selectedItem.machineCase.completedAt && (
                      <div className="rounded-[10px] border border-border bg-surface-light p-3">
                        <span className="block text-[10px] font-bold uppercase text-muted-foreground">Completed</span>
                        <span className="text-[13px] font-semibold text-foreground">{new Date(selectedItem.machineCase.completedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  {selectedItem.machineCase.replacedParts?.length > 0 && (
                    <div className="mt-3">
                      <span className="block text-[10px] font-bold uppercase text-muted-foreground">Replaced Parts:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedItem.machineCase.replacedParts.map((part, idx) => (
                          <span key={idx} className="rounded-lg bg-info px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">{part.name} ({part.qty})</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedItem.machineCase.technicianNotes && (
                    <div className="mt-3 rounded-xl border border-border bg-surface-light p-3.5">
                      <span className="block text-[10px] font-bold uppercase text-muted-foreground">Technician Notes:</span>
                      <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-text-secondary">{selectedItem.machineCase.technicianNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <footer className="flex gap-2.5 border-t border-border bg-surface-light px-6 py-4">
              <button
                onClick={() => exportToExcel(selectedItem)}
                disabled={exporting}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-info px-3.5 py-3.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> {exporting ? "Exporting..." : "Export to Excel"}
              </button>
              <button
                onClick={() => setShowDetail(false)}
                className="flex-1 rounded-xl bg-primary px-3.5 py-3.5 text-[13px] font-semibold text-primary-foreground"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
