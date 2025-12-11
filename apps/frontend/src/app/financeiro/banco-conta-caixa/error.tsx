"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer title="Erro" wrapWithDashboardLayout={false}>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Ocorreu um erro ao carregar os dados. Tente novamente.
        </AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button onClick={() => reset()}>Tentar novamente</Button>
      </div>
    </PageContainer>
  );
}
