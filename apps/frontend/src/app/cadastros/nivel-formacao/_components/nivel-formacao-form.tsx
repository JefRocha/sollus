"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { NivelFormacaoSchema, nivelFormacaoSchema } from "../nivel-formacao.zod.schema";
import { NivelFormacao } from "../nivel-formacao.service";
import { createNivelFormacaoAction, updateNivelFormacaoAction } from '@/actions/cadastros/nivel-formacao';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NivelFormacaoFormProps {
    data?: NivelFormacao;
}

export function NivelFormacaoForm({ data }: NivelFormacaoFormProps) {
    const router = useRouter();
    const isEditing = !!data;

    const form = useForm<NivelFormacaoSchema>({
        resolver: zodResolver(nivelFormacaoSchema),
        defaultValues: data || {},
    });

    const onSubmit = async (formData: NivelFormacaoSchema) => {
        try {
            if (isEditing) {
                const result = await updateNivelFormacaoAction({ id: data.id, ...formData });
                if (result?.data?.success) {
                    toast.success("Nível de formação atualizado com sucesso!");
                } else {
                    toast.error(result?.data?.error || result?.serverError || "Erro ao atualizar nível de formação.");
                }
            } else {
                const result = await createNivelFormacaoAction(formData);
                if (result?.data?.success) {
                    toast.success("Nível de formação criado com sucesso!");
                } else {
                    toast.error(result?.data?.error || result?.serverError || "Erro ao criar nível de formação.");
                }
            }
            router.push("/cadastros/nivel-formacao");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Ocorreu um erro ao salvar. Tente novamente.");
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
                                <FormItem className="col-span-12">
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
                                        <Input placeholder="Descrição" {...field} value={field.value || ""} />
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
