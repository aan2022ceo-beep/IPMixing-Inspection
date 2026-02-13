import { InspectionProvider } from "@/lib/inspection-store";
import { AppShell } from "@/components/app-shell";

export default function Page() {
  return (
    <InspectionProvider>
      <AppShell />
    </InspectionProvider>
  );
}
