import { PageContainer } from "@/components/page-container";
import FinanceDashboard from "@/components/dashboard/FinanceDashboard";

export default function FinanceiroDashboardPage() {
  return (
    <PageContainer
      title="Dashboard Financeiro"
      description="Visão geral do módulo."
      wrapWithDashboardLayout={false}
      fullWidth
    >
      <FinanceDashboard />
    </PageContainer>
  );
}
