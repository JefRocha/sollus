'use client';

import * as React from 'react';

import { Menu, LogOut, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { logoutAction } from '@/actions/auth';
import { useAction } from 'next-safe-action/hooks';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname();
    const { execute: executeLogout, isExecuting: isLoggingOut } = useAction(logoutAction, {
        onSuccess: () => {
            window.location.href = '/login';
        },
        onError: (error) => {
            console.error('Erro ao fazer logout:', error);
            window.location.href = '/login';
        }
    });

    const breadcrumbs = useMemo(() => {
        const paths = pathname.split('/').filter(Boolean);
        return paths.map((path, index) => ({
            label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
            href: '/' + paths.slice(0, index + 1).join('/'),
            isLast: index === paths.length - 1
        }));
    }, [pathname]);

    const handleLogout = async () => {
        await executeLogout();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b glass shadow-sm">
            <div className="flex h-16 items-center px-4 gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-primary/10 transition-smooth"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-4 flex-1">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Sollus ERP
                    </h1>

                    {breadcrumbs.length > 0 && (
                        <>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs.map((crumb, index) => (
                                        <React.Fragment key={crumb.href}>
                                            <BreadcrumbItem>
                                                {crumb.isLast ? (
                                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink href={crumb.href}>
                                                        {crumb.label}
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {!crumb.isLast && <BreadcrumbSeparator />}
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </>
                    )}
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar>
                                    <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Administrador</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        admin@sollus.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
