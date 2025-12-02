import { ReactNode } from 'react';
import { DashboardLayout } from './layout/dashboard-layout';
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

export function PageContainer({ title, description, children }: PageContainerProps) {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="overflow-hidden shadow-md border-border/40">
                    <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent flex items-center min-h-[120px] m-6">
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-bold">
                                {title}
                            </CardTitle>
                            {description && (
                                <CardDescription className="text-base">
                                    {description}
                                </CardDescription>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-1">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}