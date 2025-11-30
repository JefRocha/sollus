"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TipoAdmissaoForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label>Nome</Label>
        <Input value={value.nome ?? ""} onChange={(e) => onChange({ ...value, nome: e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <Label>Observação</Label>
        <Input value={value.observacao ?? ""} onChange={(e) => onChange({ ...value, observacao: e.target.value })} />
      </div>
    </div>
  );
}

