"use client";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export const tabelaPrecoSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1).max(100),
  principal: z.enum(["S", "N"]).default("N"),
  coeficiente: z.union([z.number(), z.string()]).transform((v) => Number(v)),
});

export type TabelaPrecoFormValues = z.infer<typeof tabelaPrecoSchema>;

export function TabelaPrecoForm({ form }: { form: UseFormReturn<TabelaPrecoFormValues> }) {
  return (
    <Form {...form}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField name="nome" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )} />
        </div>
        <FormField name="principal" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Principal</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Sim</SelectItem>
                  <SelectItem value="N">Não</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )} />
        <FormField name="coeficiente" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Coeficiente</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" value={field.value as any} onChange={field.onChange} />
            </FormControl>
          </FormItem>
        )} />
      </div>
    </Form>
  );
}
