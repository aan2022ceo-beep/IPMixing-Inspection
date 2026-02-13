export const workflowStages = [
  { id: "design", title: "Design", icon: "Pencil", desc: "Initial observation & design" },
  { id: "plan", title: "Plan", icon: "ClipboardList", desc: "Planning corrective actions" },
  { id: "define", title: "Define", icon: "Search", desc: "Define problem scope" },
  { id: "analyze", title: "Analyze", icon: "Microscope", desc: "Root cause analysis" },
  { id: "evaluate", title: "Evaluate", icon: "Scale", desc: "Risk assessment" },
  { id: "improve", title: "Improve", icon: "TrendingUp", desc: "Implement solutions" },
  { id: "verify", title: "Verify", icon: "CheckCircle", desc: "Verify effectiveness" },
  { id: "validate", title: "Validate", icon: "Trophy", desc: "Final validation" },
] as const;

export const fiveMCategories = [
  { id: "man", title: "Man", icon: "User", description: "Human factors, skills, training", examples: "Operator error, fatigue, lack of training" },
  { id: "machine", title: "Machine", icon: "Cog", description: "Equipment & tools condition", examples: "Wear, malfunction, calibration" },
  { id: "method", title: "Method", icon: "ClipboardList", description: "Procedures & processes", examples: "SOP deviation, wrong sequence" },
  { id: "material", title: "Material", icon: "Package", description: "Raw materials & compounds", examples: "Quality, contamination, specs" },
  { id: "environment", title: "Environment", icon: "Thermometer", description: "Environment conditions", examples: "Temperature, humidity, dust" },
] as const;

export const riskLevels = [
  { value: "low", label: "Low", color: "bg-success", textColor: "text-success", icon: "check" },
  { value: "medium", label: "Medium", color: "bg-warning", textColor: "text-warning", icon: "alert-triangle" },
  { value: "high", label: "High", color: "bg-danger", textColor: "text-danger", icon: "alert-circle" },
  { value: "critical", label: "Critical", color: "bg-critical", textColor: "text-critical", icon: "ban" },
] as const;

export const priorityLevels = [
  { id: "high", label: "High", color: "bg-danger", textColor: "text-danger", borderColor: "border-danger", desc: "Immediate action required" },
  { id: "medium", label: "Medium", color: "bg-warning", textColor: "text-warning", borderColor: "border-warning", desc: "Action within 24 hours" },
  { id: "low", label: "Low", color: "bg-success", textColor: "text-success", borderColor: "border-success", desc: "Scheduled maintenance" },
] as const;

export const machineOptions = ["C1001", "C1002", "C1003", "C1005", "C1006", "C1007", "C1008"];
export const floorOptions = ["1", "1.5", "2", "2.5", "3", "4"];

export const abnormalTypes = [
  "Temperature Deviation",
  "Mixing Time Exceeded",
  "Viscosity Out of Spec",
  "Compound Contamination",
  "Equipment Malfunction",
  "Process Parameter Drift",
  "Quality Defect",
  "Safety Hazard",
  "Rotor Speed Variation",
  "Ram Pressure Abnormal",
];

export const qualityImpacts = [
  { id: "scrap", label: "Scrap/Reject", icon: "Trash2" },
  { id: "rework", label: "Rework Required", icon: "RefreshCw" },
  { id: "downgrade", label: "Downgrade", icon: "ArrowDown" },
  { id: "hold", label: "Hold for Review", icon: "Pause" },
  { id: "none", label: "No Impact", icon: "CheckCircle" },
] as const;

export const inspectionCategories = [
  {
    id: "area",
    title: "Area & Environment",
    icon: "Factory",
    description: "Floor, lighting, ventilation",
    isAbnormalProcess: false,
    checkpoints: ["Floor cleanliness", "Adequate lighting", "Ventilation working", "Emergency exits clear", "Walkways unobstructed"],
  },
  {
    id: "machines",
    title: "Machines & Equipment",
    icon: "Cog",
    description: "Abnormal Process Inspection",
    isAbnormalProcess: true,
    checkpoints: ["Safety guards in place", "Emergency stops functional", "No visible damage", "Proper lubrication", "Maintenance tags current"],
  },
  {
    id: "electrical",
    title: "Electrical",
    icon: "Zap",
    description: "Wiring, panels, LOTO",
    isAbnormalProcess: false,
    checkpoints: ["Panel doors closed", "No exposed wiring", "LOTO followed", "Grounding intact", "No burn marks/smell"],
  },
  {
    id: "chemical",
    title: "Chemical Handling",
    icon: "FlaskConical",
    description: "Storage, labeling, MSDS",
    isAbnormalProcess: false,
    checkpoints: ["Proper labeling", "MSDS available", "Spill kits accessible", "Containers sealed", "Storage compliance"],
  },
  {
    id: "ppe",
    title: "PPE & Safe Behavior",
    icon: "HardHat",
    description: "Equipment usage, practices",
    isAbnormalProcess: false,
    checkpoints: ["Safety glasses worn", "Hearing protection", "Safety shoes", "Gloves when required", "No horseplay"],
  },
] as const;

export const shifts = ["Morning (08:00-16:00)", "Afternoon (16:00-00:00)", "Night (00:00-08:00)"];

export const maintenanceChecklist = [
  { id: "inspection", label: "Visual inspection completed", icon: "Eye" },
  { id: "cleaning", label: "Cleaning performed", icon: "Sparkles" },
  { id: "lubrication", label: "Lubrication checked/applied", icon: "Droplets" },
  { id: "calibration", label: "Calibration verified", icon: "Ruler" },
  { id: "testing", label: "Functional testing done", icon: "Zap" },
  { id: "safety", label: "Safety devices verified", icon: "Shield" },
  { id: "documentation", label: "Documentation updated", icon: "FileText" },
] as const;

export const commonSpareParts = [
  { id: "bearing", name: "Bearing", unit: "pcs" },
  { id: "seal", name: "Oil Seal", unit: "pcs" },
  { id: "belt", name: "V-Belt", unit: "pcs" },
  { id: "filter", name: "Filter Element", unit: "pcs" },
  { id: "gasket", name: "Gasket", unit: "pcs" },
  { id: "sensor", name: "Sensor", unit: "pcs" },
  { id: "valve", name: "Valve", unit: "pcs" },
  { id: "motor", name: "Motor", unit: "unit" },
  { id: "pump", name: "Pump", unit: "unit" },
  { id: "hose", name: "Hydraulic Hose", unit: "meter" },
  { id: "other", name: "Other", unit: "pcs" },
] as const;

export const estimatedTimeOptions = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
  { value: 480, label: "8 hours" },
  { value: 1440, label: "1 day" },
  { value: 2880, label: "2 days" },
] as const;

export const STORAGE_KEYS = {
  INSPECTION_DATA: "mixing_inspection_data",
  ABNORMAL_DATA: "mixing_abnormal_data",
  PHOTOS: "mixing_photos",
  SAVED_INSPECTIONS: "mixing_saved_inspections",
} as const;

export const CASE_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
} as const;
