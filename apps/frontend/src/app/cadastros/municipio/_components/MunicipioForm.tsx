"use client";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

export const municipioSchema = z.object({ id: z.number().optional(), nome: z.string().min(1), codigoIbge: z.union([z.number(), z.string()]).transform((v) => Number(v)), uf: z.string().min(2).max(2) });
export type MunicipioFormValues = z.infer<typeof municipioSchema>;

export function MunicipioForm({ form }: { form: UseFormReturn<MunicipioFormValues> }) {
  return (
    <Form {...form}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField name="nome" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl><Input {...field} /></FormControl>
            </FormItem>
          )} />
        </div>
        <FormField name="codigoIbge" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Código IBGE</FormLabel>
            <FormControl><Input type="number" value={field.value as any} onChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <FormField name="uf" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>UF</FormLabel>
            <FormControl>
              <select className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={field.value} onChange={field.onChange}>
                {['', 'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'].map((u) => (<option key={u} value={u}>{u || 'Selecione'}</option>))}
              </select>
            </FormControl>
          </FormItem>
        )} />
      </div>
    </Form>
  );
}

