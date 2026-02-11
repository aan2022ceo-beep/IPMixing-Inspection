"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { InspectionData, AbnormalData, SavedInspection, Photo, MaintenanceSubmitData } from "./types";
import { STORAGE_KEYS, inspectionCategories } from "./constants";
import { generateId, determineStatus, getHighestRisk } from "./helpers";

interface InspectionStore {
  currentView: string;
  setCurrentView: (view: string) => void;
  inspectionData: InspectionData;
  setInspectionData: React.Dispatch<React.SetStateAction<InspectionData>>;
  abnormalData: AbnormalData;
  setAbnormalData: React.Dispatch<React.SetStateAction<AbnormalData>>;
  savedInspections: SavedInspection[];
  setSavedInspections: React.Dispatch<React.SetStateAction<SavedInspection[]>>;
  showReport: boolean;
  setShowReport: (show: boolean) => void;
  startNewInspection: () => void;
  handleStart: () => void;
  updateCategory: (id: string, field: string, value: unknown) => void;
  calcSummary: () => { totalFindings: number; highRiskItems: number; riskBreakdown: Record<string, number> };
  saveToStorage: () => void;
  saveInspectionToList: (photos: Photo[]) => string;
  updateInspectionStatus: (id: string, newStatus: string) => void;
  updateMachineCase: (id: string, maintenanceData: MaintenanceSubmitData) => void;
  clearStorage: () => void;
}

const InspectionContext = createContext<InspectionStore | null>(null);

const defaultInspectionData: InspectionData = {
  date: new Date().toISOString().split("T")[0],
  shift: "",
  inspector: "",
  categories: {},
};

const defaultAbnormalData: AbnormalData = {
  processType: "",
  workflowStage: "design",
  priority: "",
  fiveMAnalysis: {},
  qualityImpact: "",
  verification: "",
  validation: "",
  description: "",
};

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [showReport, setShowReport] = useState(false);

  const [savedInspections, setSavedInspections] = useState<SavedInspection[]>([]);
  const [inspectionData, setInspectionData] = useState<InspectionData>(defaultInspectionData);
  const [abnormalData, setAbnormalData] = useState<AbnormalData>(defaultAbnormalData);

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const savedList = localStorage.getItem(STORAGE_KEYS.SAVED_INSPECTIONS);
      if (savedList) setSavedInspections(JSON.parse(savedList));

      const savedInspection = localStorage.getItem(STORAGE_KEYS.INSPECTION_DATA);
      if (savedInspection) setInspectionData(JSON.parse(savedInspection));

      const savedAbnormal = localStorage.getItem(STORAGE_KEYS.ABNORMAL_DATA);
      if (savedAbnormal) setAbnormalData(JSON.parse(savedAbnormal));
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
    setIsHydrated(true);
  }, []);

  const initCategories = useCallback(() => {
    const cats: Record<string, { findings: string; riskLevel: string; machine: string; floor: string; checklistItems: Record<string, boolean> }> = {};
    inspectionCategories.forEach((cat) => {
      cats[cat.id] = {
        findings: "",
        riskLevel: "low",
        machine: "",
        floor: "",
        checklistItems: cat.checkpoints.reduce((a, i) => ({ ...a, [i]: true }), {} as Record<string, boolean>),
      };
    });
    return cats;
  }, []);

  const handleStart = useCallback(() => {
    setInspectionData((p) => ({ ...p, categories: initCategories() }));
    setCurrentView("inspection");
  }, [initCategories]);

  const startNewInspection = useCallback(() => {
    setInspectionData({
      date: new Date().toISOString().split("T")[0],
      shift: "",
      inspector: "",
      machine: "",
      floor: "",
      categories: {},
    });
    setAbnormalData({ ...defaultAbnormalData });
    localStorage.removeItem(STORAGE_KEYS.INSPECTION_DATA);
    localStorage.removeItem(STORAGE_KEYS.ABNORMAL_DATA);
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
    setCurrentView("setup");
  }, []);

  const updateCategory = useCallback((id: string, field: string, value: unknown) => {
    setInspectionData((p) => ({
      ...p,
      categories: {
        ...p.categories,
        [id]: { ...p.categories[id], [field]: value },
      },
    }));
  }, []);

  const calcSummary = useCallback(() => {
    let totalFindings = 0;
    let highRiskItems = 0;
    const riskBreakdown: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    Object.values(inspectionData.categories).forEach((c) => {
      if (c.findings?.trim()) totalFindings++;
      riskBreakdown[c.riskLevel]++;
      if (c.riskLevel === "high" || c.riskLevel === "critical") highRiskItems++;
    });
    return { totalFindings, highRiskItems, riskBreakdown };
  }, [inspectionData.categories]);

  const saveToStorage = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.INSPECTION_DATA, JSON.stringify(inspectionData));
    localStorage.setItem(STORAGE_KEYS.ABNORMAL_DATA, JSON.stringify(abnormalData));
  }, [inspectionData, abnormalData]);

  const saveInspectionToList = useCallback(
    (photos: Photo[] = []) => {
      const newInspection: SavedInspection = {
        id: generateId(),
        date: inspectionData.date,
        shift: inspectionData.shift,
        inspector: inspectionData.inspector,
        categories: inspectionData.categories,
        abnormalData: abnormalData,
        photos: photos,
        status: determineStatus(inspectionData.categories),
        severity: getHighestRisk(inspectionData.categories),
        createdAt: new Date().toISOString(),
        type: abnormalData.processType || "General Inspection",
        description: abnormalData.description || "Safety inspection completed",
        machine: Object.values(inspectionData.categories).find((c) => c.machine)?.machine || "",
        floor: Object.values(inspectionData.categories).find((c) => c.floor)?.floor || "",
        workflowStage: abnormalData.workflowStage,
        priority: abnormalData.priority,
        qualityImpact: abnormalData.qualityImpact,
      };

      const updatedList = [newInspection, ...savedInspections];
      setSavedInspections(updatedList);
      localStorage.setItem(STORAGE_KEYS.SAVED_INSPECTIONS, JSON.stringify(updatedList));
      return newInspection.id;
    },
    [inspectionData, abnormalData, savedInspections],
  );

  const updateInspectionStatus = useCallback(
    (id: string, newStatus: string) => {
      const updatedList = savedInspections.map((ins) => {
        if (ins.id === id) {
          return {
            ...ins,
            status: newStatus,
            closedAt: newStatus === "closed" ? new Date().toISOString() : ins.closedAt,
          };
        }
        return ins;
      });
      setSavedInspections(updatedList);
      localStorage.setItem(STORAGE_KEYS.SAVED_INSPECTIONS, JSON.stringify(updatedList));
    },
    [savedInspections],
  );

  const updateMachineCase = useCallback(
    (id: string, maintenanceData: MaintenanceSubmitData) => {
      const updatedList = savedInspections.map((ins) => {
        if (ins.id === id) {
          return {
            ...ins,
            status: maintenanceData.status,
            machineCase: {
              ...ins.machineCase,
              checklist: maintenanceData.checklist,
              replacedParts: maintenanceData.replacedParts,
              estimatedTime: maintenanceData.estimatedTime,
              actualTime: maintenanceData.actualTime,
              technicianNotes: maintenanceData.technicianNotes,
              technicianName: maintenanceData.technicianName,
              completedAt: maintenanceData.status === "closed" ? new Date().toISOString() : null,
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return ins;
      });
      setSavedInspections(updatedList);
      localStorage.setItem(STORAGE_KEYS.SAVED_INSPECTIONS, JSON.stringify(updatedList));
    },
    [savedInspections],
  );

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.INSPECTION_DATA);
    localStorage.removeItem(STORAGE_KEYS.ABNORMAL_DATA);
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
    setInspectionData({ ...defaultInspectionData });
    setAbnormalData({ ...defaultAbnormalData });
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <InspectionContext.Provider
      value={{
        currentView,
        setCurrentView,
        inspectionData,
        setInspectionData,
        abnormalData,
        setAbnormalData,
        savedInspections,
        setSavedInspections,
        showReport,
        setShowReport,
        startNewInspection,
        handleStart,
        updateCategory,
        calcSummary,
        saveToStorage,
        saveInspectionToList,
        updateInspectionStatus,
        updateMachineCase,
        clearStorage,
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection() {
  const context = useContext(InspectionContext);
  if (!context) throw new Error("useInspection must be used within InspectionProvider");
  return context;
}
