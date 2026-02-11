export interface Photo {
  id: number;
  url: string;
  name: string;
  type: "camera" | "gallery";
  category: string;
}

export interface CategoryData {
  findings: string;
  riskLevel: string;
  machine: string;
  floor: string;
  checklistItems: Record<string, boolean>;
}

export interface InspectionData {
  date: string;
  shift: string;
  inspector: string;
  machine?: string;
  floor?: string;
  categories: Record<string, CategoryData>;
}

export interface AbnormalData {
  processType: string;
  workflowStage: string;
  priority: string;
  fiveMAnalysis: Record<string, string>;
  qualityImpact: string;
  verification: string;
  validation: string;
  description: string;
}

export interface MachineCase {
  checklist: Record<string, boolean>;
  replacedParts: ReplacedPart[];
  estimatedTime: number;
  actualTime: number | null;
  technicianNotes: string;
  technicianName: string;
  completedAt: string | null;
  updatedAt: string;
}

export interface ReplacedPart {
  id: number;
  partId: string;
  name: string;
  unit: string;
  qty: number;
  notes?: string;
}

export interface SavedInspection {
  id: string;
  date: string;
  shift: string;
  inspector: string;
  categories: Record<string, CategoryData>;
  abnormalData: AbnormalData;
  photos: Photo[];
  status: string;
  severity: string;
  createdAt: string;
  type: string;
  description: string;
  machine: string;
  floor: string;
  workflowStage: string;
  priority: string;
  qualityImpact: string;
  closedAt?: string;
  machineCase?: MachineCase;
}

export interface MaintenanceSubmitData {
  status: string;
  checklist: Record<string, boolean>;
  replacedParts: ReplacedPart[];
  estimatedTime: number;
  actualTime: number | null;
  technicianName: string;
  technicianNotes: string;
}
