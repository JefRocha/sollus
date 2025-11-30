"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { UsuarioSchema, usuarioSchema } from "../usuario.zod.schema";
import { createUsuario, updateUsuario, Usuario } from "../usuario.service";

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

interface UsuarioFormProps {
  data?: Usuario;
}

export function UsuarioForm({ data }: UsuarioFormProps) {
  const router = useRouter();
  const isEditing = !!data;

  const form = useForm<UsuarioSchema>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: data || {},
  });

  const onSubmit = async (formData: UsuarioSchema) => {
    try {
      if (isEditing) {
        await updateUsuario(data.id, formData);
        toast.success("Usuario atualizado com sucesso!");
      } else {
        await createUsuario(formData);
        toast.success("Usuario criado com sucesso!");
      }
      router.push("/usuario");
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
              name="idColaborador"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Id Colaborador</FormLabel>
                  <FormControl>
                    <Input placeholder="Id Colaborador" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insira o Id Colaborador.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idPapel"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Papel</FormLabel>
                  <FormControl>
                    <Input placeholder="Papel" {...field} />
                  </FormControl>
                  <FormDescription>
                    Papel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Login</FormLabel>
                  <FormControl>
                    <Input placeholder="Login" {...field} />
                  </FormControl>
                  <FormDescription>
                    Login
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Senha" {...field} />
                  </FormControl>
                  <FormDescription>
                    Senha
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="administrador"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>É Administrador</FormLabel>
                  <FormControl>
                    <Input placeholder="É Administrador" {...field} />
                  </FormControl>
                  <FormDescription>
                    É Administrador
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataCadastro"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Data de Cadastro</FormLabel>
                  <FormControl>
                    <Input placeholder="Data de Cadastro" {...field} />
                  </FormControl>
                  <FormDescription>
                    Data de Cadastro
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
