
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Code2,
  Users,
  Zap,
  Shield,
  BarChart3,
  Package,
  Calendar,
  BrainCircuit,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { getCurrentUser } from "../dashboard/dashboard.service";

export default async function SobrePage() {
  const user = await getCurrentUser();

  const features = [
    {
      icon: BarChart3,
      title: "Dashboards Inteligentes",
      description: "Visualização de dados em tempo real para decisões estratégicas"
    },
    {
      icon: TrendingUp,
      title: "Automações Financeiras",
      description: "Gestão automatizada de contas, fluxo de caixa e faturamento"
    },
    {
      icon: ShoppingBag,
      title: "Integração E-commerce",
      description: "Sincronização omnichannel de estoque e pedidos"
    },
    {
      icon: BrainCircuit,
      title: "IA Preditiva",
      description: "Insights avançados baseados em aprendizado de máquina"
    },
    {
      icon: Smartphone,
      title: "Nuvem e Mobile",
      description: "Acesso seguro de qualquer lugar, a qualquer momento"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Conformidade fiscal e proteção de dados rigorosa"
    }
  ];

  const benefits = [
    { title: "Operações Integradas", description: "Centralize todos os departamentos em uma única plataforma" },
    { title: "Eficiência e Produtividade", description: "Reduza o trabalho manual e erros operacionais" },
    { title: "Redução de Custos", description: "Otimize recursos e identifique gargalos financeiros" },
    { title: "Escalabilidade", description: "Uma solução que cresce junto com o seu negócio" }
  ];

  const techStack = [
    "TypeScript",
    "React 19",
    "Next.js 15",
    "NestJS",
    "PostgreSQL",
    "Tailwind CSS",
    "shadcn/ui"
  ];

  return (
    <DashboardLayout user={user || undefined} hideSidebar>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 max-w-7xl mx-auto">

        {/* 1. Hero / Introdução */}
        <div className="text-center space-y-6">
          <div className="relative w-40 h-40 mx-auto mb-2">
            <Image
              src="/logocs.png"
              alt="Logo CS Solutions"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent pb-2">
              Sollus ERP
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-foreground/90">
              Simplifique sua gestão e impulsione resultados
            </p>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Uma plataforma completa e moderna para integrar sua empresa de ponta a ponta,
            trazendo clareza, eficiência e crescimento para o seu negócio.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">Versão 1.0.0</Badge>
            <Link href="https://www.cssollutyons.com.br" target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-background/50 hover:bg-primary/10 transition-colors cursor-pointer">
                CS Solutions
              </Badge>
            </Link>
          </div>
        </div>

        {/* 2. Funcionalidades Modernas */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Funcionalidades Modernas
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border hover:border-primary/40 transition-all duration-300 hover:shadow-md group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* 3. Benefícios para o Negócio */}
        <div className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50">
          <h2 className="text-2xl font-bold mb-8 text-center">Por que escolher o Sollus ERP?</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-background border shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Sobre a CS Solutions & Tech info */}
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden border-l-4 border-l-primary/80">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Sobre a CS Solutions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A <strong>CS Solutions</strong> é uma empresa de tecnologia dedicada a criar soluções extraordinárias para gestão empresarial.
                Nosso propósito é simplificar a complexidade dos negócios através de software inteligente e intuitivo.
              </p>
              <p>
                Com um compromisso inabalável com a <strong>inovação, suporte de excelência e qualidade técnica</strong>,
                atuamos não apenas como fornecedores de software, mas como parceiros estratégicos de longo prazo para o crescimento dos nossos clientes.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Stack Tecnológico</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs hover:bg-secondary/80">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} CS Solutions. <br />Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

