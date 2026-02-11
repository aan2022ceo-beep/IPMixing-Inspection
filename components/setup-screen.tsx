"use client";

import type { InspectionData } from "@/lib/types";
import { shifts } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft, ClipboardList, Calendar, Clock, User } from "lucide-react";

interface SetupScreenProps {
  inspectionData: InspectionData;
  setInspectionData: React.Dispatch<React.SetStateAction<InspectionData>>;
  onStart: () => void;
  onBack: () => void;
}

export function SetupScreen({ inspectionData, setInspectionData, onStart, onBack }: SetupScreenProps) {
  const valid = inspectionData.date && inspectionData.shift && inspectionData.inspector;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
        <button onClick={onBack} className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border bg-card text-xl">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-bold text-foreground">New Inspection</h1>
        <div className="w-[42px]" />
      </header>

      {/* Form */}
      <main className="mx-auto flex-1 overflow-y-auto px-5 py-6 w-full max-w-lg">
        <div className="mb-7 text-center">
          <ClipboardList className="mx-auto mb-3 h-12 w-12 text-primary" />
          <h2 className="text-2xl font-extrabold text-foreground">Inspection Details</h2>
          <p className="mt-2 text-sm text-muted-foreground">Fill in the inspection information</p>
        </div>

        {/* Date */}
        <div className="mb-5">
          <label className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <Calendar className="h-4 w-4" /> Date
          </label>
          <input
            type="date"
            value={inspectionData.date}
            onChange={(e) => setInspectionData((p) => ({ ...p, date: e.target.value }))}
            className="w-full rounded-[14px] border-2 border-border bg-card px-[18px] py-4 text-base text-foreground outline-none focus:border-primary"
          />
        </div>

        {/* Shift */}
        <div className="mb-5">
          <label className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <Clock className="h-4 w-4" /> Shift
          </label>
          <div className="flex gap-2.5">
            {shifts.map((s) => (
              <button
                key={s}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-[14px] border-2 px-3 py-4 text-sm font-semibold transition-colors",
                  inspectionData.shift === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-text-secondary hover:border-primary/50",
                )}
                onClick={() => setInspectionData((p) => ({ ...p, shift: s }))}
              >
                {s.split(" ")[0]}
                <span className="text-[10px] opacity-80">{s.match(/\(([^)]+)\)/)?.[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inspector */}
        <div className="mb-5">
          <label className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <User className="h-4 w-4" /> Inspector Name
          </label>
          <input
            type="text"
            value={inspectionData.inspector}
            onChange={(e) => setInspectionData((p) => ({ ...p, inspector: e.target.value }))}
            placeholder="Enter your name"
            className="w-full rounded-[14px] border-2 border-border bg-card px-[18px] py-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* Begin Button */}
        <button
          className={cn(
            "mt-6 w-full rounded-[14px] bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition-all",
            !valid && "cursor-not-allowed opacity-50",
          )}
          onClick={onStart}
          disabled={!valid}
        >
          Begin Inspection
        </button>
      </main>
    </div>
  );
}
