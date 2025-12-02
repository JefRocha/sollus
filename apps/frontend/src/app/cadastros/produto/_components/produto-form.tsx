"use client";
import { UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { produtoSchema, type ProdutoSchema } from "../produto.zod.schema";
import { useEffect, useState } from "react";

type Option = { id: number; nome: string; sigla?: string; descricao?: string };

function useOptions(resource: string, q: string) {
  const [items, setItems] = useState<Option[]>([]);
  useEffect(() => {
    let t: any;
    async function run() {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "";
        if (!base) return;
        const url = `${base}/${resource}?page=1&limit=100&filter=nome||$cont||${encodeURIComponent(q)}`;
        const r = await fetch(url, { cache: "no-store" });
        const j = await r.json().catch(() => []);
        const list = Array.isArray(j) ? j : Array.isArray(j?.data) ? j.data : Array.isArray(j?.content) ? j.content : [];
        setItems(list);
      } catch { }
    }
    t = setTimeout(run, 250);
    return () => clearTimeout(t);
  }, [resource, q]);
  return items;
}

export function ProdutoForm({ form }: { form: UseFormReturn<ProdutoSchema> }) {
  const [qSubgrupo, setQSubgrupo] = useState("");
  const [qMarca, setQMarca] = useState("");
  const [qUnidade, setQUnidade] = useState("");
  const [qIcms, setQIcms] = useState("");
  const [qGrupoTrib, setQGrupoTrib] = useState("");
  const subgrupos = useOptions("produto-subgrupo", qSubgrupo);
  const marcas = useOptions("produto-marca", qMarca);
  const unidades = useOptions("produto-unidade", qUnidade);
  const icmsCabs = useOptions("tribut-icms-custom-cab", qIcms);
  const gruposTrib = useOptions("tribut-grupo-tributario", qGrupoTrib);

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
        <FormField name="descricao" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl><Input {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField name="gtin" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>GTIN</FormLabel>
            <FormControl><Input {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField name="codigoInterno" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Código Interno</FormLabel>
            <FormControl><Input {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField name="valorCompra" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Valor Compra</FormLabel>
            <FormControl><Input type="number" step="0.01" value={field.value as any} onChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <FormField name="valorVenda" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Valor Venda</FormLabel>
            <FormControl><Input type="number" step="0.01" value={field.value as any} onChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <FormField name="codigoNcm" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>NCM</FormLabel>
            <FormControl><Input {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField name="dataCadastro" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Data Cadastro</FormLabel>
            <FormControl><Input type="date" value={field.value as any} onChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <FormField name="estoqueMinimo" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Estoque Mínimo</FormLabel>
            <FormControl><Input type="number" value={field.value as any} onChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <FormField name="estoqueMaximo" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Estoque Máximo</FormLabel>
            <FormControl><Input type="number" value={field.value as any} onChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <FormField name="quantidadeEstoque" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade Estoque</FormLabel>
            <FormControl><Input type="number" value={field.value as any} onChange={field.onChange} /></FormControl>
          </FormItem>
        )} />

        <div className="sm:col-span-2">
          <FormLabel>Subgrupo</FormLabel>
          <div className="flex gap-2">
            <Input placeholder="Filtrar..." value={qSubgrupo} onChange={(e) => setQSubgrupo(e.target.value)} />
            <Select value={String(form.getValues().produtoSubgrupoModel?.id ?? "0")} onValueChange={(v) => form.setValue("produtoSubgrupoModel", { id: Number(v) || undefined })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Selecione</SelectItem>
                {subgrupos.map((o) => (<SelectItem key={o.id} value={String(o.id)}>{o.nome}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="sm:col-span-2">
          <FormLabel>Marca</FormLabel>
          <div className="flex gap-2">
            <Input placeholder="Filtrar..." value={qMarca} onChange={(e) => setQMarca(e.target.value)} />
            <Select value={String(form.getValues().produtoMarcaModel?.id ?? "0")} onValueChange={(v) => form.setValue("produtoMarcaModel", { id: Number(v) || undefined })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Selecione</SelectItem>
                {marcas.map((o) => (<SelectItem key={o.id} value={String(o.id)}>{o.nome}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <FormLabel>Unidade</FormLabel>
          <div className="flex gap-2">
            <Input placeholder="Filtrar..." value={qUnidade} onChange={(e) => setQUnidade(e.target.value)} />
            <Select value={String(form.getValues().produtoUnidadeModel?.id ?? "0")} onValueChange={(v) => form.setValue("produtoUnidadeModel", { id: Number(v) || undefined })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Selecione</SelectItem>
                {unidades.map((o) => (<SelectItem key={o.id} value={String(o.id)}>{o.sigla || o.nome}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <FormLabel>ICMS Custom Cab</FormLabel>
          <div className="flex gap-2">
            <Input placeholder="Filtrar..." value={qIcms} onChange={(e) => setQIcms(e.target.value)} />
            <Select value={String(form.getValues().tributIcmsCustomCabModel?.id ?? "0")} onValueChange={(v) => form.setValue("tributIcmsCustomCabModel", { id: Number(v) || undefined })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Selecione</SelectItem>
                {icmsCabs.map((o) => (<SelectItem key={o.id} value={String(o.id)}>{o.descricao || o.nome}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="sm:col-span-2">
          <FormLabel>Grupo Tributário</FormLabel>
          <div className="flex gap-2">
            <Input placeholder="Filtrar..." value={qGrupoTrib} onChange={(e) => setQGrupoTrib(e.target.value)} />
            <Select value={String(form.getValues().tributGrupoTributarioModel?.id ?? "0")} onValueChange={(v) => form.setValue("tributGrupoTributarioModel", { id: Number(v) || undefined })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Selecione</SelectItem>
                {gruposTrib.map((o) => (<SelectItem key={o.id} value={String(o.id)}>{o.descricao || o.nome}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Form>
  );
}

