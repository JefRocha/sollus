"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CboSchema, cboSchema } from "../cbo.zod.schema";
import { createCbo, updateCbo, Cbo } from "../cbo.service";

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
  const isEditing = !!data;

  const form = useForm<CboSchema>({
    resolver: zodResolver(cboSchema),
    defaultValues: data || {},
  });

  const onSubmit = async (formData: CboSchema) => {
    try {
      if (isEditing) {
        await updateCbo(data.id, formData);
        toast.success("Cbo atualizado com sucesso!");
      } else {
        await createCbo(formData);
        toast.success("Cbo criado com sucesso!");
      }
      router.push("/cbo");
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
              name="codigo"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>código cbo 2002</FormLabel>
                  <FormControl>
                    <Input placeholder="código cbo 2002" {...field} />
                  </FormControl>
                  <FormDescription>
                    código cbo 2002
                  </FormDescription>
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
                  <FormDescription>
                    código cbo 1994
                  </FormDescription>
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
                  <FormDescription>
                    nome
                  </FormDescription>
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
                  <FormDescription>
                    observação
                  </FormDescription>
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
