"use client";

import { useState, useRef } from "react";
import type { InspectionData, AbnormalData, Photo } from "@/lib/types";
import {
  inspectionCategories,
  workflowStages,
  priorityLevels,
  abnormalTypes,
  fiveMCategories,
  qualityImpacts,
  riskLevels,
  machineOptions,
  floorOptions,
  STORAGE_KEYS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  Camera,
  Image as ImageIcon,
  Mic,
  X,
  ChevronLeft,
  ChevronRight,
  Factory,
  Cog,
  Zap,
  FlaskConical,
  HardHat,
  User,
  ClipboardList,
  Package,
  Thermometer,
  Search,
  Microscope,
  Scale,
  TrendingUp,
  CheckCircle,
  Trophy,
  Pencil,
  Trash2,
  RefreshCw,
  ArrowDown,
  Pause,
  AlertTriangle,
  AlertCircle,
  Ban,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  area: <Factory className="h-12 w-12 text-primary" />,
  machines: <Cog className="h-12 w-12 text-primary" />,
  electrical: <Zap className="h-12 w-12 text-primary" />,
  chemical: <FlaskConical className="h-12 w-12 text-primary" />,
  ppe: <HardHat className="h-12 w-12 text-primary" />,
};

const catNavIcons: Record<string, React.ReactNode> = {
  area: <Factory className="h-5 w-5" />,
  machines: <Cog className="h-5 w-5" />,
  electrical: <Zap className="h-5 w-5" />,
  chemical: <FlaskConical className="h-5 w-5" />,
  ppe: <HardHat className="h-5 w-5" />,
};

const workflowIcons: Record<string, React.ReactNode> = {
  design: <Pencil className="h-3.5 w-3.5" />,
  plan: <ClipboardList className="h-3.5 w-3.5" />,
  define: <Search className="h-3.5 w-3.5" />,
  analyze: <Microscope className="h-3.5 w-3.5" />,
  evaluate: <Scale className="h-3.5 w-3.5" />,
  improve: <TrendingUp className="h-3.5 w-3.5" />,
  verify: <CheckCircle className="h-3.5 w-3.5" />,
  validate: <Trophy className="h-3.5 w-3.5" />,
};

const fiveMIcons: Record<string, React.ReactNode> = {
  man: <User className="h-5 w-5" />,
  machine: <Cog className="h-5 w-5" />,
  method: <ClipboardList className="h-5 w-5" />,
  material: <Package className="h-5 w-5" />,
  environment: <Thermometer className="h-5 w-5" />,
};

const impactIcons: Record<string, React.ReactNode> = {
  scrap: <Trash2 className="h-5 w-5" />,
  rework: <RefreshCw className="h-5 w-5" />,
  downgrade: <ArrowDown className="h-5 w-5" />,
  hold: <Pause className="h-5 w-5" />,
  none: <CheckCircle className="h-5 w-5" />,
};

const riskIcons: Record<string, React.ReactNode> = {
  low: <Check className="h-4 w-4" />,
  medium: <AlertTriangle className="h-4 w-4" />,
  high: <AlertCircle className="h-4 w-4" />,
  critical: <Ban className="h-4 w-4" />,
};

interface InspectionScreenProps {
  inspectionData: InspectionData;
  updateCategory: (id: string, field: string, value: unknown) => void;
  abnormalData: AbnormalData;
  setAbnormalData: React.Dispatch<React.SetStateAction<AbnormalData>>;
  onComplete: () => void;
  onBack: () => void;
  onSave: () => Promise<void>;
  onSaveToList: (photos: Photo[]) => Promise<string>;
}

export function InspectionScreen({
  inspectionData,
  updateCategory,
  abnormalData,
  setAbnormalData,
  onComplete,
  onBack,
  onSave,
  onSaveToList,
}: InspectionScreenProps) {
  const [active, setActive] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [saveStatus, setSaveStatus] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const cat = inspectionCategories[active];
  const data = inspectionData.categories[cat?.id] || {};

  const savePhotosToStorage = (newPhotos: Photo[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(newPhotos));
    } catch (e) {
      console.error("Error saving photos:", e);
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos((prev) => {
          const newPhotos = [...prev, { id: Date.now() + Math.random(), url: event.target?.result as string, name: file.name, type: "camera" as const, category: cat.id }];
          savePhotosToStorage(newPhotos);
          return newPhotos;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos((prev) => {
          const newPhotos = [...prev, { id: Date.now() + Math.random(), url: event.target?.result as string, name: file.name, type: "gallery" as const, category: cat.id }];
          savePhotosToStorage(newPhotos);
          return newPhotos;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id: number) => {
    setPhotos((prev) => {
      const newPhotos = prev.filter((p) => p.id !== id);
      savePhotosToStorage(newPhotos);
      return newPhotos;
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave();
      savePhotosToStorage(photos);
      const newId = await onSaveToList(photos);
      setSavedId(newId);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (e) {
      console.error("Error saving inspection:", e);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      await onSave();
      savePhotosToStorage(photos);
      setSaveStatus("draft");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e) {
      console.error("Error saving draft:", e);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const currentCategoryPhotos = photos.filter((p) => p.category === cat.id);
  const allPhotosCount = photos.length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
        <button onClick={onBack} className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-foreground">Safety Inspection</h1>
          <span className="text-xs text-muted-foreground">
            {active + 1} of {inspectionCategories.length}
          </span>
        </div>
        <button onClick={onComplete} className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Check className="h-5 w-5" />
        </button>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-border">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((active + 1) / inspectionCategories.length) * 100}%` }} />
      </div>

      {/* Main */}
      <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {/* Category Nav */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {inspectionCategories.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-[14px] border-2 transition-all",
                i === active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground",
              )}
            >
              {catNavIcons[c.id]}
            </button>
          ))}
        </div>

        {/* Category Header */}
        <div className="mb-3 text-center">
          {categoryIcons[cat.id]}
          <h2 className="mt-2 text-[22px] font-extrabold text-foreground">{cat.title}</h2>
          <p className="text-[13px] text-muted-foreground">{cat.description}</p>
        </div>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
          {/* Quick Checklist */}
          <div className="rounded-[18px] border border-border bg-card p-[18px]">
            <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Quick Checklist</h3>
            {cat.checkpoints.map((cp, i) => (
              <label key={i} className="mb-2 flex cursor-pointer items-center gap-3 rounded-xl bg-surface-light p-3 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={data.checklistItems?.[cp] ?? true}
                  onChange={(e) => updateCategory(cat.id, "checklistItems", { ...data.checklistItems, [cp]: e.target.checked })}
                  className="h-[22px] w-[22px] accent-success"
                />
                <span>{cp}</span>
              </label>
            ))}
          </div>

          {/* Abnormal Process Sections */}
          {cat.isAbnormalProcess && (
            <>
              {/* Workflow Stage */}
              <div className="rounded-[18px] border border-border bg-card p-[18px]">
                <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Workflow Stage</h3>
                <p className="mb-3 text-xs italic text-muted-foreground">
                  Current: {workflowStages.find((s) => s.id === abnormalData.workflowStage)?.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {workflowStages.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setAbnormalData((p) => ({ ...p, workflowStage: s.id }))}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-semibold transition-colors",
                        abnormalData.workflowStage === s.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-surface-light text-muted-foreground",
                      )}
                    >
                      {workflowIcons[s.id]} {s.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Level */}
              <div className="rounded-[18px] border border-border bg-card p-[18px]">
                <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Priority Level</h3>
                <p className="mb-3 text-xs italic text-muted-foreground">
                  {abnormalData.priority
                    ? `Selected: ${priorityLevels.find((p) => p.id === abnormalData.priority)?.desc}`
                    : "Select priority for this issue"}
                </p>
                <div className="flex gap-2.5">
                  {priorityLevels.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setAbnormalData((prev) => ({ ...prev, priority: p.id }))}
                      className={cn(
                        "flex flex-1 flex-col items-center gap-1.5 rounded-[14px] border-2 px-3 py-3.5 transition-all",
                        abnormalData.priority === p.id
                          ? `${p.color} ${p.borderColor} text-primary-foreground`
                          : "border-border bg-card text-text-secondary",
                      )}
                    >
                      <span className="text-2xl">
                        {p.id === "high" && <AlertCircle className="h-6 w-6" />}
                        {p.id === "medium" && <AlertTriangle className="h-6 w-6" />}
                        {p.id === "low" && <CheckCircle className="h-6 w-6" />}
                      </span>
                      <span className="text-[13px] font-bold">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Abnormal Type */}
              <div className="rounded-[18px] border border-border bg-card p-[18px]">
                <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Abnormal Type</h3>
                <select
                  value={abnormalData.processType}
                  onChange={(e) => setAbnormalData((p) => ({ ...p, processType: e.target.value }))}
                  className="w-full cursor-pointer rounded-xl border-2 border-border bg-surface-light px-3.5 py-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                >
                  <option value="">Select abnormal type</option>
                  {abnormalTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {abnormalData.processType && (
                  <textarea
                    value={abnormalData.description}
                    onChange={(e) => setAbnormalData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the abnormal condition in detail..."
                    className="mt-3 w-full resize-none rounded-[14px] border-2 border-border bg-surface-light p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                    rows={2}
                  />
                )}
              </div>

              {/* 5M Root Cause Analysis */}
              <div className="rounded-[18px] border border-border bg-card p-[18px] lg:col-span-2">
                <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">5M Root Cause Analysis</h3>
                {fiveMCategories.map((m) => (
                  <div key={m.id} className="mb-2.5 rounded-xl bg-surface-light p-3.5">
                    <div className="mb-2.5 flex items-start gap-2.5">
                      <span className="rounded-lg bg-card p-2">{fiveMIcons[m.id]}</span>
                      <div className="flex flex-1 flex-col gap-0.5">
                        <strong className="text-sm">{m.title}</strong>
                        <span className="text-[11px] text-muted-foreground">{m.description}</span>
                      </div>
                    </div>
                    <textarea
                      value={abnormalData.fiveMAnalysis?.[m.id] || ""}
                      onChange={(e) => setAbnormalData((p) => ({ ...p, fiveMAnalysis: { ...p.fiveMAnalysis, [m.id]: e.target.value } }))}
                      placeholder={m.examples}
                      className="w-full resize-none rounded-lg border border-border bg-card p-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              {/* Quality Impact */}
              <div className="rounded-[18px] border border-border bg-card p-[18px]">
                <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Quality Impact</h3>
                <div className="grid grid-cols-3 gap-2">
                  {qualityImpacts.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setAbnormalData((p) => ({ ...p, qualityImpact: q.id }))}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-[11px] font-semibold transition-all",
                        abnormalData.qualityImpact === q.id
                          ? "border-primary bg-primary-light text-primary-dark"
                          : "border-border bg-surface-light text-text-secondary",
                      )}
                    >
                      {impactIcons[q.id]}
                      <span>{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Steps */}
              <div className="rounded-[18px] border border-border bg-card p-[18px]">
                <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Verification Steps</h3>
                <textarea
                  value={abnormalData.verification}
                  onChange={(e) => setAbnormalData((p) => ({ ...p, verification: e.target.value }))}
                  placeholder={"Check if corrective action implemented\nVerify process parameters restored"}
                  className="w-full resize-none rounded-[14px] border-2 border-border bg-surface-light p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  rows={3}
                />
              </div>

              {/* Validation & Closure */}
              <div className="rounded-[18px] border border-border bg-card p-[18px]">
                <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Validation & Closure</h3>
                <textarea
                  value={abnormalData.validation}
                  onChange={(e) => setAbnormalData((p) => ({ ...p, validation: e.target.value }))}
                  placeholder={"Validate effectiveness\nSign-off for closure"}
                  className="w-full resize-none rounded-[14px] border-2 border-border bg-surface-light p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Risk Level */}
          <div className="rounded-[18px] border border-border bg-card p-[18px]">
            <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Risk Level</h3>
            <div className="grid grid-cols-4 gap-2">
              {riskLevels.map((r) => (
                <button
                  key={r.value}
                  onClick={() => updateCategory(cat.id, "riskLevel", r.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3.5 text-[11px] font-semibold transition-all",
                    data.riskLevel === r.value ? `${r.color} border-transparent text-primary-foreground` : "border-border bg-surface-light text-text-secondary",
                  )}
                >
                  {riskIcons[r.value]}
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location & Findings */}
          <div className="rounded-[18px] border border-border bg-card p-[18px]">
            <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Location & Findings</h3>
            <div className="mb-3.5 grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  {cat.id === "chemical" ? "Chemical Name" : "Mesin"}
                </label>
                {cat.id === "chemical" ? (
                  <input
                    type="text"
                    value={data.machine || ""}
                    onChange={(e) => updateCategory(cat.id, "machine", e.target.value)}
                    placeholder="Enter chemical name..."
                    className="w-full rounded-[14px] border-2 border-border bg-card px-[18px] py-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  />
                ) : (
                  <select
                    value={data.machine || ""}
                    onChange={(e) => updateCategory(cat.id, "machine", e.target.value)}
                    className="w-full cursor-pointer rounded-xl border-2 border-border bg-surface-light px-3.5 py-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="">Select</option>
                    {machineOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  {cat.id === "chemical" ? "Area" : "Lantai"}
                </label>
                {cat.id === "chemical" ? (
                  <div className="flex gap-2">
                    {["A", "Q"].map((area) => (
                      <button
                        key={area}
                        onClick={() => updateCategory(cat.id, "floor", area)}
                        className={cn(
                          "flex-1 rounded-[10px] border-2 px-2 py-3 text-xs font-semibold transition-all",
                          data.floor === area ? "border-info bg-info text-primary-foreground" : "border-border bg-surface-light text-text-secondary",
                        )}
                      >
                        {area} Chemicals
                      </button>
                    ))}
                  </div>
                ) : (
                  <select
                    value={data.floor || ""}
                    onChange={(e) => updateCategory(cat.id, "floor", e.target.value)}
                    className="w-full cursor-pointer rounded-xl border-2 border-border bg-surface-light px-3.5 py-3.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="">Select</option>
                    {floorOptions.map((f) => (
                      <option key={f} value={f}>
                        Lantai {f}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <textarea
              value={data.findings || ""}
              onChange={(e) => updateCategory(cat.id, "findings", e.target.value)}
              placeholder={cat.id === "chemical" ? "Describe chemical handling findings..." : "Describe findings and observations..."}
              className="w-full resize-none rounded-[14px] border-2 border-border bg-surface-light p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              rows={3}
            />
          </div>

          {/* Evidence */}
          <div className="rounded-[18px] border border-border bg-card p-[18px]">
            <h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Evidence</h3>
            <input type="file" ref={fileInputRef} accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
            <input type="file" ref={galleryInputRef} accept="image/*" multiple onChange={handleGallerySelect} className="hidden" />
            <div className="flex gap-2.5">
              <button onClick={() => fileInputRef.current?.click()} className="flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-border bg-surface-light px-3 py-4 text-xs font-semibold text-text-secondary transition-colors hover:bg-border">
                <Camera className="h-4 w-4" /> Photo
              </button>
              <button onClick={() => galleryInputRef.current?.click()} className="flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-border bg-surface-light px-3 py-4 text-xs font-semibold text-text-secondary transition-colors hover:bg-border">
                <ImageIcon className="h-4 w-4" /> Gallery
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-border bg-surface-light px-3 py-4 text-xs font-semibold text-text-secondary transition-colors hover:bg-border">
                <Mic className="h-4 w-4" /> Voice
              </button>
            </div>
            {currentCategoryPhotos.length > 0 && (
              <div className="mt-3.5 grid grid-cols-3 gap-2.5">
                {currentCategoryPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl border-2 border-border">
                    <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                    <button onClick={() => removePhoto(photo.id)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {currentCategoryPhotos.length > 0 && (
              <p className="mt-2.5 text-center text-xs text-muted-foreground">{currentCategoryPhotos.length} photo(s) for this category</p>
            )}
          </div>

          {/* Save Section */}
          <div className="rounded-[18px] border border-border bg-card p-[18px] lg:col-span-2">
            <div className="mb-2 flex gap-2.5">
              <button 
                onClick={handleSaveDraft} 
                disabled={isSaving}
                className="flex-1 rounded-xl border-2 border-border bg-surface-light px-4 py-3.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : saveStatus === "draft" ? "Draft Saved!" : "Save Draft"}
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 rounded-xl bg-info px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-info/40 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : saveStatus === "saved" ? "Submitted!" : "Submit & Save"}
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {saveStatus === "error" 
                ? "Error saving inspection. Please try again."
                : saveStatus === "saved" && savedId
                ? `Saved as ${savedId}`
                : allPhotosCount > 0
                  ? `Total: ${allPhotosCount} photos across all categories`
                  : "Submit to add to tracking list"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-auto flex gap-3 pt-5">
          <button
            onClick={() => setActive((p) => p - 1)}
            disabled={active === 0}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-[14px] border-2 border-border bg-card px-4 py-4 text-[15px] font-semibold text-text-secondary transition-all",
              active === 0 && "cursor-not-allowed opacity-50",
            )}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <button
            onClick={() => (active === inspectionCategories.length - 1 ? onComplete() : setActive((p) => p + 1))}
            className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-primary px-4 py-4 text-[15px] font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition-all"
          >
            {active === inspectionCategories.length - 1 ? "Generate Report" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
