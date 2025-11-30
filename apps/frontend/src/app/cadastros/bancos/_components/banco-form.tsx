"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

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
import { bancoSchema, Banco } from "@/lib/schemas/banco-schema";
import { createBanco, updateBanco } from "@/actions/cadastros/banco-actions";

interface BancoFormProps {
  initialData?: Banco;
}

export function BancoForm({ initialData }: BancoFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof bancoSchema>>({
    resolver: zodResolver(bancoSchema),
    defaultValues: initialData || {
      codigo: "",
      nome: "",
      url: "",
    },
  });

  const { execute: executeCreate, status: createStatus } = useAction(createBanco, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.success);
        router.push("/cadastros/bancos");
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const { execute: executeUpdate, status: updateStatus } = useAction(updateBanco, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.success);
        router.push("/cadastros/bancos");
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const status = initialData ? updateStatus : createStatus;

  function onSubmit(values: z.infer<typeof bancoSchema>) {
    if (initialData) {
      executeUpdate({ ...values, id: initialData.id! });
    } else {
      executeCreate(values);
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
                  <Input placeholder="https://www.banco.com.br" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={status === 'executing'}>
          {status === 'executing' ? "Salvando..." : "Salvar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="ml-2"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </form>
    </Form>
  );
}