import { InactivityProvider } from '@/components/inactivity-provider';

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <InactivityProvider>
            {children}
        </InactivityProvider>
    );
}
