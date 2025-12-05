"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";

import { CargoSchema, cargoSchema } from "../cargo.zod.schema";
import { Cargo } from "../cargo.service";
import {
  createCargoAction,
  updateCargoAction,
} from "@/actions/cadastros/cargo-actions";

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
import { MoneyInput } from "@/components/ui/money-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CargoFormProps {
  data?: Cargo;
}

export function CargoForm({ data }: CargoFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams?.get("view");
  const isEditing = !!data;

  const form = useForm<CargoSchema>({
    resolver: zodResolver(cargoSchema),
    defaultValues: data || {},
  });

  const { execute: execCreate, status: createStatus } = useAction(
    createCargoAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Cargo criado com sucesso!");
          router.push("/cadastros/cargo");
        }
      },
      onError: () => toast.error("Erro ao criar Cargo"),
    }
  );
  const { execute: execUpdate, status: updateStatus } = useAction(
    updateCargoAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Cargo atualizado com sucesso!");
          router.push("/cadastros/cargo");
        }
      },
      onError: () => toast.error("Erro ao atualizar Cargo"),
    }
  );
  const status = isEditing ? updateStatus : createStatus;
  const onSubmit = async (formData: CargoSchema) => {
    if (isEditing) {
      await execUpdate({ ...formData, id: data!.id });
    } else {
      await execCreate(formData);
    }
    const suffix = view === "cards" || view === "table" ? `?view=${view}` : "";
    router.push(`/cadastros/cargo${suffix}`);
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
              name="nome"
              render={({ field }) => (
                <FormItem className="col-span-12 col-md-8">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salario"
              render={({ field }) => (
                <FormItem className="col-span-12 col-md-4">
                  <FormLabel>Valor Salário</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="Valor Salário"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cbo1994"
              render={({ field }) => (
                <FormItem className="col-span-12 col-md-6">
                  <FormLabel>CBO 1994</FormLabel>
                  <FormControl>
                    <Input placeholder="CBO 1994" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cbo2002"
              render={({ field }) => (
                <FormItem className="col-span-12 col-md-6">
                  <FormLabel>CBO 2002</FormLabel>
                  <FormControl>
                    <Input placeholder="CBO 2002" {...field} />
                  </FormControl>

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
              const suffix =
                view === "cards" || view === "table" ? `?view=${view}` : "";
              router.push(`/cadastros/cargo${suffix}`);
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
