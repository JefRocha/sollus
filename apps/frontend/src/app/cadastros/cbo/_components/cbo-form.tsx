"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { CboSchema, cboSchema } from "../cbo.zod.schema";
import { Cbo } from "../cbo.service";
import { createCboAction, updateCboAction } from "@/actions/cbo";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CboFormProps {
  data?: Cbo;
}

export function CboForm({ data }: CboFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<CboSchema>({
    resolver: zodResolver(cboSchema),
    defaultValues:
      {
        ...data,
        observacao: data?.observacao ?? "",
        codigo: data?.codigo ?? "",
        codigo1994: data?.codigo1994 ?? "",
        nome: data?.nome ?? "",
      } || {},
  });

  const { execute: executeCreate, status: createStatus } = useAction(
    createCboAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Cbo criado com sucesso!");
          redirectBack();
        }
        if (data?.error) toast.error(data.error);
      },
      onError: (error) => console.error(error),
    }
  );

  const { execute: executeUpdate, status: updateStatus } = useAction(
    updateCboAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Cbo atualizado com sucesso!");
          redirectBack();
        }
        if (data?.error) toast.error(data.error);
      },
      onError: (error) => console.error(error),
    }
  );

  const status = data ? updateStatus : createStatus;

  function redirectBack() {
    const v = searchParams?.get("view");
    const suffix = v === "cards" || v === "table" ? `?view=${v}` : "";
    router.push(`/cadastros/cbo${suffix}`);
    router.refresh();
  }

  const onSubmit = (formData: CboSchema) => {
    if (data) {
      executeUpdate({ ...formData, id: data.id });
    } else {
      executeCreate(formData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-12 gap-4">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>código cbo 2002</FormLabel>
                  <FormControl>
                    <Input placeholder="código cbo 2002" {...field} />
                  </FormControl>
                  <FormDescription>código cbo 2002</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigo1994"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>código cbo 1994</FormLabel>
                  <FormControl>
                    <Input placeholder="código cbo 1994" {...field} />
                  </FormControl>
                  <FormDescription>código cbo 1994</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>nome</FormLabel>
                  <FormControl>
                    <Input placeholder="nome" {...field} />
                  </FormControl>
                  <FormDescription>nome</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>observação</FormLabel>
                  <FormControl>
                    <Input placeholder="observação" {...field} />
                  </FormControl>
                  <FormDescription>observação</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const v = searchParams?.get("view");
              const suffix = v === "cards" || v === "table" ? `?view=${v}` : "";
              router.push(`/cadastros/cbo${suffix}`);
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={status === "executing"}>
            {status === "executing" ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
