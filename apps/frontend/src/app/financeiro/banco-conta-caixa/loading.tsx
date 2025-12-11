import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/page-container";

export default function Loading() {
  return (
    <PageContainer wrapWithDashboardLayout={false}>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </PageContainer>
  );
}
