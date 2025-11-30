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
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#ff0000',
                    zIndex: 2147483647,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '50px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        border: '10px solid #dc2626',
                        maxWidth: '600px'
                    }}
                >
                    <div style={{ fontSize: '120px' }}>⚠️</div>
                    <h1 style={{
                        fontSize: '48px',
                        color: '#dc2626',
                        margin: '20px 0',
                        fontWeight: 'bold'
                    }}>
                        ATENÇÃO!
                    </h1>
                    <p style={{ fontSize: '24px', margin: '20px 0' }}>
                        Logout em:
                    </p>
                    <div style={{
                        fontSize: '150px',
                        fontWeight: 'bold',
                        color: '#dc2626',
                        margin: '30px 0'
                    }}>
                        {secondsRemaining}
                    </div>
                    <button
                        onClick={resetTimer}
                        style={{
                            padding: '30px 60px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        CONTINUAR CONECTADO
                    </button>
                </div>
            </div>

            {children}
        </>
    );
}
