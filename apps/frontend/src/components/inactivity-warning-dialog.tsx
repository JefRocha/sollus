'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface InactivityWarningDialogProps {
    open: boolean;
    secondsRemaining: number;
    onContinue: () => void;
}

export function InactivityWarningDialog({
    open,
    secondsRemaining,
    onContinue,
}: InactivityWarningDialogProps) {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sessão Inativa</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você será desconectado por inatividade em{' '}
                        <span className="font-bold text-destructive">
                            {secondsRemaining} segundo{secondsRemaining !== 1 ? 's' : ''}
                        </span>
                        .
                        <br />
                        <br />
                        Clique em "Continuar Conectado" para permanecer logado.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onContinue}>
                        Continuar Conectado
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
