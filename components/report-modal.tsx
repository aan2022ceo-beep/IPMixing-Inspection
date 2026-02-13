"use client";

import { useState } from "react";
import type { InspectionData, AbnormalData } from "@/lib/types";
import { workflowStages, priorityLevels, qualityImpacts } from "@/lib/constants";
import { X, Copy, Share2, Save } from "lucide-react";

interface ReportModalProps {
  inspectionData: InspectionData;
  abnormalData: AbnormalData;
  summary: { totalFindings: number; highRiskItems: number; riskBreakdown: Record<string, number> };
  onClose: () => void;
}

export function ReportModal({ inspectionData, abnormalData, summary, onClose }: ReportModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-5 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-[95vw] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl md:max-w-[600px]">
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold text-foreground">Inspection Report</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface-light text-muted-foreground hover:bg-border">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Meta Row */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              { label: "Date", value: inspectionData.date },
              { label: "Shift", value: inspectionData.shift?.split(" ")[0] },
              { label: "Inspector", value: inspectionData.inspector },
            ].map((item) => (
              <div key={item.label} className="rounded-[14px] border border-border bg-surface-light p-3.5 text-center">
                <span className="block text-[10px] font-bold uppercase text-muted-foreground">{item.label}</span>
                <span className="block text-[13px] font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border-l-4 border-l-primary bg-surface-light p-5 text-center">
              <span className="block text-4xl font-extrabold text-foreground">{summary.totalFindings}</span>
              <span className="text-xs font-semibold text-muted-foreground">Findings</span>
            </div>
            <div className="rounded-2xl border-l-4 border-l-danger bg-surface-light p-5 text-center">
              <span className="block text-4xl font-extrabold text-danger">{summary.highRiskItems}</span>
              <span className="text-xs font-semibold text-muted-foreground">High Risk</span>
            </div>
          </div>

          {/* Abnormal Process Info */}
          {abnormalData.processType && (
            <div className="mb-5 rounded-2xl border border-primary/20 bg-accent p-[18px]">
              <h4 className="mb-3 text-sm font-bold text-foreground">Abnormal Process</h4>
              <div className="space-y-1.5 text-[13px] leading-relaxed text-text-secondary">
                <p><strong className="text-foreground">Type:</strong> {abnormalData.processType}</p>
                <p><strong className="text-foreground">Stage:</strong> {workflowStages.find((s) => s.id === abnormalData.workflowStage)?.title}</p>
                <p>
                  <strong className="text-foreground">Priority:</strong>{" "}
                  {priorityLevels.find((p) => p.id === abnormalData.priority)?.label || "Not specified"}
                </p>
                <p>
                  <strong className="text-foreground">Impact:</strong>{" "}
                  {qualityImpacts.find((q) => q.id === abnormalData.qualityImpact)?.label || "Not specified"}
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="flex gap-2.5 border-t border-border bg-surface-light px-6 py-4">
          <button onClick={handleCopy} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-3.5 text-[13px] font-semibold text-text-secondary">
            <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-3.5 text-[13px] font-semibold text-text-secondary">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-3.5 text-[13px] font-semibold text-primary-foreground">
            <Save className="h-4 w-4" /> Save
          </button>
        </footer>
      </div>
    </div>
  );
}
