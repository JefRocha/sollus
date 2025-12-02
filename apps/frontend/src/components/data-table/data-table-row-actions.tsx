'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    resource: string;
    resourceName: string;
    onDelete?: (id: number) => Promise<void>;
    canEdit?: boolean;
    canDelete?: boolean;
}

export function DataTableRowActions<TData>({
    row,
    resource,
    resourceName,
    onDelete,
    canEdit = true,
    canDelete = true,
}: DataTableRowActionsProps<TData>) {
    const router = useRouter();
    const data = row.original as any;

    const handleDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir este ${resourceName}?`)) {
            return;
        }

        try {
            if (onDelete) {
                await onDelete(data.id);
            }
            toast.success(`${resourceName} excluído com sucesso!`);
            router.refresh();
        } catch (error) {
            toast.error(`Erro ao excluir ${resourceName}`);
            console.error(error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canEdit && (
                    <DropdownMenuItem asChild>
                        <Link href={`${resource}/${data.id}`} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                )}
                {onDelete && canDelete && (
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-600 cursor-pointer"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
