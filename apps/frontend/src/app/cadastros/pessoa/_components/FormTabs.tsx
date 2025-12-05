"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { MaskedInput } from "@/components/ui/masked-input";
import {
  getNivelFormacao,
  getEstadoCivil,
  type OptionItem,
  type Pessoa,
} from "@/actions/cadastros/pessoa-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function FormTabs({
  value,
  onChange,
}: {
  value: Pessoa;
  onChange: (v: Pessoa) => void;
}) {
  const router = useRouter();
  const [tab, setTab] = useState("pessoa");
  const [nfQuery, setNfQuery] = useState("");
  const [ecQuery, setEcQuery] = useState("");
  const [nfOptions, setNfOptions] = useState<OptionItem[]>([]);
  const [ecOptions, setEcOptions] = useState<OptionItem[]>([]);
  const showFisica = value.tipo === "F";
  const showJuridica = value.tipo === "J";
  const showCliente = value.eh_cliente === "S";
  const showFornecedor = value.eh_fornecedor === "S";
  const showTransportadora = value.eh_transportadora === "S";
  const showColaborador = value.eh_colaborador === "S";
  const allowedTabs = [
    "pessoa",
    ...(showJuridica ? ["juridica"] : []),
    ...(showFisica ? ["fisica"] : []),
    ...(showCliente ? ["cliente"] : []),
    ...(showFornecedor ? ["fornecedor"] : []),
    ...(showTransportadora ? ["transportadora"] : []),
    ...(showColaborador ? ["colaborador"] : []),
    "contatos",
    "telefones",
    "enderecos",
  ];

  useEffect(() => {
    if (!allowedTabs.includes(tab)) setTab("pessoa");
  }, [tab, allowedTabs]);

  useEffect(() => {
    let t: any;
    async function load() {
      try {
        setNfOptions(await getNivelFormacao(nfQuery));
      } catch {}
    }
    t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [nfQuery]);

  useEffect(() => {
    let t: any;
    async function load() {
      try {
        setEcOptions(await getEstadoCivil(ecQuery));
      } catch {}
    }
    t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [ecQuery]);

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="pessoa">Pessoa</TabsTrigger>
        {showJuridica && (
          <TabsTrigger value="juridica">Pessoa Jurídica</TabsTrigger>
        )}
        {showFisica && <TabsTrigger value="fisica">Pessoa Física</TabsTrigger>}
        {showCliente && <TabsTrigger value="cliente">Cliente</TabsTrigger>}
        {showFornecedor && (
          <TabsTrigger value="fornecedor">Fornecedor</TabsTrigger>
        )}
        {showTransportadora && (
          <TabsTrigger value="transportadora">Transportadora</TabsTrigger>
        )}
        {showColaborador && (
          <TabsTrigger value="colaborador">Colaborador</TabsTrigger>
        )}
        <TabsTrigger value="contatos">Contatos</TabsTrigger>
        <TabsTrigger value="telefones">Telefones</TabsTrigger>
        <TabsTrigger value="enderecos">Endereços</TabsTrigger>
      </TabsList>

      <TabsContent value="pessoa">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={value.nome ?? ""}
              onChange={(e) => onChange({ ...value, nome: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
              value={value.tipo ?? "F"}
              onChange={(e) =>
                onChange({ ...value, tipo: e.target.value as Pessoa["tipo"] })
              }
            >
              <option value="F">Física</option>
              <option value="J">Jurídica</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Site</Label>
            <Input
              value={value.site ?? ""}
              onChange={(e) => onChange({ ...value, site: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={value.email ?? ""}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>É Cliente</Label>
            <select
              className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
              value={value.eh_cliente ?? "N"}
              onChange={(e) =>
                onChange({
                  ...value,
                  eh_cliente: e.target.value as Pessoa["eh_cliente"],
                })
              }
            >
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>É Fornecedor</Label>
            <select
              className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
              value={value.eh_fornecedor ?? "N"}
              onChange={(e) =>
                onChange({
                  ...value,
                  eh_fornecedor: e.target.value as Pessoa["eh_fornecedor"],
                })
              }
            >
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>É Transportadora</Label>
            <select
              className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
              value={value.eh_transportadora ?? "N"}
              onChange={(e) =>
                onChange({
                  ...value,
                  eh_transportadora: e.target
                    .value as Pessoa["eh_transportadora"],
                })
              }
            >
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>É Colaborador</Label>
            <select
              className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
              value={value.eh_colaborador ?? "N"}
              onChange={(e) =>
                onChange({
                  ...value,
                  eh_colaborador: e.target.value as Pessoa["eh_colaborador"],
                })
              }
            >
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>É Contador</Label>
            <select
              className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
              value={value.eh_contador ?? "N"}
              onChange={(e) =>
                onChange({
                  ...value,
                  eh_contador: e.target.value as Pessoa["eh_contador"],
                })
              }
            >
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
        </div>
      </TabsContent>

      {showJuridica && (
        <TabsContent value="juridica">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <MaskedInput
                mask="##.###.###/####-##"
                value={value.pessoaJuridicaModel?.cnpj ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaJuridicaModel: {
                      ...(value.pessoaJuridicaModel ?? {}),
                      cnpj: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Nome Fantasia</Label>
              <Input
                value={value.pessoaJuridicaModel?.nomeFantasia ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaJuridicaModel: {
                      ...(value.pessoaJuridicaModel ?? {}),
                      nomeFantasia: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Inscrição Estadual</Label>
              <Input
                value={value.pessoaJuridicaModel?.inscricaoEstadual ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaJuridicaModel: {
                      ...(value.pessoaJuridicaModel ?? {}),
                      inscricaoEstadual: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Inscrição Municipal</Label>
              <Input
                value={value.pessoaJuridicaModel?.inscricaoMunicipal ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaJuridicaModel: {
                      ...(value.pessoaJuridicaModel ?? {}),
                      inscricaoMunicipal: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data Constituição</Label>
              <Input
                type="date"
                value={value.pessoaJuridicaModel?.dataConstituicao ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaJuridicaModel: {
                      ...(value.pessoaJuridicaModel ?? {}),
                      dataConstituicao: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo Regime</Label>
              <select
                className="h-8 rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={value.pessoaJuridicaModel?.tipoRegime ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaJuridicaModel: {
                      ...(value.pessoaJuridicaModel ?? {}),
                      tipoRegime: e.target.value,
                    },
                  })
                }
              >
                <option value="">Selecione</option>
                <option value="1">1-Lucro Real</option>
                <option value="2">2-Lucro Presumido</option>
                <option value="3">3-Simples Nacional</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>CRT</Label>
              <select
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={value.pessoaJuridicaModel?.crt ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaJuridicaModel: {
                      ...(value.pessoaJuridicaModel ?? {}),
                      crt: e.target.value,
                    },
                  })
                }
              >
                <option value="">Selecione</option>
                <option value="1">1-Simples Nacional</option>
                <option value="2">2-Simples Nacional-Excesso</option>
                <option value="3">3-Regime Normal</option>
              </select>
            </div>
          </div>
        </TabsContent>
      )}
      {showFisica && (
        <TabsContent value="fisica">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Nível Formação</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Filtrar por nome..."
                  value={nfQuery}
                  onChange={(e) => setNfQuery(e.target.value)}
                />
                <select
                  className="h-8 rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                  value={value.pessoaFisicaModel?.nivelFormacaoModel?.id ?? 0}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      pessoaFisicaModel: {
                        ...(value.pessoaFisicaModel ?? {}),
                        nivelFormacaoModel: {
                          id: Number(e.target.value) || undefined,
                        },
                      },
                    })
                  }
                >
                  <option value={0}>Selecione</option>
                  {nfOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Estado Civil</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Filtrar por nome..."
                  value={ecQuery}
                  onChange={(e) => setEcQuery(e.target.value)}
                />
                <select
                  className="h-8 rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                  value={value.pessoaFisicaModel?.estadoCivilModel?.id ?? 0}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      pessoaFisicaModel: {
                        ...(value.pessoaFisicaModel ?? {}),
                        estadoCivilModel: {
                          id: Number(e.target.value) || undefined,
                        },
                      },
                    })
                  }
                >
                  <option value={0}>Selecione</option>
                  {ecOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>CPF</Label>
              <MaskedInput
                mask="###.###.###-##"
                value={value.pessoaFisicaModel?.cpf ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      cpf: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>RG</Label>
              <Input
                value={value.pessoaFisicaModel?.rg ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      rg: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Órgão RG</Label>
              <Input
                value={value.pessoaFisicaModel?.orgaoRg ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      orgaoRg: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data Emissão RG</Label>
              <Input
                type="date"
                value={value.pessoaFisicaModel?.dataEmissaoRg ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      dataEmissaoRg: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data Nascimento</Label>
              <Input
                type="date"
                value={value.pessoaFisicaModel?.dataNascimento ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      dataNascimento: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <select
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={value.pessoaFisicaModel?.sexo ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      sexo: e.target.value,
                    },
                  })
                }
              >
                <option value="">Selecione</option>
                <option value="0">Masculino</option>
                <option value="1">Feminino</option>
                <option value="2">Outro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Raça</Label>
              <select
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={value.pessoaFisicaModel?.raca ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      raca: e.target.value,
                    },
                  })
                }
              >
                <option value="">Selecione</option>
                <option value="0">Branco</option>
                <option value="1">Moreno</option>
                <option value="2">Negro</option>
                <option value="3">Pardo</option>
                <option value="4">Amarelo</option>
                <option value="5">Indígena</option>
                <option value="6">Outro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Nacionalidade</Label>
              <Input
                value={value.pessoaFisicaModel?.nacionalidade ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      nacionalidade: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Naturalidade</Label>
              <Input
                value={value.pessoaFisicaModel?.naturalidade ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      naturalidade: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Nome Pai</Label>
              <Input
                value={value.pessoaFisicaModel?.nomePai ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      nomePai: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Nome Mãe</Label>
              <Input
                value={value.pessoaFisicaModel?.nomeMae ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pessoaFisicaModel: {
                      ...(value.pessoaFisicaModel ?? {}),
                      nomeMae: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </TabsContent>
      )}
      {showCliente && (
        <TabsContent value="cliente">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tabela Preço</Label>
              <Input
                value={value.clienteModel?.tabelaPrecoModel?.nome ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    clienteModel: {
                      ...(value.clienteModel ?? {}),
                      tabelaPrecoModel: {
                        ...(value.clienteModel?.tabelaPrecoModel ?? {}),
                        nome: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Desde</Label>
              <Input
                type="date"
                value={value.clienteModel?.desde ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    clienteModel: {
                      ...(value.clienteModel ?? {}),
                      desde: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data Cadastro</Label>
              <Input
                type="date"
                value={value.clienteModel?.dataCadastro ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    clienteModel: {
                      ...(value.clienteModel ?? {}),
                      dataCadastro: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Taxa Desconto</Label>
              <Input
                type="number"
                value={(value.clienteModel?.taxaDesconto as number) ?? 0}
                onChange={(e) =>
                  onChange({
                    ...value,
                    clienteModel: {
                      ...(value.clienteModel ?? {}),
                      taxaDesconto: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Limite Crédito</Label>
              <Input
                type="number"
                value={(value.clienteModel?.limiteCredito as number) ?? 0}
                onChange={(e) =>
                  onChange({
                    ...value,
                    clienteModel: {
                      ...(value.clienteModel ?? {}),
                      limiteCredito: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Observação</Label>
              <Input
                value={value.clienteModel?.observacao ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    clienteModel: {
                      ...(value.clienteModel ?? {}),
                      observacao: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </TabsContent>
      )}
      {showFornecedor && (
        <TabsContent value="fornecedor">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Desde</Label>
              <Input
                type="date"
                value={value.fornecedorModel?.desde ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    fornecedorModel: {
                      ...(value.fornecedorModel ?? {}),
                      desde: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data Cadastro</Label>
              <Input
                type="date"
                value={value.fornecedorModel?.dataCadastro ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    fornecedorModel: {
                      ...(value.fornecedorModel ?? {}),
                      dataCadastro: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Observação</Label>
              <Input
                value={value.fornecedorModel?.observacao ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    fornecedorModel: {
                      ...(value.fornecedorModel ?? {}),
                      observacao: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </TabsContent>
      )}
      {showTransportadora && (
        <TabsContent value="transportadora">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Data Cadastro</Label>
              <Input
                type="date"
                value={value.transportadoraModel?.dataCadastro ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    transportadoraModel: {
                      ...(value.transportadoraModel ?? {}),
                      dataCadastro: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Observação</Label>
              <Input
                value={value.transportadoraModel?.observacao ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    transportadoraModel: {
                      ...(value.transportadoraModel ?? {}),
                      observacao: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </TabsContent>
      )}
      {showColaborador && (
        <TabsContent value="colaborador">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Os dados de colaborador são gerenciados no módulo Colaboradores.
            </p>
            <div className="flex items-center gap-2">
              {(value as any)?.colaboradorModel?.id ? (
                <Button
                  onClick={() =>
                    router.push(
                      `/cadastros/colaborador/${
                        (value as any).colaboradorModel.id
                      }/editar?view=table`
                    )
                  }
                >
                  Editar Colaborador
                </Button>
              ) : (
                <Button
                  onClick={() => router.push(`/cadastros/colaborador/novo`)}
                >
                  Criar Colaborador
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
      )}
      <TabsContent value="contatos">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Nome</Label>
              <Input value={""} onChange={() => {}} disabled />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              placeholder="Nome"
              value={""}
              onChange={() => {}}
              className="hidden"
            />
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={(value as any)._contatoNome ?? ""}
                onChange={(e) =>
                  onChange({ ...(value as any), _contatoNome: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={(value as any)._contatoEmail ?? ""}
                onChange={(e) =>
                  onChange({ ...(value as any), _contatoEmail: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Input
                value={(value as any)._contatoObs ?? ""}
                onChange={(e) =>
                  onChange({ ...(value as any), _contatoObs: e.target.value })
                }
              />
            </div>
            <button
              className="h-10 rounded-md border px-3"
              onClick={() => {
                const editingId = (value as any)._contatoEditId as
                  | number
                  | undefined;
                if (editingId) {
                  const list = (value.pessoaContatoModelList ?? []).map((x) =>
                    x.id === editingId
                      ? {
                          ...x,
                          nome: (value as any)._contatoNome || "",
                          email: (value as any)._contatoEmail || "",
                          observacao: (value as any)._contatoObs || "",
                        }
                      : x
                  );
                  onChange({
                    ...value,
                    pessoaContatoModelList: list,
                    _contatoEditId: undefined,
                    _contatoNome: "",
                    _contatoEmail: "",
                    _contatoObs: "",
                  } as any);
                } else {
                  const item = {
                    id: Date.now(),
                    nome: (value as any)._contatoNome || "",
                    email: (value as any)._contatoEmail || "",
                    observacao: (value as any)._contatoObs || "",
                    statusCrud: "C",
                  };
                  const list = [...(value.pessoaContatoModelList ?? []), item];
                  onChange({
                    ...value,
                    pessoaContatoModelList: list,
                    _contatoNome: "",
                    _contatoEmail: "",
                    _contatoObs: "",
                  } as any);
                }
              }}
            >
              {(value as any)._contatoEditId ? "Salvar" : "Adicionar"}
            </button>
          </div>
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">Id</th>
                  <th className="px-3 py-2 text-left">Nome</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Observação</th>
                  <th className="px-3 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(value.pessoaContatoModelList ?? []).map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{r.id}</td>
                    <td className="px-3 py-2">{r.nome}</td>
                    <td className="px-3 py-2">{r.email}</td>
                    <td className="px-3 py-2">{r.observacao}</td>
                    <td className="px-3 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md border">
                          ⋯
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              onChange({
                                ...(value as any),
                                _contatoEditId: r.id,
                                _contatoNome: r.nome || "",
                                _contatoEmail: r.email || "",
                                _contatoObs: r.observacao || "",
                              });
                            }}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              const list = (
                                value.pessoaContatoModelList ?? []
                              ).filter((x) => x.id !== r.id);
                              onChange({
                                ...value,
                                pessoaContatoModelList: list,
                              });
                            }}
                          >
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="telefones">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <select
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={(value as any)._foneTipo ?? "0"}
                onChange={(e) =>
                  onChange({ ...(value as any), _foneTipo: e.target.value })
                }
              >
                <option value="0">Fixo</option>
                <option value="1">Celular</option>
                <option value="2">Whatsapp</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Número</Label>
              <MaskedInput
                mask="(##)#####-####"
                value={(value as any)._foneNumero ?? ""}
                onChange={(e) =>
                  onChange({ ...(value as any), _foneNumero: e.target.value })
                }
              />
            </div>
            <button
              className="h-10 rounded-md border px-3"
              onClick={() => {
                const editingId = (value as any)._foneEditId as
                  | number
                  | undefined;
                if (editingId) {
                  const list = (value.pessoaTelefoneModelList ?? []).map((x) =>
                    x.id === editingId
                      ? {
                          ...x,
                          tipo: (value as any)._foneTipo || "0",
                          numero: (value as any)._foneNumero || "",
                        }
                      : x
                  );
                  onChange({
                    ...value,
                    pessoaTelefoneModelList: list,
                    _foneEditId: undefined,
                    _foneTipo: "0",
                    _foneNumero: "",
                  } as any);
                } else {
                  const item = {
                    id: Date.now(),
                    tipo: (value as any)._foneTipo || "0",
                    numero: (value as any)._foneNumero || "",
                    statusCrud: "C",
                  };
                  const list = [...(value.pessoaTelefoneModelList ?? []), item];
                  onChange({
                    ...value,
                    pessoaTelefoneModelList: list,
                    _foneTipo: "0",
                    _foneNumero: "",
                  } as any);
                }
              }}
            >
              {(value as any)._foneEditId ? "Salvar" : "Adicionar"}
            </button>
          </div>
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">Id</th>
                  <th className="px-3 py-2 text-left">Tipo</th>
                  <th className="px-3 py-2 text-left">Número</th>
                  <th className="px-3 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(value.pessoaTelefoneModelList ?? []).map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{r.id}</td>
                    <td className="px-3 py-2">{r.tipo}</td>
                    <td className="px-3 py-2">{r.numero}</td>
                    <td className="px-3 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md border">
                          ⋯
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              onChange({
                                ...(value as any),
                                _foneEditId: r.id,
                                _foneTipo: r.tipo || "0",
                                _foneNumero: r.numero || "",
                              });
                            }}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              const list = (
                                value.pessoaTelefoneModelList ?? []
                              ).filter((x) => x.id !== r.id);
                              onChange({
                                ...value,
                                pessoaTelefoneModelList: list,
                              });
                            }}
                          >
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="enderecos">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Logradouro</Label>
              <Input
                value={(value as any)._endLogradouro ?? ""}
                onChange={(e) =>
                  onChange({
                    ...(value as any),
                    _endLogradouro: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                value={(value as any)._endNumero ?? ""}
                onChange={(e) =>
                  onChange({ ...(value as any), _endNumero: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Complemento</Label>
              <Input
                value={(value as any)._endComplemento ?? ""}
                onChange={(e) =>
                  onChange({
                    ...(value as any),
                    _endComplemento: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                value={(value as any)._endBairro ?? ""}
                onChange={(e) =>
                  onChange({ ...(value as any), _endBairro: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                value={(value as any)._endCidade ?? ""}
                onChange={(e) =>
                  onChange({ ...(value as any), _endCidade: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>UF</Label>
              <select
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={(value as any)._endUf ?? ""}
                onChange={(e) =>
                  onChange({ ...(value as any), _endUf: e.target.value })
                }
              >
                {[
                  "",
                  "AC",
                  "AL",
                  "AM",
                  "AP",
                  "BA",
                  "CE",
                  "DF",
                  "ES",
                  "GO",
                  "MA",
                  "MG",
                  "MS",
                  "MT",
                  "PA",
                  "PB",
                  "PE",
                  "PI",
                  "PR",
                  "RJ",
                  "RN",
                  "RO",
                  "RR",
                  "RS",
                  "SC",
                  "SE",
                  "SP",
                  "TO",
                ].map((u) => (
                  <option key={u} value={u}>
                    {u || "Selecione"}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>CEP</Label>
              <MaskedInput
                mask="#####-###"
                value={(value as any)._endCep ?? ""}
                onChange={(e) =>
                  onChange({ ...(value as any), _endCep: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Município IBGE</Label>
              <Input
                type="number"
                value={(value as any)._endIbge ?? 0}
                onChange={(e) =>
                  onChange({
                    ...(value as any),
                    _endIbge: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Principal</Label>
              <select
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={(value as any)._endPrincipal ?? "N"}
                onChange={(e) =>
                  onChange({ ...(value as any), _endPrincipal: e.target.value })
                }
              >
                <option value="S">Sim</option>
                <option value="N">Não</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Entrega</Label>
              <select
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={(value as any)._endEntrega ?? "N"}
                onChange={(e) =>
                  onChange({ ...(value as any), _endEntrega: e.target.value })
                }
              >
                <option value="S">Sim</option>
                <option value="N">Não</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Cobrança</Label>
              <select
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={(value as any)._endCobranca ?? "N"}
                onChange={(e) =>
                  onChange({ ...(value as any), _endCobranca: e.target.value })
                }
              >
                <option value="S">Sim</option>
                <option value="N">Não</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Correspondência</Label>
              <select
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                value={(value as any)._endCorrespondencia ?? "N"}
                onChange={(e) =>
                  onChange({
                    ...(value as any),
                    _endCorrespondencia: e.target.value,
                  })
                }
              >
                <option value="S">Sim</option>
                <option value="N">Não</option>
              </select>
            </div>
            <button
              className="h-10 rounded-md border px-3"
              onClick={() => {
                const editingId = (value as any)._endEditId as
                  | number
                  | undefined;
                const item = {
                  id: editingId || Date.now(),
                  logradouro: (value as any)._endLogradouro || "",
                  numero: (value as any)._endNumero || "",
                  complemento: (value as any)._endComplemento || "",
                  bairro: (value as any)._endBairro || "",
                  cidade: (value as any)._endCidade || "",
                  uf: (value as any)._endUf || "",
                  cep: (value as any)._endCep || "",
                  municipioIbge: (value as any)._endIbge || null,
                  principal: (value as any)._endPrincipal || "N",
                  entrega: (value as any)._endEntrega || "N",
                  cobranca: (value as any)._endCobranca || "N",
                  correspondencia: (value as any)._endCorrespondencia || "N",
                  statusCrud: editingId ? "U" : "C",
                };
                if (editingId) {
                  const list = (value.pessoaEnderecoModelList ?? []).map((x) =>
                    x.id === editingId ? item : x
                  );
                  onChange({
                    ...value,
                    pessoaEnderecoModelList: list,
                    _endEditId: undefined,
                    _endLogradouro: "",
                    _endNumero: "",
                    _endComplemento: "",
                    _endBairro: "",
                    _endCidade: "",
                    _endUf: "",
                    _endCep: "",
                    _endIbge: 0,
                    _endPrincipal: "N",
                    _endEntrega: "N",
                    _endCobranca: "N",
                    _endCorrespondencia: "N",
                  } as any);
                } else {
                  const list = [...(value.pessoaEnderecoModelList ?? []), item];
                  onChange({
                    ...value,
                    pessoaEnderecoModelList: list,
                    _endLogradouro: "",
                    _endNumero: "",
                    _endComplemento: "",
                    _endBairro: "",
                    _endCidade: "",
                    _endUf: "",
                    _endCep: "",
                    _endIbge: 0,
                    _endPrincipal: "N",
                    _endEntrega: "N",
                    _endCobranca: "N",
                    _endCorrespondencia: "N",
                  } as any);
                }
              }}
            >
              {(value as any)._endEditId ? "Salvar" : "Adicionar"}
            </button>
          </div>
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">Id</th>
                  <th className="px-3 py-2 text-left">Logradouro</th>
                  <th className="px-3 py-2 text-left">Cidade</th>
                  <th className="px-3 py-2 text-left">UF</th>
                  <th className="px-3 py-2 text-left">CEP</th>
                  <th className="px-3 py-2 text-left">Principal</th>
                  <th className="px-3 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(value.pessoaEnderecoModelList ?? []).map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{r.id}</td>
                    <td className="px-3 py-2">{r.logradouro}</td>
                    <td className="px-3 py-2">{r.cidade}</td>
                    <td className="px-3 py-2">{r.uf}</td>
                    <td className="px-3 py-2">{r.cep}</td>
                    <td className="px-3 py-2">{r.principal}</td>
                    <td className="px-3 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md border">
                          ⋯
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              onChange({
                                ...(value as any),
                                _endEditId: r.id,
                                _endLogradouro: r.logradouro || "",
                                _endNumero: r.numero || "",
                                _endComplemento: r.complemento || "",
                                _endBairro: r.bairro || "",
                                _endCidade: r.cidade || "",
                                _endUf: r.uf || "",
                                _endCep: r.cep || "",
                                _endIbge: r.municipioIbge || 0,
                                _endPrincipal: r.principal || "N",
                                _endEntrega: r.entrega || "N",
                                _endCobranca: r.cobranca || "N",
                                _endCorrespondencia: r.correspondencia || "N",
                              });
                            }}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              const list = (
                                value.pessoaEnderecoModelList ?? []
                              ).filter((x) => x.id !== r.id);
                              onChange({
                                ...value,
                                pessoaEnderecoModelList: list,
                              });
                            }}
                          >
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
