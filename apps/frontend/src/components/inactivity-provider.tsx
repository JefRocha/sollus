'use client';

import { useRouter } from 'next/navigation';
import { useInactivityTimeout } from '@/hooks/use-inactivity-timeout';
import { logoutAction } from '@/actions/auth';
import { useEffect } from 'react';

interface InactivityProviderProps {
    children: React.ReactNode;
}

export function InactivityProvider({ children }: InactivityProviderProps) {
    const router = useRouter();

    const { showWarning, secondsRemaining, resetTimer } = useInactivityTimeout({
        inactivityTimeout: 30 * 60 * 1000, // 30 minutos
        warningTimeout: 60 * 1000, // 60 segundos
        onLogout: async () => {
            try {
                await logoutAction();
            } catch (error) {
                console.error('Erro ao fazer logout:', error);
            }
            window.location.href = '/login';
        },
    });

    if (!showWarning) {
        return <>{children}</>;
    }

    return (
        <>
            {/* Modal de inatividade */}
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500 animate-in fade-in">
                <div className="flex flex-col items-center justify-center space-y-8 p-4 text-center">
                    <h2 className="text-3xl font-medium text-white/90">
                        Você será deslogado em:
                    </h2>

                    <div className="text-[15rem] font-black leading-none text-white tabular-nums tracking-tighter drop-shadow-2xl">
                        {secondsRemaining}
                    </div>

                    <p className="text-xl text-white/70 max-w-md">
                        Para sua segurança, você será desconectado automaticamente.
                    </p>

                    <button
                        onClick={resetTimer}
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/30 active:scale-95"
                    >
                        <span className="mr-2 text-xl">⚡</span>
                        <span className="text-lg">CONTINUAR CONECTADO</span>
                    </button>
                </div>
            </div>

            {children}
        </>
    );
}
