import type { CategoryData } from "./types";

export const generateId = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `Mix-${day}/${month}/${year}-${seq}`;
};

export const determineStatus = (categories: Record<string, CategoryData>): string => {
  const risks = Object.values(categories).map((c) => c.riskLevel);
  if (risks.includes("critical")) return "open";
  if (risks.includes("high")) return "open";
  return "pending";
};

export const getHighestRisk = (categories: Record<string, CategoryData>): string => {
  const risks = Object.values(categories).map((c) => c.riskLevel);
  if (risks.includes("critical")) return "critical";
  if (risks.includes("high")) return "high";
  if (risks.includes("medium")) return "medium";
  return "low";
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "open":
      return "text-danger";
    case "in_progress":
      return "text-info";
    case "pending":
      return "text-warning";
    case "closed":
    case "completed":
      return "text-success";
    default:
      return "text-muted-foreground";
  }
};

export const getStatusBgColor = (status: string): string => {
  switch (status) {
    case "open":
      return "bg-danger";
    case "in_progress":
      return "bg-info";
    case "pending":
      return "bg-warning";
    case "closed":
    case "completed":
      return "bg-success";
    default:
      return "bg-muted-foreground";
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "in_progress":
      return "IN PROGRESS";
    case "closed":
    case "completed":
      return "CLOSED";
    default:
      return status?.toUpperCase();
  }
};

export const getRiskBgColor = (risk: string): string => {
  switch (risk) {
    case "critical":
      return "bg-critical";
    case "high":
      return "bg-danger";
    case "medium":
      return "bg-warning";
    case "low":
      return "bg-success";
    default:
      return "bg-muted-foreground";
  }
};
