"use client";

import { useInspection } from "@/lib/inspection-store";
import { HomeScreen } from "./home-screen";
import { SetupScreen } from "./setup-screen";
import { InspectionScreen } from "./inspection-screen";
import { AnalyticsDashboard } from "./analytics-dashboard";
import { ListScreen } from "./list-screen";
import { HistoryScreen } from "./history-screen";
import { ReportModal } from "./report-modal";

export function AppShell() {
  const {
    currentView,
    setCurrentView,
    inspectionData,
    abnormalData,
    showReport,
    setShowReport,
    calcSummary,
    savedInspections,
    startNewInspection,
    handleStart,
    setInspectionData,
    updateCategory,
    setAbnormalData,
    saveToStorage,
    saveInspectionToList,
    updateInspectionStatus,
    updateMachineCase,
  } = useInspection();

  const views: Record<string, React.ReactNode> = {
    home: <HomeScreen />,
    setup: (
      <SetupScreen
        inspectionData={inspectionData}
        setInspectionData={setInspectionData}
        onStart={handleStart}
        onBack={() => setCurrentView("home")}
      />
    ),
    inspection: (
      <InspectionScreen
        inspectionData={inspectionData}
        updateCategory={updateCategory}
        abnormalData={abnormalData}
        setAbnormalData={setAbnormalData}
        onComplete={() => setShowReport(true)}
        onBack={() => setCurrentView("setup")}
        onSave={saveToStorage}
        onSaveToList={saveInspectionToList}
      />
    ),
    analytics: <AnalyticsDashboard data={savedInspections} onBack={() => setCurrentView("home")} />,
    pending: (
      <ListScreen
        title="Pending Review"
        status="pending"
        data={savedInspections}
        onBack={() => setCurrentView("home")}
        onUpdateStatus={updateInspectionStatus}
        onUpdateMachineCase={updateMachineCase}
      />
    ),
    inProgress: (
      <ListScreen
        title="In Progress"
        status="in_progress"
        data={savedInspections}
        onBack={() => setCurrentView("home")}
        onUpdateStatus={updateInspectionStatus}
        onUpdateMachineCase={updateMachineCase}
      />
    ),
    completed: (
      <ListScreen
        title="Completed"
        status="closed"
        data={savedInspections}
        onBack={() => setCurrentView("home")}
        onUpdateStatus={updateInspectionStatus}
        onUpdateMachineCase={updateMachineCase}
      />
    ),
    openIssues: (
      <ListScreen
        title="Open Issues"
        status="open"
        data={savedInspections}
        onBack={() => setCurrentView("home")}
        onUpdateStatus={updateInspectionStatus}
        onUpdateMachineCase={updateMachineCase}
      />
    ),
    history: <HistoryScreen data={savedInspections} onBack={() => setCurrentView("home")} />,
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-background font-sans">
      {views[currentView] || views.home}
      {showReport && (
        <ReportModal
          inspectionData={inspectionData}
          abnormalData={abnormalData}
          summary={calcSummary()}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
