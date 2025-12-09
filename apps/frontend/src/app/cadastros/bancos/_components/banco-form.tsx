"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { bancoSchema, BancoSchema } from "../banco.zod.schema";
import { createBanco, updateBanco } from "../banco.service";

interface BancoFormProps {
  initialData?: BancoSchema;
}

export function BancoForm({ initialData }: BancoFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BancoSchema>({
    resolver: zodResolver(bancoSchema),
    defaultValues: initialData || {
      codigo: "",
      nome: "",
      url: "",
    },
  });

  async function onSubmit(values: BancoSchema) {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateBanco(initialData.id!, values);
        toast.success("Banco atualizado com sucesso!");
      } else {
        await createBanco(values);
        toast.success("Banco criado com sucesso!");
      }
      const v = searchParams?.get("view");
      const suffix = v === "cards" || v === "table" ? `?view=${v}` : "";
      router.push(`/cadastros/bancos${suffix}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar banco");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do banco" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.banco.com.br"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const v = searchParams?.get("view");
              const suffix = v === "cards" || v === "table" ? `?view=${v}` : "";
              router.push(`/cadastros/bancos${suffix}`);
            }}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
