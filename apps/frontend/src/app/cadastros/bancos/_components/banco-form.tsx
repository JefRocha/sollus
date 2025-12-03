"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { bancoSchema, BancoSchema } from "../banco.zod.schema";
import { createBancoAction, updateBancoAction } from "@/actions/cadastros/banco-actions";

interface BancoFormProps {
  initialData?: BancoSchema;
}

export function BancoForm({ initialData }: BancoFormProps) {
  const router = useRouter();
  const form = useForm<BancoSchema>({
    resolver: zodResolver(bancoSchema),
    defaultValues: initialData || {
      codigo: "",
      nome: "",
      url: "",
    },
  });

  const { execute: executeCreate, status: createStatus } = useAction(createBancoAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Banco criado com sucesso!");
        router.push("/cadastros/bancos");
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const { execute: executeUpdate, status: updateStatus } = useAction(updateBancoAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Banco atualizado com sucesso!");
        router.push("/cadastros/bancos");
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const status = initialData ? updateStatus : createStatus;

  function onSubmit(values: BancoSchema) {
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
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={status === 'executing'}>
            {status === 'executing' ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}