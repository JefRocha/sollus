"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CargoSchema, cargoSchema } from "../cargo.zod.schema";
import { createCargo, updateCargo, Cargo } from "../cargo.service";

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
  const isEditing = !!data;

  const form = useForm<CargoSchema>({
    resolver: zodResolver(cargoSchema),
    defaultValues: data || {},
  });

  const onSubmit = async (formData: CargoSchema) => {
    try {
      if (isEditing) {
        await updateCargo(data.id, formData);
        toast.success("Cargo atualizado com sucesso!");
      } else {
        await createCargo(formData);
        toast.success("Cargo criado com sucesso!");
      }
      router.push("/cadastros/cargo");
      router.refresh(); // Garante que os dados na página de listagem sejam atualizados
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar. Tente novamente.");
      console.error(error);
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
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
