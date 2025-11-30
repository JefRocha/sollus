"use client";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

export const sindicatoSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1).max(100),
  observacao: z.string().max(255).optional(),
});

export type SindicatoFormValues = z.infer<typeof sindicatoSchema>;

export function SindicatoForm({ form }: { form: UseFormReturn<SindicatoFormValues> }) {
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
        <div className="sm:col-span-2">
          <FormField name="observacao" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )} />
        </div>
      </div>
    </Form>
  );
}
