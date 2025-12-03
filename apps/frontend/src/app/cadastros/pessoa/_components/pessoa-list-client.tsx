"use client"

import { ListPageLayout } from "@/components/layout/list-page-layout"
import { ListPageSidebar } from "@/components/layout/list-page-sidebar"
import { ListPageContent } from "@/components/layout/list-page-content"
import { FloatingActionButton } from "@/components/layout/floating-action-button"
import { MobileListCard } from "@/components/layout/mobile-list-card"
import { DataTable } from "@/components/data-table/data-table"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
import { Plus, Download, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { columns, Pessoa } from "./columns"

interface PessoaListClientProps {
    data: Pessoa[]
}

export function PessoaListClient({ data }: PessoaListClientProps) {
    const router = useRouter()
    const { isMobile } = useMobileDetection()
    const [searchValue, setSearchValue] = useState("")

    // Filtrar dados baseado na busca
    const filteredData = data.filter((pessoa) =>
        pessoa.nome.toLowerCase().includes(searchValue.toLowerCase())
    )

    // Sidebar com ações e filtros
    const sidebar = (
        <ListPageSidebar
            searchPlaceholder="Filtrar por nome..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            actions={
                !isMobile && (
                    <Link href="/cadastros/pessoa/novo">
                        <Button className="w-full">
                            <Plus className="mr-2 size-4" />
                            Nova Pessoa
                        </Button>
                    </Link>
                )
            }
            bottomActions={
                <>
                    <Button variant="outline" className="w-full">
                        <Download className="mr-2 size-4" />
                        Exportar
                    </Button>
                    <Button variant="ghost" className="w-full">
                        <Settings className="mr-2 size-4" />
                        Configurações
                    </Button>
                </>
            }
        />
    )

    // Renderizar cards para mobile
    const renderMobileCards = () => (
        <div className="space-y-3 p-4">
            {filteredData.map((pessoa) => {
                const badges = []
                if (pessoa.eh_cliente === "S") badges.push({ label: "Cliente" })
                if (pessoa.eh_fornecedor === "S") badges.push({ label: "Fornecedor" })
                if (pessoa.eh_transportadora === "S")
                    badges.push({ label: "Transportadora" })
                if (pessoa.eh_colaborador === "S") badges.push({ label: "Colaborador" })
                if (pessoa.eh_contador === "S") badges.push({ label: "Contador" })

                return (
                    <MobileListCard
                        key={pessoa.id}
                        title={pessoa.nome}
                        subtitle={pessoa.email}
                        badges={badges}
                        onEdit={() => router.push(`/cadastros/pessoa/${pessoa.id}/editar`)}
                        onClick={() => router.push(`/cadastros/pessoa/${pessoa.id}/editar`)}
                    />
                )
            })}
            {filteredData.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    Nenhum resultado encontrado.
                </p>
            )}
        </div>
    )

    // Paginação (extraída do DataTable)
    const pagination = (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                {filteredData.length} registro(s) encontrado(s).
            </div>
        </div>
    )

    return (
        <PageContainer>
            <ListPageLayout sidebar={sidebar} mobileTitle="Ações - Pessoas">
                <ListPageContent
                    title="Pessoas"
                    description="Gerencie seus cadastros de pessoas."
                // pagination removido para usar o do DataTable
                >
                    {isMobile ? (
                        renderMobileCards()
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            createHref="/cadastros/pessoa/novo"
                            createText="Nova Pessoa"
                            canCreate={false} // Botão já está na sidebar
                        />
                    )}
                </ListPageContent>
            </ListPageLayout>

            {/* FAB para mobile */}
            {isMobile && (
                <FloatingActionButton
                    onClick={() => router.push("/cadastros/pessoa/novo")}
                    label="Nova Pessoa"
                />
            )}
        </PageContainer>
    )
}
