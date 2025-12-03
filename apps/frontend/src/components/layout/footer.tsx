export function Footer() {
    return (
        <footer className="border-t py-2">
            <div className="container flex flex-col items-center justify-between gap-2 md:h-8 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © {new Date().getFullYear()} CS Solutions. Todos os direitos reservados.
                </p>
                <p className="text-center text-sm text-muted-foreground md:text-right">
                    Versão 1.0.0
                </p>
            </div>
        </footer>
    );
}
