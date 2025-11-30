"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

const colaboradorSchema = z.object({
  idPessoa: z.number().min(1, "Selecione uma pessoa"),
  idCargo: z.number().optional(),
  idSetor: z.number().optional(),
  idColaboradorSituacao: z.number().optional(),
  idTipoAdmissao: z.number().optional(),
  idColaboradorTipo: z.number().optional(),
  idSindicato: z.number().optional(),
  matricula: z.string().optional(),
  dataCadastro: z.string().optional(),
  dataAdmissao: z.string().optional(),
  dataDemissao: z.string().optional(),
  ctpsNumero: z.string().optional(),
  ctpsSerie: z.string().optional(),
  ctpsDataExpedicao: z.string().optional(),
  ctpsUf: z.string().optional(),
  observacao: z.string().optional(),
});

type ColaboradorFormData = z.infer<typeof colaboradorSchema>;

type Option = { id: number; nome: string };

function useOptions(resource: string) {
  const [items, setItems] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Client-side: usar variável de ambiente ou fallback
        const base = typeof window !== 'undefined'
          ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')
          : 'http://localhost:4000';
        const url = `${base}/${resource}`;
        console.log(`[useOptions] Carregando ${resource} de:`, url);

        const r = await fetch(url, {
          cache: "no-store",
          headers: {
            'Accept': 'application/json',
          }
        });

        console.log(`[useOptions] ${resource} - Status:`, r.status, r.statusText);

        if (!r.ok) {
          const errorText = await r.text().catch(() => 'Sem detalhes');
          console.error(`[useOptions] Erro HTTP ${r.status} ao carregar ${resource}:`, errorText);
          setItems([]);
          return;
        }

        const j = await r.json().catch((err) => {
          console.error(`[useOptions] Erro ao fazer parse JSON de ${resource}:`, err);
          return [];
        });
        const list = Array.isArray(j) ? j : [];
        console.log(`[useOptions] ${resource} carregado com sucesso:`, list.length, 'itens');
        if (list.length > 0) {
          console.log(`[useOptions] Exemplo de item:`, list[0]);
        }
        setItems(list);
      } catch (error) {
        console.error(`[useOptions] Erro ao carregar ${resource}:`, error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resource]);

  return { items, loading };
}

export function ColaboradorForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const { items: pessoas, loading: loadingPessoas } = useOptions("pessoa");
  const { items: cargos, loading: loadingCargos } = useOptions("cargo");
  const { items: setores, loading: loadingSetores } = useOptions("setor");
  const { items: situacoes, loading: loadingSituacoes } = useOptions("colaborador-situacao");
  const { items: tiposAdm, loading: loadingTiposAdm } = useOptions("tipo-admissao");
  const { items: tiposCol, loading: loadingTiposCol } = useOptions("colaborador-tipo");
  const { items: sindicatos, loading: loadingSindicatos } = useOptions("sindicato");

  const ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  return (
    <Tabs defaultValue="dados" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dados">Dados Principais</TabsTrigger>
        <TabsTrigger value="ctps">CTPS</TabsTrigger>
        <TabsTrigger value="observacoes">Observações</TabsTrigger>
      </TabsList>

      <TabsContent value="dados" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Colaborador</CardTitle>
            <CardDescription>Dados principais do colaborador</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pessoa">Pessoa *</Label>
              <Select
                value={value.pessoaModel?.id?.toString() || ""}
                onValueChange={(val) => onChange({ ...value, pessoaModel: { id: Number(val) } })}
              >
                <SelectTrigger id="pessoa">
                  <SelectValue placeholder={loadingPessoas ? "Carregando..." : "Selecione uma pessoa"} />
                </SelectTrigger>
                <SelectContent>
                  {pessoas.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select
                  value={value.cargoModel?.id?.toString() || ""}
                  onValueChange={(val) => onChange({ ...value, cargoModel: { id: Number(val) } })}
                >
                  <SelectTrigger id="cargo">
                    <SelectValue placeholder={loadingCargos ? "Carregando..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="setor">Setor</Label>
                <Select
                  value={value.setorModel?.id?.toString() || ""}
                  onValueChange={(val) => onChange({ ...value, setorModel: { id: Number(val) } })}
                >
                  <SelectTrigger id="setor">
                    <SelectValue placeholder={loadingSetores ? "Carregando..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {setores.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="situacao">Situação</Label>
                <Select
                  value={value.colaboradorSituacaoModel?.id?.toString() || ""}
                  onValueChange={(val) => onChange({ ...value, colaboradorSituacaoModel: { id: Number(val) } })}
                >
                  <SelectTrigger id="situacao">
                    <SelectValue placeholder={loadingSituacoes ? "Carregando..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {situacoes.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo Colaborador</Label>
                <Select
                  value={value.colaboradorTipoModel?.id?.toString() || ""}
                  onValueChange={(val) => onChange({ ...value, colaboradorTipoModel: { id: Number(val) } })}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder={loadingTiposCol ? "Carregando..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCol.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipoAdmissao">Tipo Admissão</Label>
                <Select
                  value={value.tipoAdmissaoModel?.id?.toString() || ""}
                  onValueChange={(val) => onChange({ ...value, tipoAdmissaoModel: { id: Number(val) } })}
                >
                  <SelectTrigger id="tipoAdmissao">
                    <SelectValue placeholder={loadingTiposAdm ? "Carregando..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposAdm.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sindicato">Sindicato</Label>
                <Select
                  value={value.sindicatoModel?.id?.toString() || ""}
                  onValueChange={(val) => onChange({ ...value, sindicatoModel: { id: Number(val) } })}
                >
                  <SelectTrigger id="sindicato">
                    <SelectValue placeholder={loadingSindicatos ? "Carregando..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sindicatos.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  value={value.matricula || ""}
                  onChange={(e) => onChange({ ...value, matricula: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dataCadastro">Data Cadastro</Label>
                <Input
                  id="dataCadastro"
                  type="date"
                  value={value.dataCadastro || ""}
                  onChange={(e) => onChange({ ...value, dataCadastro: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataAdmissao">Data Admissão</Label>
                <Input
                  id="dataAdmissao"
                  type="date"
                  value={value.dataAdmissao || ""}
                  onChange={(e) => onChange({ ...value, dataAdmissao: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dataDemissao">Data Demissão</Label>
                <Input
                  id="dataDemissao"
                  type="date"
                  value={value.dataDemissao || ""}
                  onChange={(e) => onChange({ ...value, dataDemissao: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ctps" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Dados da CTPS</CardTitle>
            <CardDescription>Informações da Carteira de Trabalho</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ctpsNumero">CTPS Número</Label>
                <Input
                  id="ctpsNumero"
                  value={value.ctpsNumero || ""}
                  onChange={(e) => onChange({ ...value, ctpsNumero: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctpsSerie">CTPS Série</Label>
                <Input
                  id="ctpsSerie"
                  value={value.ctpsSerie || ""}
                  onChange={(e) => onChange({ ...value, ctpsSerie: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ctpsDataExpedicao">Data Expedição</Label>
                <Input
                  id="ctpsDataExpedicao"
                  type="date"
                  value={value.ctpsDataExpedicao || ""}
                  onChange={(e) => onChange({ ...value, ctpsDataExpedicao: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctpsUf">UF</Label>
                <Select
                  value={value.ctpsUf || ""}
                  onValueChange={(val) => onChange({ ...value, ctpsUf: val })}
                >
                  <SelectTrigger id="ctpsUf">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ufs.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="observacoes" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
            <CardDescription>Informações adicionais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="observacao">Observação</Label>
              <textarea
                id="observacao"
                className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={value.observacao || ""}
                onChange={(e) => onChange({ ...value, observacao: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
