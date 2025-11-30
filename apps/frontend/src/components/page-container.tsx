import { ReactNode } from 'react';
import { DashboardLayout } from './layout/dashboard-layout';

interface PageContainerProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export function PageContainer({ title, description, children }: PageContainerProps) {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground mt-2">{description}</p>
                    )}
                </div>
                {children}
            </div>
        </DashboardLayout>
    );
}
