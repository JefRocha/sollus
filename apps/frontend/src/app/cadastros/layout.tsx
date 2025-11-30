import { InactivityProvider } from '@/components/inactivity-provider';

export default function CadastrosLayout({
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
