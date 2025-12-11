import { DashboardLayout } from "@/components/layout/dashboard-layout";
import FinanceDashboard from "@/components/dashboard/FinanceDashboard";

export default function DashboardFinanceiroPage() {
  return (
    <DashboardLayout hideSidebar>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <FinanceDashboard />
      </div>
    </DashboardLayout>
  );
}
