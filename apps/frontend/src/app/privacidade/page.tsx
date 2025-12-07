"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacidadePage() {
    const router = useRouter();

    const handlePrint = () => {
        window.print();
    };

    return (
        <DashboardLayout hideSidebar>
            <div className="container mx-auto py-8 px-4 max-w-4xl print:max-w-none print:p-0">
                <div className="mb-6 flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} title="Voltar">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Privacidade</h1>
                    </div>
                    <Button onClick={handlePrint} variant="outline" className="gap-2">
                        <Printer className="w-4 h-4" />
                        Gerar PDF
                    </Button>
                </div>

                <Card className="print:shadow-none print:border-none" id="printable-content">
                    <CardHeader className="print:hidden">
                        <CardTitle>Política de Privacidade — CS Solutions</CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none space-y-6 print:p-0">
                        <div className="print:block hidden mb-8 text-center">
                            <h1 className="text-2xl font-bold">Política de Privacidade — CS Solutions</h1>
                            <p className="text-sm text-gray-500">Documento gerado em {new Date().toLocaleDateString()}</p>
                        </div>

                        <section>
                            <p><strong>Atualizado em:</strong> {new Date().toLocaleDateString()}</p>
                            <p>
                                A <strong>CS Solutions</strong>, desenvolvedora do sistema <strong>Sollus ERP</strong>, respeita e protege a privacidade e os dados tratados em suas plataformas. Esta Política de Privacidade tem por objetivo esclarecer o papel da CS Solutions como fornecedora de tecnologia <strong>B2B (business-to-business)</strong> e <strong>operadora de dados pessoais</strong> conforme definido na Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Papel da CS Solutions no tratamento de dados</h2>
                            <p>
                                A CS Solutions atua como <strong>operadora de dados</strong>, ou seja, processa dados pessoais <strong>em nome de seus clientes empresariais</strong>, que são os <strong>controladores dos dados</strong>.
                            </p>
                            <p>
                                Toda coleta, inserção ou gestão de dados pessoais nas soluções desenvolvidas (como o Sollus ERP) é feita diretamente pelos nossos clientes. Não realizamos coletas diretas de dados dos titulares finais (ex: consumidores, colaboradores ou fornecedores dos clientes).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. Finalidade do tratamento</h2>
                            <p>Tratamos os dados exclusivamente para:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Executar os serviços contratados pelos clientes (armazenamento, processamento, exibição e organização de dados dentro do sistema ERP);</li>
                                <li>Garantir o funcionamento seguro, estável e disponível da plataforma;</li>
                                <li>Apoiar o cliente com suporte técnico, mediante solicitação;</li>
                                <li>Cumprir obrigações legais ou contratuais.</li>
                            </ul>
                            <p className="mt-2">
                                Não utilizamos os dados armazenados para qualquer finalidade comercial própria, como marketing ou análise de comportamento.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Responsabilidade dos clientes</h2>
                            <p>Os clientes da CS Solutions são responsáveis por:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Garantir que possuem base legal adequada (ex: consentimento, execução de contrato) para coletar e inserir dados no sistema;</li>
                                <li>Informar aos titulares como seus dados são tratados dentro do Sollus ERP;</li>
                                <li>Atender às solicitações dos titulares de dados (acesso, exclusão, retificação etc.).</li>
                            </ul>
                            <p className="mt-2">
                                A CS Solutions apenas executa as operações nos dados sob instrução do cliente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Dados coletados pela CS Solutions</h2>
                            <p>Coletamos <strong>dados técnicos e operacionais</strong> para garantir o funcionamento do sistema:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Logs de acesso e operações;</li>
                                <li>Endereço IP, tipo de dispositivo, navegador;</li>
                                <li>Informações de autenticação (usuário e permissões);</li>
                                <li>Informes sobre erros ou falhas.</li>
                            </ul>
                            <p className="mt-2">
                                Esses dados não são usados para identificação dos titulares, exceto quando necessário para segurança, suporte ou auditoria.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Compartilhamento e armazenamento</h2>
                            <p>Não compartilhamos dados armazenados nos sistemas com terceiros, salvo:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Quando expressamente autorizado pelo cliente;</li>
                                <li>Quando exigido por lei, ordem judicial ou órgãos competentes;</li>
                                <li>Com provedores de infraestrutura e hospedagem (data centers), sob estrito contrato de confidencialidade.</li>
                            </ul>
                            <p className="mt-2">
                                Todos os dados são armazenados em servidores seguros, com criptografia, controle de acesso e backups periódicos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Direitos dos titulares</h2>
                            <p>
                                Como operadora, a CS Solutions orienta que os <strong>titulares de dados entrem em contato diretamente com a empresa cliente (controladora)</strong> para exercer seus direitos previstos na LGPD:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Acesso, correção, exclusão ou portabilidade dos dados;</li>
                                <li>Informações sobre uso e compartilhamento;</li>
                                <li>Revogação de consentimento.</li>
                            </ul>
                            <p className="mt-2">
                                Caso um titular entre em contato conosco diretamente, encaminharemos a solicitação ao cliente correspondente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">7. Segurança da informação</h2>
                            <p>Adotamos boas práticas de segurança da informação e privacidade:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Acesso controlado por autenticação de usuário e senha;</li>
                                <li>Criptografia de dados em trânsito e em repouso;</li>
                                <li>Políticas de controle interno de acesso a dados;</li>
                                <li>Monitoramento e auditoria de logs;</li>
                                <li>Backups automáticos e segregados.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">8. DPO e contato para privacidade</h2>
                            <p>
                                Em caso de dúvidas sobre esta Política de Privacidade ou solicitações relacionadas ao tratamento de dados, o encarregado de proteção de dados (DPO) pode ser contatado em:
                            </p>
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                                <p><strong>E-mail:</strong> privacidade@cssolutions.com.br</p>
                                <p><strong>Responsável:</strong> Encarregado de Dados CS Solutions</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">9. Atualizações desta política</h2>
                            <p>
                                Esta política poderá ser atualizada a qualquer momento para refletir alterações legais, tecnológicas ou operacionais. A versão atualizada sempre estará disponível no sistema.
                            </p>
                        </section>

                        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                            <p className="font-semibold">CS Solutions Tecnologia</p>
                            <p>Desenvolvedora do Sollus ERP</p>
                            <p>Comprometida com segurança, privacidade e conformidade com a LGPD.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style jsx global>{`
        @media print {
          /* Reset global layout constraints preventing pagination */
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
          
          /* Override DashboardLayout specific classes that clip content */
          .h-screen {
            height: auto !important;
          }
          .overflow-hidden, .overflow-auto, .overflow-y-auto {
            overflow: visible !important;
          }

          /* Hide UI elements explicitly */
          header, aside, footer, .print\\:hidden {
            display: none !important;
          }
          
          /* Hide button specifically if not covered by above */
          button {
            display: none !important;
          }

          /* Ensure content flows and takes full width */
          #printable-content {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .container {
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Typographic optimizations for print */
          p, li {
            page-break-inside: avoid;
          }
          h1, h2, h3 {
            page-break-after: avoid;
          }
        }
      `}</style>
        </DashboardLayout>
    );
}
