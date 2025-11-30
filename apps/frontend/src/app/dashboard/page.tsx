import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Bem-vindo ao Sollus ERP
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-sm font-medium text-muted-foreground">Total de Vendas</h3>
                            <p className="text-2xl font-bold">R$ 0,00</p>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-sm font-medium text-muted-foreground">Clientes</h3>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-sm font-medium text-muted-foreground">Produtos</h3>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-sm font-medium text-muted-foreground">Pedidos Pendentes</h3>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
