import { ReactNode } from "react";
import { DashboardLayout } from "./layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PageContainer({
  title,
  description,
  children,
}: PageContainerProps) {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Card className="flex-1 flex flex-col gap-0 overflow-hidden shadow-md border-border/40 py-0">
          <CardHeader className="rounded-md bg-gradient-to-br from-primary/20 to-transparent flex items-center min-h-0 px-6 py-2 shrink-0">
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold">{title}</CardTitle>
              {description && (
                <CardDescription className="text-base">
                  {description}
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-3 px-6 pb-4 overflow-hidden flex flex-col">
            {children}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
